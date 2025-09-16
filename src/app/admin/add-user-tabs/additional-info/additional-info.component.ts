import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs';
import { dateFormatValidator, dateRangeValidator, pastDateValidator } from 'src/app/models/date.validator';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss']
})
export class AdditionalInfoComponent implements OnInit {
  additionalInfoForm!: FormGroup;
  submit: boolean = false
  data: any
  @Input() editUserDataFromParent: any;
  isResume = false;
  UplodedfileName: any;
  today = new Date();
  userType = Number((localStorage.getItem('LoggedUserType')));
  private isLoadingData: boolean = false;  // Add flag to track data loading

  Assignments = ['Claims Supervisor', 'Desk Assignments', 'Field Assignments', 'File Review', 'Underwriting Field Inspections', 'Virtual Adjusting', 'W2 Positions']
  ClaimType = ['Both', 'CAT', 'Daily']
  Location_PreferenceOptions = ["Local", "In State", "Out of State"]
  OptionList1: string[] = ['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'];
  OptionList2: string[] = ["None", "Beginner", "Intermediate", "Advanced"]
  QuestionsExperience = [
    { "formControl": "residential_Property_Desk", "label": "Residential Property Desk*", "groupId": "1" },
    { "formControl": "residential_Property_Field", "label": "Residential Property Field*", "groupId": "1" },
    { "formControl": "casualty", "label": "Casualty", "groupId": "1" },
    { "formControl": "commercial_Property_Desk", "label": "Commercial Property Desk", "groupId": "1" },
    { "formControl": "commercial_Property_Field", "label": "Commercial Property Field", "groupId": "1" },
    { "formControl": "flood_Desk", "label": "Flood Desk", "groupId": "1" },
    { "formControl": "flood_Field", "label": "Flood Field", "groupId": "1" }]

  QuestionsSpecialties = [
    { "formControl": "auto", "label": "Auto", "groupId": "2" },
    { "formControl": "auto_Appraisal", "label": "Auto Appraisal", "groupId": "2" },
    { "formControl": "construction", "label": "Construction", "groupId": "2" },
    { "formControl": "construction_Defect", "label": "Construction Defect", "groupId": "2" },
    { "formControl": "general_Liability", "label": "General Liability", "groupId": "2" },
    { "formControl": "heavy_Equipment", "label": "Heavy Equipment", "groupId": "2" },
    { "formControl": "homeowner_Liability", "label": "Homeowner Liability", "groupId": "2" },
    { "formControl": "inland_Marine", "label": "Inland Marine", "groupId": "2" },
    { "formControl": "on_SceneInvestigations", "label": "On Scene Investigations", "groupId": "2" }]

  QuestionsPropertySpe = [
    { "formControl": "business_Interruption", "label": "Business Interruption/Time Element Losses", "groupId": "3" },
    { "formControl": "claims_Supervisor", "label": "Claims Supervisor", "groupId": "3" },
    { "formControl": "crop", "label": "Crop", "groupId": "3" },
    { "formControl": "earthquake", "label": "Earthquake", "groupId": "3" },
    { "formControl": "environment_Disaster", "label": "Environmental Disaster", "groupId": "3" },
    { "formControl": "high_End_Residential", "label": "High End Residential", "groupId": "3" },
    { "formControl": "large_Loss_Commercial", "label": "Large Loss Commercial", "groupId": "3" },
    { "formControl": "large_Loss_Contents", "label": "Large Loss Contents", "groupId": "3" },
    { "formControl": "large_Loss_Fire", "label": "Large Loss Fire", "groupId": "3" },
    { "formControl": "litigation", "label": "Litigation", "groupId": "3" },
    { "formControl": "mobile_Homes", "label": "Mobile Homes", "groupId": "3" },
    { "formControl": "municipality_Losses", "label": "Municipality Losses", "groupId": "3" },
    { "formControl": "sinkhole", "label": "Sinkhole", "groupId": "3" },
    { "formControl": "water_Mitigation_Estimating", "label": "Water Mitigation Estimating", "groupId": "3" }]

