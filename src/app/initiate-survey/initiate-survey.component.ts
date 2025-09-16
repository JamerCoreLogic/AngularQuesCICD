import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ViewChild, OnInit, Inject, ChangeDetectorRef, ElementRef, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedAdjusterService } from '../services/shared-adjuster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AiApiService } from '../services/ai-api.service';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
import { PreviewComponent } from './preview/preview.component';
import { EmailComponent } from './email/email.component';
import { MatLegacySelectChange } from '@angular/material/legacy-select';
import { interval, Subscription, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { AnonymousSubject } from 'rxjs/internal/Subject';
@Component({
  selector: 'app-initiate-survey',
  templateUrl: './initiate-survey.component.html',
  styleUrls: ['./initiate-survey.component.scss']
})
export class InitiateSurveyComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('fileInput') fileInput!: ElementRef;

  surveyForm: FormGroup;
  surveys: Survey[] = [];
  selectedFile: string = '';
  isUploading: boolean = false;
  uploadProgress: number = 0;
  isAllSelected: boolean = false;
  module: string = '';
  isSurveySelected: boolean = false;
  dataSource = new MatTableDataSource<PeriodicElement>();
  columnsToDisplay: string[] = [];
  pageSize = 10;
  isFileUploadAllowed = false;
  location: any;
  radius: any;
  private pollingSubscription?: Subscription;
  isPollingActive = false;     // Flag to show/hide the progress indicator
  currentCount = 0;            // Current count from the API response
  totalCount = 0;              // Initial count value to calculate progress
  progressValue = 0;           // Progress percentage for determinate mode
  listCount = 0;
  isPollingStopped: boolean = false;
  newGuid: any;
  file: File | null = null;
  fileToJasonData: any;
  requiredColumns:string[]=[];
  isFileSelected:boolean=false

  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private spinner: NgxSpinnerService,
    private sharedAS: SharedAdjusterService,
    private fb: FormBuilder,
    private aiApi: AiApiService,
    private dialog: MatLegacyDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.surveyForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(140)]],
      survey: ['', Validators.required],
      file: [null],
      location: ['',Validators.maxLength(500)],
      claimType: [''],
      noOfClaims: ['', [Validators.min(0), Validators.max(9999)]],
      lossType: ['']
    });
  }

  ngOnInit() {
    this.getSurveyList();
    this.router.queryParams.subscribe(params => {
      this.module = params['module'];
      if (this.module === 'Survey') {
        this.columnsToDisplay= ['Name', 'Phone', 'EmailId', 'Address', 'Action'];
        this.isFileUploadAllowed = true;
        this.surveyForm.get('file')?.setValidators(Validators.required);
        this.surveyForm.get('file')?.updateValueAndValidity
        // new cler the tabe data
        this.dataSource.data = [];
        
      } else if(this.module === 'Adjuster'){
        this.columnsToDisplay= ['Name', 'Phone', 'EmailId', 'Address', 'Distance', 'Action'];
        this.sharedAS.adjusterSelectedList$.subscribe((data: any) => {
          const mappedData = data.map((item: any) => ({
            Name: item.name || '',
            Phone: item.mobile || '',
            EmailId: item.emailAddress || '',
            Address: `${item.address1}, ${item.city}, ${item.state}, ${item.zip}, ${item.country}`,
            Distance: item.distance ? item.distance.toFixed(2) + ' miles' : 'N/A',
            selected: false,
            surveySentvia_Email:item.i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In,
            surveySentvia_SMS :item.i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In

          }));
    
          this.dataSource.data = mappedData;
    
        });
        this.isFileUploadAllowed = false;

      } else if(this.module === 'loss-map'){
        this.columnsToDisplay= ['Name', 'Phone', 'EmailId', 'Address', 'Distance', 'Action'];
        this.isFileUploadAllowed = false;
        this.sharedAS.adjusterSelectedList$.subscribe((data: any) => {
          // console.log('Adjuster Data:', data);
          const mappedData = data.map((item: any) => ({
            Name: item.name || '',
            Phone: item.mobile || '',
            EmailId: item.emailAddress || '',
            Address: `${item.address1}, ${item.city}, ${item.state}, ${item.zip}, ${item.country}`,
            Distance: item.distance ? item.distance : 'N/A',
            selected: false,
            surveySentvia_Email:item.i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In,
            surveySentvia_SMS :item.i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In

          }));
    
          this.dataSource.data = mappedData;
          
        });
      }
    });

   
    this.getSearchData();
  }

  ngAfterViewInit() {
    // console.log('Paginator:', this.paginator);
    // console.log('Sort:', this.sort);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getSearchData() {
    this.sharedAS.searchText$.subscribe((data: any) => {
      // console.log('Search Data:', data);
      this.location = data;
    });
    // this.sharedAS.radius$.subscribe((data: any) => {
    //   console.log('Radius Data:', data);
    //   // this.radius=(data/1609.34).toFixed(0);
    //   this.radius = data;
    //   console.log('Radius in miles:', this.radius);
    // });
    const savedFilterState = localStorage.getItem('findAdjusterSearch');
    if (savedFilterState) {
      const savedData = JSON.parse(savedFilterState);
      if (savedData.radius) {
        // Assuming radius is stored in meters, convert to miles if necessary
        let data = savedData.radius / 1609.34;
        this.radius = data;
      }}

  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        this.selectedFile = file.name; // Update the selected file name
        this.surveyForm.patchValue({ file: file }); // Update the form with the selected file

        const fileReader = new FileReader();
        fileReader.readAsBinaryString(file); // Use the selected file here
        fileReader.onload = () => {
            const binaryData = fileReader.result;
            const workbook = XLSX.read(binaryData, { type: 'binary' }); // Parse the file
            workbook.SheetNames.forEach(sheet => {
                const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]); // Convert to JSON
                if (this.validateFileData(jsonData)) {

                
                    this.fileToJasonData = jsonData; // Store valid JSON data
                    // console.log('JSON Data:', jsonData);
                    this.dataSource.data = jsonData.map((row: any) => ({
                        Name: row.Name || '',
                        Phone: row.mobile || row.Phone || '',
                        EmailId: row.EmailId || '',
                        Address: row.Address ||row.city   ||row.state || row.zip || row.country || '',
                        Distance: row.Distance || 'N/A',
                        Action: row.Action || '',
                        surveySentvia_SMS :row.i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In || false,
                        surveySentvia_Email:row.i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In || false
                    }));
                   this.getSmsAndEmailData()
                } else {
                    Swal.fire({
                        text: `The file must contain the following columns: ${this.requiredColumns.join(', ')}`,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ffa022',
                    });
                    this.resetForm();
                }
            });
        };

        fileReader.onerror = (error) => {
            console.error('Error reading file:', error);
            Swal.fire({
                text: 'Error reading the file. Please try again.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
            });
            this.resetForm();
        };
    }
}

  resetForm(): void {
    this.surveyForm.reset();
    this.selectedFile = '';
    this.dataSource.data = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.isSurveySelected = false;
    this.isFileSelected = false;
  }

  getSurveyList() {
    this.spinner.show();
    this.aiApi.getSurveyList().subscribe(
      (data: any) => {
        this.spinner.hide();
        this.surveys = data.data;
      },
      (error: any) => {
        this.spinner.hide();
        // console.log(error);
      }
    );
  }

  removeRow(row: PeriodicElement) {
    this.dataSource.data = this.dataSource.data.filter(element => element !== row);
  }

  previewQustion(data: any) {
    let previewData = {
      emailId: data.EmailId,
      aiInspectionSurveyId: this.surveyForm.get('survey')?.value
    };
    this.dialog.open(PreviewComponent, {
      data: { previewData },
      width: '95vw',
      height: '95vh',
      maxWidth: '95vw',
      maxHeight: '95vh'
    });
  }

  emailPreview(data: any) {
    let previewData = {
      aiInspectionSurveyId: this.surveyForm.get('survey').value,
      data: data,
      surveyLocation: this.surveyForm.get('location').value,
      claimType: this.surveyForm.get('claimType').value,
      NoOfClaims: this.surveyForm.get('noOfClaims').value,
      lossType: this.surveyForm.get('lossType').value
    };
    this.dialog.open(EmailComponent, {
      data: { previewData },
      width: '80%',
      height: '80%',
      maxWidth: '80%'
    });
  }

  onSurveySelect(event: MatLegacySelectChange) {
    // console.log('Survey Selected:', event.value);
    this.isSurveySelected = !!event.value;
    this.getDataSourceColumn(event.value);
  }
  sendSurvey() {
    const formValue = this.surveyForm.value;
    // console.log("formValue",formValue);
    if (this.dataSource.data.length === 0) {
      return;
    }
     this.newGuid = this.generateGuid();
     const selectedSurveyID = this.surveyForm.get('survey')?.value;
     const inspectionSendVia = this.surveys.find(x => x.aiInspectionSurveyId === selectedSurveyID)?.inspectionSendVia;

     if (inspectionSendVia === 1) {
      // inspectionSendVia === 1 means both SMS and Email are allowed then check if any of the user has opted out of both then remove them from the list
      this.dataSource.data = this.dataSource.data.filter(x => x.surveySentvia_SMS===true || x.surveySentvia_Email===true);
     }else if(inspectionSendVia === 0){
      // inspectionSendVia === 0 means only Email is allowed then check if any of the user has opted out of Email then remove them from the list
      this.dataSource.data = this.dataSource.data.filter(x => x.surveySentvia_Email===true);
     }


    const requestData = {
      aiInspectionSurveyId: this.surveys.find(x => x.aiInspectionSurveyId == formValue.survey)?.aiInspectionSurveyId, // Replace with actual ID if available
      surveyName: this.surveys.find(x => x.aiInspectionSurveyId == formValue.survey)?.surveyName, // Replace with actual survey name if available
      type: this.surveys.find(x => x.aiInspectionSurveyId == formValue.survey)?.type, // Replace with actual type if available
      title: formValue.title,
      requestGuid: this.newGuid, // Replace with actual GUID if available
      up_FileName: this.selectedFile,
      isMarkedComplete: false,
      radius: this.radius?.toString(), // Replace with actual radius if available
      location: this.location, // Replace with actual location if available
      surveyLocation: formValue.location,
      claimType: formValue.claimType,
      noOfClaims: formValue.noOfClaims?.toString(),
      lossType: formValue.lossType,
      requestList: this.dataSource.data.map(item => ({
        name: item.Name,
        phone: item.Phone?.toString(),
        emailId: item.EmailId,
        address: item.Address,
        distance:  item.Distance,
        surveySentvia_Email:item.surveySentvia_Email,
        surveySentvia_SMS:item.surveySentvia_SMS
      }))
    };
    // console.log('Request Data:', requestData);

    this.spinner.show();

    this.aiApi.sendSurvey(requestData).subscribe(
      (data: any) => {
        this.spinner.hide();
        // console.log(data);
        if(data['success']  ){
     
            this.listCount = data.data;
            this.startPolling(formValue.survey,this.newGuid);
        }else{
          Swal.fire({
            text: data['message'],
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          });
        }

      },
      (error: any) => {
        this.spinner.hide();
        // console.log(error);
      }
    );
  }
  // Method to start polling
 startPolling(inspectionID: any,guid:any): void {
  // debugger
  // Prevent starting a new polling if one is already active
  if (this.pollingSubscription) {
    console.warn('Polling is already active. Ignoring start request.');
    return;
  }
  this.isPollingStopped = false; // Reset the stop flag
  this.isPollingActive = true;
  
  this.pollingSubscription = interval(4000)  // Poll every 4 seconds
    .pipe(
      switchMap(() => this.aiApi.getInitiatedRecordCount(inspectionID,guid))
    )
    .subscribe(
      (response: any) => {
        this.currentCount = response.data;
        // console.log('Polling currentCount:', this.currentCount);
        // debugger
        // Set totalCount only on the first response
        if (this.totalCount === 0) {
          this.totalCount = this.listCount;
        }

        // Calculate and update progress
        this.progressValue = this.calculateProgress(this.currentCount, this.totalCount);

        // Stop polling when current count is zero
        if (this.currentCount == this.totalCount) {
          // console.log('Stopping polling as currentCount reached 0');
          this.stopPolling();
          this.showCompletionMessage();
        }
      },
      (error) => {
        console.error('Polling error:', error);
        this.stopPolling(); // Optionally stop polling on error
      }
    );
}

