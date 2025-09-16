import Swal from 'sweetalert2';
import { AdjustersService } from './../../services/adjusters.service';
import { Component, OnInit, Inject, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ViewAdjusterInfoComponent } from '../view-adjuster-info/view-adjuster-info.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';

export interface DialogData {
  adjuster: any;
}

@Component({
  selector: 'app-initiate-request',
  templateUrl: './initiate-request.component.html',
  styleUrls: ['./initiate-request.component.scss'],
  providers: [AdjustersService]
})

export class InitiateRequestComponent implements OnInit, OnChanges {
  requestForm: FormGroup;
  clients: any[]= [];
  assessment: any[] = [];
  isViewState: boolean = false;
  minDate: Date;

  constructor( private fb: FormBuilder,
    private dialogRef: MatDialogRef<InitiateRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatDialog,
    private adjustersService: AdjustersService,
    private sharedAS:SharedAdjusterService,
    private spinner: NgxSpinnerService
    )
{
this.requestForm = this.fb.group({});
this.minDate = new Date();
}


ngOnChanges(changes: SimpleChanges): void {
  if(changes['data'] && changes['data'].currentValue) {
    const data = changes['data'].currentValue;
    this.updateFormValues(data);
  }
}


  ngOnInit(): void {
    this.initializeForm();
    this.updateFormValues(this.data);
    //console.log('data initate reques', this.data);


    this.adjustersService.GetClientList().subscribe((response:any ) => {
      if(response){
        for (const client of response.data) {
          this.clients.push({
            clientId: client.clientId,
            fullName: client.fName + ' ' + client.lName,
          });
          this.clients.sort((a, b) => a.fullName.localeCompare(b.fullName));
      }
      
      }

      this.adjustersService.GetAssessmentList().subscribe((response:any ) => {
        for(const assessment of response.data){
          this.assessment.push({
            assessmentId: assessment.assessmentTypeId,
            assessmentType: assessment.type,
          });
        }
        if(this.assessment){
          this.assessment.sort((a, b) => a.assessmentType.localeCompare(b.assessmentType));
          //console.log('assessment', this.assessment);
        }
      });
    });
  }

  private initializeForm(): void {
    this.requestForm = this.fb.group({
      title: ['', Validators.required],
      client: ['', Validators.required],
      assignmentType: ['', Validators.required],
      requestDate: ['', Validators.required],
      isSingleClaim: [true, Validators.required],
      description: ['', Validators.required]
    });
}

private updateFormValues(data: any): void {
    if(data?.data?.isViewRequest){
      this.isViewState = data.data?.isViewRequest || false;
      //console.log('update form in view', data.data.isSingleClaim);
      this.requestForm.disable();
      this.requestForm.patchValue({
        title: data.data.title || '',
        client: data.data.client || '',
        assignmentType: data.data.assignmentType || '',
        requestDate: data.data.date || '',
        isSingleClaim: data.data.isSingleClaim,
        description: data.data.description || ''
      });
    }
}

  isControlInvalid(controlName: string): boolean {
    const control = this.requestForm.controls[controlName];
    return control.invalid && control.touched;
  }

  onSubmit() {
    if (this.requestForm.valid) {
      this.spinner.show();
      const userID = localStorage.getItem('LoggeduserId');
       // Use a Set to remove duplicates from adjusterIds
      const adjusterIds = new Set(this.data.adjusters.map((adjuster: any) => adjuster.userId));

      const requestData = {
        ...this.requestForm.value,
        adjusterIds: Array.from(adjusterIds).join(','),
        createdBy: userID,
        distance: this.data.adjusters.map((adjuster: any) => adjuster.distance).join(','),
        searchLocation: this.sharedAS.getCurrentSearchText().toString().toUpperCase()
      };

      this.adjustersService.InitiateRequest(requestData).subscribe((response:any ) => {
        if(response.success == true){
          this.spinner.hide();
          Swal.fire({
            title: '',
            text: response.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
          this.dialogRef.close();
        }
        else{
          this.spinner.hide();
          Swal.fire({
            title: '',
            text: response.message,
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
        }

      }, error => {
        Swal.fire({
          title: '',
          text: 'Error submitting request:',
          icon: 'warning',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#ffa022',
        })
      });
    }else{
      this.requestForm.markAllAsTouched();
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  clearForm(){
    this.requestForm.reset();
  }
  viewAdjusterInfo(){
   //in swal fire i want to show the adjuster info in table format
   //console.log("view adjuster info", this.data.data);
   this.data.data.ajusterDetails = this.data.data.ajusterDetails.map((adjuster: any) => {
    return {
      ...adjuster,
      title: this.data.data.title,
    };
  });
  //console.log("view adjuster click", this.data.data.ajusterDetails);
  this.matDialog.open(ViewAdjusterInfoComponent, {
    panelClass: 'view_adjuster_info',
    data: {
      adjuster: this.data.data.ajusterDetails
    }
  });


  }
}