  QuestionsSoftwareKnow = [
    { "formControl": "fileTrac", "label": "FileTrac*", "groupId": "4" },
    { "formControl": "xactimate_Estimating", "label": "Xactimate Estimating*", "groupId": "4" },
    { "formControl": "claimXperience", "label": "ClaimXperience", "groupId": "4" },
    { "formControl": "clickClaims", "label": "Click Claims", "groupId": "4" },
    { "formControl": "guidewire", "label": "Guidewire", "groupId": "4" },
    { "formControl": "hover", "label": "Hover", "groupId": "4" },
    { "formControl": "mitchell", "label": "Mitchell", "groupId": "4" },
    { "formControl": "plnar", "label": "PLNAR", "groupId": "4" },
    { "formControl": "symbility", "label": "Symbility", "groupId": "4" },
    { "formControl": "xactAnalysis", "label": "XactAnalysis", "groupId": "4" },
    { "formControl": "xactimate_Collaboration", "label": "Xactimate Collaboration", "groupId": "4" }]

  constructor(public fb: FormBuilder, private authService: AuthService, private el: ElementRef) {
    this.createAdditionalInfoForm();

  }

  PostUserData(EditUserDataFromParent: any) {
    this.data = EditUserDataFromParent;
    if (this.data) {
      this.FetchUser();
      // Ensure form is marked as valid after data loading
      setTimeout(() => {
        this.markDateControlAsValid();
      }, 200);
    }
  }

  private markDateControlAsValid() {
    const dateControl = this.additionalInfoForm.get('approximate_Date_I_Began_Adjusting');
    if (dateControl && dateControl.value instanceof Date && !isNaN(dateControl.value.getTime())) {
      dateControl.setErrors(null);
      dateControl.markAsPristine();
      dateControl.markAsUntouched();
    }
  }

  parseAPIDateAsUTC(dateString: string): Date {
    return new Date(dateString);
  }
 
  FetchUser() {
    // Set loading flag to prevent validation during data loading
    this.isLoadingData = true;
    
    // Clear existing FormArrays to prevent duplicates
    this.setNullValuesInCheckboxFields();
    
    if (this.data.skillsAndWorkHistory[0]) {
      debugger;
      // Handle date field separately
      if (this.data.skillsAndWorkHistory[0]?.approximate_Date_I_Began_Adjusting) {
        const originalDateString = this.data.skillsAndWorkHistory[0].approximate_Date_I_Began_Adjusting;
        
        
        // Parse the API date as UTC and convert to local timezone to get the correct date
        const utcDate = this.parseAPIDateAsUTC(originalDateString);
        // console.log("UTC parsed date:", utcDate);
        
        if (!isNaN(utcDate.getTime())) {
          // Extract the local date components after timezone conversion
          const localDate = new Date(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate());
          
          const dateControl = this.additionalInfoForm.controls['approximate_Date_I_Began_Adjusting'];
          
          // Clear validators and errors completely during data loading
          dateControl.clearValidators();
          dateControl.setErrors(null);
          
          // Set value without emitting events
          dateControl.setValue(localDate, { emitEvent: false });
          dateControl.markAsPristine();
          dateControl.markAsUntouched();
          
          // Verify after setting
          setTimeout(() => {
            // console.log("Control value after setting:", dateControl.value);
            // console.log("Control displays:", dateControl.value instanceof Date ? dateControl.value.toLocaleDateString() : dateControl.value);
          }, 50);
        }
      }

      // Handle FormArray for assignments
      if (this.data.skillsAndWorkHistory[0]?.i_Am_Interested_In_The_Following_Assignments != null) {
        const formArray = this.additionalInfoForm.get('i_Am_Interested_In_The_Following_Assignments') as FormArray;
        
        // Helper function to ensure data is in array format
        const ensureArray = (value: any): any[] => {
          if (!value) return [];
          if (typeof value === 'string') {
            return value.split(',').filter(item => item.trim() !== '');
          }
          return Array.isArray(value) ? value : [];
        };

        const valuesArray = ensureArray(this.data.skillsAndWorkHistory[0].i_Am_Interested_In_The_Following_Assignments);
        valuesArray.forEach((value: any) => {
          if (value && value.trim() !== '') {
            formArray.push(new FormControl(value.trim()));
          }
        });
      }

      // Patch other form values (excluding the FormArray since we handled it manually)
      const dataForPatch = { ...this.data.skillsAndWorkHistory[0] };
      delete dataForPatch.i_Am_Interested_In_The_Following_Assignments;
      
      this.additionalInfoForm.patchValue(dataForPatch);
      this.isValidBase64Resume();
      this.UplodedfileName = this.data.fName + ' ' + this.data.lName + ' ' + 'resume' + '.pdf';
      //console.log('uploaded file name', this.UplodedfileName)
    }
    
    // Reset loading flag after data is loaded
    setTimeout(() => {
      this.isLoadingData = false;
    }, 100);
  }