// Method to stop polling
stopPolling(): void {
  if (!this.pollingSubscription || this.isPollingStopped) {
    // console.log('Polling is already stopped or no active subscription.');
    return; // Prevent multiple stop attempts
  }

  this.isPollingStopped = true; // Mark polling as stopped
  this.pollingSubscription.unsubscribe();
  this.pollingSubscription = null;
  this.isPollingActive = false;
  this.currentCount = 0;
  this.totalCount = 0;
  this.progressValue = 0;
  

  // console.log('Polling stopped successfully.');
  // Call any additional completion logic here if needed
}


// Helper method to calculate progress percentage
calculateProgress(current: number, total: number): number {
  return total ? (current / total)  * 100 : 0 
}

// Optional: Display a completion message when polling ends
showCompletionMessage(): void {
  // Assuming this._popup.showPopup is a method to show popup notifications
 Swal.fire({
  text: 'Survey has been sent successfully.',
  icon: 'success',
  confirmButtonText: 'Ok',
  confirmButtonColor: '#ffa022',
}).then(() => {
    this.route.navigate(['/main/survey']);
  });
}

ngOnDestroy(): void {
  this.stopPolling();
}




  generateGuid(): string {
    // Using crypto API to generate a GUID-like string
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  validateFileData(data: any[]): boolean {
    // Check if required columns are present
    // console.log('validateFileData Data :', data);
    if (!data.length) return false;

    const columns = Object.keys(data[0]);
    const hasRequiredColumns = this.requiredColumns.every(col => columns.includes(col));

    return hasRequiredColumns;
}

getDataSourceColumn(aiInspectionSurveyId: any) {
  this.spinner.show();
  this.aiApi.getDataSourceColumn(aiInspectionSurveyId).subscribe(
    (rsp: any) => {
      this.spinner.hide();
      if (rsp && rsp.data) {
        this.requiredColumns = rsp.data;
        // i want to remove the column ["Location","ClaimType","NoOfClaims","LossType"] from the requiredColumns array
        this.requiredColumns = this.requiredColumns.filter(col => !["Location","ClaimType","NoOfClaims","LossType"].includes(col));
      }
      // console.log(rsp);
    },
    (error: any) => {
      this.spinner.hide();
      // console.log(error);
    }
  );
}

onSendSurveyClick(): void {
  if (!this.surveyForm.valid) {
    Swal.fire({
      text: 'Please fill in all required fields before sending the survey.',
      icon: 'info',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#ffa022',
    });
    return;
  }

  const selectedSurveyID = this.surveyForm.get('survey')?.value;
  const inspectionSendVia = this.surveys.find(x => x.aiInspectionSurveyId === selectedSurveyID)?.inspectionSendVia;
  const totalSelected = this.dataSource.data.length;
  const emailCount = this.dataSource.data.filter(x => !x.surveySentvia_Email).length;

  if (inspectionSendVia === 1) {
    const smsCount = this.dataSource.data.filter(x => !x.surveySentvia_SMS).length;
    const disableConfirmButton = totalSelected === smsCount && totalSelected === emailCount;

    Swal.fire({
      title: 'Send Survey?',
      html: `
      <p>You are about to send the survey to: <strong>${totalSelected}</strong> users</p>
      ${emailCount > 0 ? `<p><strong>${emailCount}</strong> users are opted out of email</p>` : ''}
     ${ smsCount> 0 ? `<p><strong>${smsCount}</strong> users are opted out of SMS</p>`: ''}
      <p>Do you want to continue?</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ffa022',
      didOpen: () => {
      const confirmButton = Swal.getConfirmButton();
      if (confirmButton) {
        confirmButton.disabled = disableConfirmButton;
      }
      },
    }).then((result) => {
      if (result.isConfirmed) {
      this.sendSurvey();
      }
    });
  } else {
    const disableConfirmButton = totalSelected === emailCount;
    Swal.fire({
      title: 'Send Survey?',
      html: `
        <p>You are about to send the survey to: <strong>${totalSelected}</strong> users</p>
        ${emailCount > 0 ? `<p><strong>${emailCount}</strong> users are opted out of email</p>` : ''}
        <p>Do you want to continue?</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ffa022',
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.disabled = disableConfirmButton;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.sendSurvey();
      }
    });
  }
}



onFileInputClick(): void {
  if (this.isSurveySelected) {
    this.fileInput.nativeElement.click();
  } else {
    Swal.fire({
      text: 'Please select a survey before uploading a file.',
      icon: 'info',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#ffa022',
    });
  }
}

getSmsAndEmailData(){
  this.newGuid = this.generateGuid();
  const requestData = {
    aiInspectionSurveyId:0, // Replace with actual ID if available
    surveyName: '', // Replace with actual survey name if available
    type: '', // Replace with actual type if available
    title: '',
    requestGuid: this.newGuid,//th actual GUID if available
    up_FileName: this.selectedFile,
    isMarkedComplete: false,
    radius: this.radius?.toString(), // Replace with actual radius if available
    location: this.location, // Replace with actual location if available
    requestList: this.dataSource.data.map(item => ({
      name: item.Name,
      phone: item.Phone?.toString(),
      emailId: item.EmailId.trim(),
      address: item.Address,
      distance:  item.Distance,
      surveySentvia_Email:item.surveySentvia_Email,
      surveySentvia_SMS:item.surveySentvia_SMS
    }))
  };
  this.spinner.show()
  
  this.aiApi.updateSurveyInfo(requestData).subscribe((data:any)=>{
    // console.log("updated data",data.data.requestList)
    this.dataSource.data= data.data.requestList.map((list:any)=>({
      Name: list.name,
      Phone: list.phone,
      EmailId: list.emailId,
      Address: list.address,
      Distance: list.distance,
      Action: list.Action || '',
      surveySentvia_SMS :list.surveySentvia_SMS,
      surveySentvia_Email:list.surveySentvia_Email
    }))
    this.spinner.hide()
    this.cdr.checkNoChanges()
  },
  (error: any) => {
    this.spinner.hide();
    // console.log(error);
  }
)
}