  ngOnInit(): void {
    // Delay setting up date validation to prevent conflicts during data loading
    setTimeout(() => {
      this.listenForDateInputChanges();
    }, 500);
    this.isAdditionalInfoFormView();
  }
  listenForDateInputChanges() {
    this.additionalInfoForm.get('approximate_Date_I_Began_Adjusting')?.valueChanges
      .pipe(
        debounceTime(300), // Increased delay to prevent rapid updates
        distinctUntilChanged() // Only emit when value actually changes
      )
      .subscribe(val => {
        // Skip validation during data loading
        if (this.isLoadingData) {
          return;
        }
        
        const control = this.additionalInfoForm.get('approximate_Date_I_Began_Adjusting');
        if (control) {
          // Only validate if the form is being interacted with (not during initial data loading)
          if (val && control.dirty) {
            // Simple validation for Date objects
            if (!(val instanceof Date) || isNaN(val.getTime())) {
              control.setErrors({ 'invalidDateFormat': true });
            } else {
              const today = new Date();
              if (val > today) {
                control.setErrors({ 'futureDate': true });
              } else if (val < new Date("1950-01-01")) {
                control.setErrors({ 'dateRange': true });
              } else {
                // Clear errors if validation passes
                control.setErrors(null);
              }
            }
          }
        }
      });
  }

  getControlName(Qlist: any[], i: any) {
    return Qlist[i].formControl
  }
  getLabel(label: string) {
    if (label.endsWith('*')) {
      return label.slice(0, -1);
    }
    else {
      return label
    }
  }
  isLastAsterisk(label: string): boolean {
    return label.endsWith('*');
  }
  createAdditionalInfoForm() {  
    this.additionalInfoForm = this.fb.group({
      adjusterInformationId: [1],
      approximate_Date_I_Began_Adjusting: [null],
      i_Am_Interested_In_The_Following_Assignments: this.fb.array([]),
      what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned: [, [Validators.required]],
      location_Preference:[,[Validators.required]],
      largest_Claim_I_Have_Handled: [, [Validators.min(0)]],
      xactNetAddressSkill:[],
      writing_Denial_Or_Coverage_Letters: [],
      experience_With_PAs: [],
      experience_With_AOB: [],
      fluent_In_Spanish: [],
      what_Sets_You_Apart_From_Other_Adjusters: [],
      iA_Firms_I_Have_Worked_With: [],
      carriers_You_Have_Worked_For: [],
      residential_Property_Desk: [, [Validators.required]],
      residential_Property_Field: [, [Validators.required]],
      commercial_Property_Desk: [],
      commercial_Property_Field: [],
      flood_Desk: [],
      flood_Field: [],
      casualty: [],
      auto: [],
      auto_Appraisal: [],
      heavy_Equipment: [],
      on_SceneInvestigations: [],
      homeowner_Liability: [],
      inland_Marine:[],
      general_Liability: [],
      construction: [],
      construction_Defect: [],
      sinkhole: [],
      water_Mitigation_Estimating: [],
      crop: [],
      large_Loss_Contents: [],
      large_Loss_Fire: [],
      large_Loss_Commercial: [],
      litigation: [],
      high_End_Residential: [],
      business_Interruption: [],
      mobile_Homes: [],
      municipality_Losses: [],
      claims_Supervisor: [],
      earthquake: [],
      environment_Disaster: [],
      xactimate_Estimating: [, [Validators.required]],
      xactimate_Collaboration: [],
      xactAnalysis: [],
      mitchell: [],
      symbility: [],
      guidewire: [],
      hover: [],
      claimXperience: [],
      plnar: [],
      fileTrac: [, [Validators.required]],
      clickClaims: [],
      resume: [],
      resumeFileName: [],
      file_Review_Experience: [],
      bio_Or_Mini_Resume: [, [Validators.maxLength(1000)]],
      userId: [],
      // auto_Liability: [],
      // auto_Total_Loss: [],
      // auto_Commertial: [],
      // juris: [],
      // next_Gen: [],
      // fox_Pro: [],
      // aS400: [],
      // simsol: [],
      // diamond: [],
      // isDeleted: [],
      // createdOn: [],
      // modifiedOn: [],
      createdBy: [Number(localStorage.getItem('LoggeduserId'))],
      modifiedBy: [Number(localStorage.getItem('LoggeduserId'))]
    })
  }