enforceMaxLength(event: Event): void {
  const input = event.target as HTMLInputElement;
  
  // Handle keydown events to prevent special characters
  if (event.type === 'keydown') {
    const e = event as KeyboardEvent;
    // Prevent 'e', '+', '-' characters which are sometimes allowed in number inputs
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
      e.preventDefault();
      return;
    }
  }
  
  // Handle keypress events that try to enter invalid characters
  if (event.type === 'keypress') {
    const e = event as KeyboardEvent;
    const char = String.fromCharCode(e.charCode);
    if (!/^\d$/.test(char)) {
      e.preventDefault();
      return;
    }
  }
  
  // Clean input for any existing non-numeric characters
  if (!/^\d*$/.test(input.value)) {
    input.value = input.value.replace(/[^0-9]/g, '');
  }
  
  // Enforce maximum length
  if (input.value.length > 4) {
    input.value = input.value.slice(0, 4);
  }
  
  // Update the form value to ensure validation is triggered properly
  const numValue = input.value ? parseInt(input.value, 10) : '';
  this.surveyForm.patchValue({ noOfClaims: numValue });
  this.cdr.detectChanges();
}


}

export interface PeriodicElement {
  Name: string;
  Phone: string;
  EmailId: string;
  Address: string;
  Distance: string;
  Action: string;
  selected?: boolean;
  surveySentvia_SMS:boolean;
  surveySentvia_Email:boolean
}

export interface Survey {
  aiInspectionSurveyId: number;
  surveyName: string;
  inspectionSendVia:number;
  type: string;
}