  onCheckboxChangeforAssignments(event: any) {
     
    const formArray = this.additionalInfoForm.get('i_Am_Interested_In_The_Following_Assignments') as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.source.value);
      formArray.removeAt(index);
    }
    //console.log(this.additionalInfoForm.get('i_Am_Interested_In_The_Following_Assignments')?.value);
  }

  isAssignmentCheckedOnEdit(assignment: string): boolean {
    const formArray = this.additionalInfoForm.get('i_Am_Interested_In_The_Following_Assignments') as FormArray;
    // return formArray.controls.some(control => control.value === assignment);
    return formArray.value.includes(assignment);
  }

  restrictEnteringE(event: KeyboardEvent) {
    const inputElement = (event.target as HTMLInputElement).value;
    //console.log("Value is:  ", inputElement)
    if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-' || event.key === '.') {
      event.preventDefault();
    }
  }

  handleFileInput(event: any) {
     
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file = files.item(0);
      if (file) {
        this.convertToBase64(file);
      }
    }
  }
  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Use the base64String as needed
      //console.log(base64String);
    };
    reader.readAsDataURL(file);
  }

  onKeyDown(event: KeyboardEvent, row: number, col: number) {
    if (event.key === 'Tab') {
      event.preventDefault();
      const nextRow = (col === this.OptionList1.length - 1) ? row + 1 : row;
      const nextCol = (col + 1) % this.OptionList1.length;
      const nextRadio: HTMLElement | null = document.getElementById(`radio-${nextRow}-${nextCol}`);
      if (nextRadio) {
        nextRadio.focus();
      }

    }
  }
  isFileUploaded: boolean = false;
  onFileSelected(event: any) {
    if (this.isFileUploaded) {
      Swal.fire({
        title: '',
        text: 'A file already uploaded . Do you want to replace it?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#ffa022',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, replace it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.uploadFile(event);
        }
      });
    } else {
      this.uploadFile(event);
    }
  }
  uploadFile(event: any) {
    //console.log("this.data for user data", this.data)
    const inputElement = event.target as HTMLInputElement;
    const file: File | null = inputElement.files ? inputElement.files[0] : null;
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file && file.size > maxFileSize) {
      Swal.fire({
        title: '',
        text: 'File size exceeds the 10MB limit.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      });
      inputElement.value = '';
      return;
    }
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const fileContent: string | ArrayBuffer = e.target.result;
        if (typeof fileContent === 'string') {
          const base64String: string = btoa(fileContent);
          this.additionalInfoForm.patchValue({ resume: base64String });
          this.additionalInfoForm.patchValue({ resumeFileName: file.name });
          this.UplodedfileName = file.name;
          this.isValidBase64Resume()
          Swal.fire({
            title: '',
            text: 'File uploaded successfully',
            icon: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
        } else {
          console.error('Failed to convert file to base64 string.');
          inputElement.value = '';
        }
      };
      reader.readAsBinaryString(file);
    }
    inputElement.value = '';
  }

  isValidBase64Resume() {
    const resumeBase64 = this.additionalInfoForm.controls['resume'].value
    if (resumeBase64 && resumeBase64.length > 100) {
      const decoded = atob(resumeBase64);
      const encoded = btoa(resumeBase64);
      this.isResume = encoded === resumeBase64;
      this.isResume = true;
      this.isFileUploaded = true; // Set the flag to true when a file is uploaded
    }
    else {
      this.isResume = false;
      this.isFileUploaded = false; // Set the flag to false when the file upload fails
    }
  }

  downloadPDF(base64String: string, fileName: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Append the link to the document body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
  getQuestionByKey(key: string) {
    const allQuestions = [
      ...this.QuestionsExperience,
      ...this.QuestionsSpecialties,
      ...this.QuestionsPropertySpe,
      ...this.QuestionsSoftwareKnow
    ];
    return allQuestions.find((question) => question.formControl === key);
  }
  scrollToParagraph(paragraphId: string) {
    const paragraph = document.getElementById(paragraphId);
    if (paragraph) {
      paragraph.scrollIntoView({ behavior: 'smooth' });
    }
  }
  getCleanFormValues() {
    const formValue = this.additionalInfoForm.getRawValue();
    
    // Convert FormArray values to proper arrays
    return {
      ...formValue,
      i_Am_Interested_In_The_Following_Assignments: (this.additionalInfoForm.get('i_Am_Interested_In_The_Following_Assignments') as FormArray).value || []
    };
  }
  isAdditionalInfoFormValid() { 
    if (this.userType == 1) {
      let obj = {
        additionalInfoForm: this.getCleanFormValues()
      }
      return obj;
    }
    if (this.additionalInfoForm.valid == false) {
       
      this.submit = true;
      for (const key of Object.keys(this.additionalInfoForm.controls)) {
        if (this.additionalInfoForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          if (invalidControl) {
            invalidControl.focus();
          } else {
            // Handle the case when the control is not found
            //console.log(`Form control with name ${key} not found.`);
            const question = this.getQuestionByKey(key);
            if (question) {
              this.scrollToParagraph(question.groupId);
            }
          }
          Swal.fire({
            title: '',
            text: 'Please fill all the required fields (marked with * ).',
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
          break;
        }
      }
      return false
    }
    else {
       
      let obj = {
        additionalInfoForm: this.getCleanFormValues()
      }
      return obj;
    }
  }
  isAdditionalInfoFormDirty() {
    return this.additionalInfoForm.dirty;
  }
  isview:boolean=true;
  isAdditionalInfoFormView(){
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    const path = currentUrlObj.pathname;
    if(['/main/admin/view-profile'].includes(path)){
      this.additionalInfoForm.disable()
      this.isview=false 
      }
  }
  clearValidationForInternal(){
    // debugger;
    this.additionalInfoForm.clearValidators();
this.additionalInfoForm.setValidators(null);
this.additionalInfoForm.updateValueAndValidity();
return true
  }

  reset() {
    this.submit = false;
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    if (currentUrlObj.pathname == "/main/admin/add-user-tabs") {
      if (localStorage.getItem('editUser')) {
        let edituser = JSON.parse(localStorage.getItem('editUser') || '');
        this.setNullValuesInCheckboxFields()
        this.FetchUser();
      }
      else {
        this.additionalInfoForm.reset();
        this.setNullValuesInCheckboxFields()
        this.additionalInfoForm.controls['adjusterInformationId'].setValue(1)
      }
    }
    else if (currentUrlObj.pathname == "/main/admin/update-profile") {
      let loggedUserid = localStorage.getItem('LoggeduserId');
      // Note: You should set this.data with the user data before calling FetchUser()
      // this.data = fetchedUserData; // Set appropriate user data here
      this.setNullValuesInCheckboxFields()
      this.FetchUser();
    }
  }
  setNullValuesInCheckboxFields() {
    const assignments = this.additionalInfoForm.get('i_Am_Interested_In_The_Following_Assignments') as FormArray;
    assignments.clear();
  }


  enableEditMode() {
    this.additionalInfoForm.enable();
    this.isview=true
  }

  // Custom validators that work with Date objects for matDatepicker (kept for reference but not actively used)
  dateObjectValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    // Check if it's a valid Date object
    if (value instanceof Date && !isNaN(value.getTime())) {
      return null;
    }
    
    return { 'invalidDateFormat': 'Invalid date' };
  }

  pastDateObjectValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    if (value instanceof Date && !isNaN(value.getTime())) {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today
      const isInPast = value <= today;
      return isInPast ? null : { 'futureDate': 'The date should be in the past' };
    }
    
    return { 'invalidDateFormat': 'Invalid date' };
  }

  dateRangeObjectValidator = (minDate: Date, maxDate: Date): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      if (value instanceof Date && !isNaN(value.getTime())) {
        if (value < minDate || value > maxDate) {
          return { 'dateRange': `The date should be between ${minDate.toLocaleDateString()} and ${maxDate.toLocaleDateString()}` };
        }
        return null;
      }
      
      return { 'invalidDateFormat': 'Invalid date' };
    };
  }
}
function parseISO(arg0: string): any {
  throw new Error('Function not implemented.');
}

