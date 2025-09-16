import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liences-and-certification',
  templateUrl: './liences-and-certification.component.html',
  styleUrls: ['./liences-and-certification.component.scss']
})
export class LiencesAndCertificationComponent implements OnInit {
  licenceAndCertificateForm!: FormGroup
  data: any
  @Input() editUserDataFromParent: any;
  submit: boolean = false
  certificatelist = ['AIC', 'ARM', 'CPCU', 'Haag Commercial', 'Haag Residential', 'HAAG Reviewer', 'IICRC', 'PTC1', 'PTC2', 'PTC3', 'Other'];
  insurancelist = ["American Family", "Earthquake", "Florida Citizens", "Liberty Mutual", "NFIP/Flood", "Nationwide", "Part 107 Drone License", "Rope and Harness", "State Farm", "The Hartford", "Tower Hill", "TWIA", "USAA", "Zurich", "Other"]
  States = [{ "name": "Alabama", "abbreviation": "AL" }, { "name": "Alaska", "abbreviation": "AK" }, { "name": "Arizona", "abbreviation": "AZ" }, { "name": "Arkansas", "abbreviation": "AR" }, { "name": "California", "abbreviation": "CA" }, { "name": "Colorado", "abbreviation": "CO" }, { "name": "Connecticut", "abbreviation": "CT" }, { "name": "Delaware", "abbreviation": "DE" }, { "name": "Florida", "abbreviation": "FL" }, { "name": "Georgia", "abbreviation": "GA" }, { "name": "Hawaii", "abbreviation": "HI" }, { "name": "Idaho", "abbreviation": "ID" }, { "name": "Illinois", "abbreviation": "IL" }, { "name": "Indiana", "abbreviation": "IN" }, { "name": "Iowa", "abbreviation": "IA" }, { "name": "Kansas", "abbreviation": "KS" }, { "name": "Kentucky", "abbreviation": "KY" }, { "name": "Louisiana", "abbreviation": "LA" }, { "name": "Maine", "abbreviation": "ME" }, { "name": "Maryland", "abbreviation": "MD" }, { "name": "Massachusetts", "abbreviation": "MA" }, { "name": "Michigan", "abbreviation": "MI" }, { "name": "Minnesota", "abbreviation": "MN" }, { "name": "Mississippi", "abbreviation": "MS" }, { "name": "Missouri", "abbreviation": "MO" }, { "name": "Montana", "abbreviation": "MT" }, { "name": "Nebraska", "abbreviation": "NE" }, { "name": "Nevada", "abbreviation": "NV" }, { "name": "New Hampshire", "abbreviation": "NH" }, { "name": "New Jersey", "abbreviation": "NJ" }, { "name": "New Mexico", "abbreviation": "NM" }, { "name": "New York", "abbreviation": "NY" }, { "name": "North Carolina", "abbreviation": "NC" }, { "name": "North Dakota", "abbreviation": "ND" }, { "name": "Ohio", "abbreviation": "OH" }, { "name": "Oklahoma", "abbreviation": "OK" }, { "name": "Oregon", "abbreviation": "OR" }, { "name": "Pennsylvania", "abbreviation": "PA" }, { "name": "Rhode Island", "abbreviation": "RI" }, { "name": "South Carolina", "abbreviation": "SC" }, { "name": "South Dakota", "abbreviation": "SD" }, { "name": "Tennessee", "abbreviation": "TN" }, { "name": "Texas", "abbreviation": "TX" }, { "name": "Utah", "abbreviation": "UT" }, { "name": "Vermont", "abbreviation": "VT" }, { "name": "Virginia", "abbreviation": "VA" }, { "name": "Washington", "abbreviation": "WA" }, { "name": "West Virginia", "abbreviation": "WV" }, { "name": "Wisconsin", "abbreviation": "WI" }, { "name": "Wyoming", "abbreviation": "WY" }]
  isinsurance_Designations_Other: boolean = false;
  iscertifications_Other: boolean = false
  isfcn: boolean = false;
  ishow_Did_You_Hear_About_Us_Other: boolean = false
  userType = Number((localStorage.getItem('LoggedUserType')));

  constructor(private fb: FormBuilder, private authService: AuthService, private el: ElementRef) {
    this.createLicenceAndCertificateForm();

  }

  PostUserData(EditUserDataFromParent: any) {
    this.data = EditUserDataFromParent;
    if (this.data) {
      this.FetchUser();
    }
  }
  FetchUser() {
    // Clear existing FormArrays to prevent duplicates
    this.setNullValuesInCheckboxFields();
    
    // Helper function to ensure data is in array format
    const ensureArray = (value: any): any[] => {
      if (!value) return [];
      if (typeof value === 'string') {
        return value.split(',').filter(item => item.trim() !== '');
      }
      return Array.isArray(value) ? value : [];
    };

    // Populate insurance_Designations
    if (this.data?.insurance_Designations != null) {
      const formArray = this.licenceAndCertificateForm.get('insurance_Designations') as FormArray;
      const valuesArray = ensureArray(this.data.insurance_Designations);
      valuesArray.forEach((value: any) => {
        if (value && value.trim() !== '') {
          formArray.push(new FormControl(value.trim()));
        }
      });
    }
    
    // Populate certifications
    if (this.data?.certifications != null) {
      const formArray = this.licenceAndCertificateForm.get('certifications') as FormArray;
      const valuesArray = ensureArray(this.data.certifications);
      valuesArray.forEach((value: any) => {
        if (value && value.trim() !== '') {
          formArray.push(new FormControl(value.trim()));
        }
      });
    }
    
    // Populate adjuster_Licenses
    if (this.data?.adjuster_Licenses != null) {
      const formArray = this.licenceAndCertificateForm.get('adjuster_Licenses') as FormArray;
      const valuesArray = ensureArray(this.data.adjuster_Licenses);
      valuesArray.forEach((value: any) => {
        if (value && value.trim() !== '') {
          formArray.push(new FormControl(value.trim()));
        }
      });
    }
    
    // Patch other form values (excluding the FormArrays since we handled them manually)
    const dataForPatch = { ...this.data };
    delete dataForPatch.insurance_Designations;
    delete dataForPatch.certifications;
    delete dataForPatch.adjuster_Licenses;
    
    this.licenceAndCertificateForm.patchValue(dataForPatch);
    //console.log("this.licenceAndCertificateForm", this.licenceAndCertificateForm.value);
  }

  ngOnInit(): void {
    this.isCertificateFormView()
  }
  minArrayLength(min: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: any } | null => {
      if (c.value && c.value.length >= min) {
        return null; // validation passes
      } else {
        return { 'minArrayLength': { valid: false } }; // validation fails
      }
    };
  }

  createLicenceAndCertificateForm() {
    this.licenceAndCertificateForm = this.fb.group({
      insurance_Designations: this.fb.array([]),
      insurance_Designations_Other: [],
      certifications: this.fb.array([]),
      certifications_Other: [],
      adjuster_Licenses: this.fb.array([],this.minArrayLength(1)),
      fcn: [],
      national_Producer_Number: [, [Validators.required, Validators.minLength(8)]],
      how_Did_You_Hear_About_Us: [, [Validators.required]],
      how_Did_You_Hear_About_Us_Other: [],      //validations are removed since default it is hide, we are adding validations late
    })
    this.licenceAndCertificateForm.get('insurance_Designations')?.valueChanges.subscribe(() => {
      this.showInsurance_Designations_Other();
    });
    this.licenceAndCertificateForm.get('certifications')?.valueChanges.subscribe(() => {
      this.showCertifications_OtherAndFcn();
    });
    this.licenceAndCertificateForm.get('how_Did_You_Hear_About_Us')?.valueChanges.subscribe(() => {
      this.showHow_Did_You_Hear_About_Us_Other();
    });
  }

  showInsurance_Designations_Other() {
    var insurance_Designations = this.licenceAndCertificateForm.get('insurance_Designations')?.value
    const foundItem = insurance_Designations.find((item: any) => item.includes('Other'));
    if (foundItem) {
      this.isinsurance_Designations_Other = true

    } else {
      this.licenceAndCertificateForm.get('insurance_Designations_Other')?.setValue('')
      this.isinsurance_Designations_Other = false
    }
  }
  showCertifications_OtherAndFcn() {
    var certifications = this.licenceAndCertificateForm.get('certifications')?.value
    const foundItem2 = certifications.find((item: any) => item.includes("Other"));
    if (foundItem2) {
      this.iscertifications_Other = true

    } else {
      this.licenceAndCertificateForm.get('certifications_Other')?.setValue('')
      this.iscertifications_Other = false
    }
    const foundItem3 = certifications.find((item: any) => item.includes("NFIP/Flood"));
    if (foundItem3) {
      this.isfcn = true;

    } else {
      this.licenceAndCertificateForm.get('fcn')?.setValue('')
      this.isfcn = false;
    }
  }
  showHow_Did_You_Hear_About_Us_Other() {
    var how_Did_You_Hear_About_Us = this.licenceAndCertificateForm.get('how_Did_You_Hear_About_Us')?.value
    // if (how_Did_You_Hear_About_Us) {
    if (how_Did_You_Hear_About_Us == 'Other') {
      this.ishow_Did_You_Hear_About_Us_Other = true
      this.licenceAndCertificateForm.get('how_Did_You_Hear_About_Us_Other')?.setValidators(Validators.required);
      this.licenceAndCertificateForm.get('how_Did_You_Hear_About_Us_Other')?.updateValueAndValidity()
    } else {
      this.licenceAndCertificateForm.get('how_Did_You_Hear_About_Us_Other')?.setValue('')
      this.licenceAndCertificateForm.get('how_Did_You_Hear_About_Us_Other')?.clearValidators();
      this.licenceAndCertificateForm.get('how_Did_You_Hear_About_Us_Other')?.updateValueAndValidity()
      this.ishow_Did_You_Hear_About_Us_Other = false
    }
    // }
  }

  onCheckboxChangeforInsurance_Designations(event: any) {
    const formArray = this.licenceAndCertificateForm.get('insurance_Designations') as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.source.value);
      formArray.removeAt(index);
    }
    //console.log(this.licenceAndCertificateForm.get('insurance_Designations')?.value);
  }
  isinsurance_DesignationsOnEdit(assignment: string): boolean {
    const formArray = this.licenceAndCertificateForm.get('insurance_Designations') as FormArray;
    return formArray.value.includes(assignment);
  }
  onCheckboxChangeforCertifications(event: any) {
    const formArray = this.licenceAndCertificateForm.get('certifications') as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.source.value);
      formArray.removeAt(index);
    }
    //console.log(this.licenceAndCertificateForm.get('certifications')?.value);
  }
  iscertificationsOnEdit(assignment: string): boolean {
    const formArray = this.licenceAndCertificateForm.get('certifications') as FormArray;
    return formArray.value.includes(assignment);
  }
  onCheckboxChangeforAdjuster_Licenses(event: any) {
    const formArray = this.licenceAndCertificateForm.get('adjuster_Licenses') as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.source.value);
      formArray.removeAt(index);
    }
    //console.log(this.licenceAndCertificateForm.get('adjuster_Licenses')?.value);
  }
  isadjuster_LicensesOnEdit(assignment: string): boolean {
    const formArray = this.licenceAndCertificateForm.get('adjuster_Licenses') as FormArray;
    return formArray.value.includes(assignment);
  }
  restrictEnteringE(event: KeyboardEvent) {
    // allow  navigation keys and backspace
    if (event.key === 'Tab' || event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'Backspace' || event.key === 'Delete') {
      return;
    }
    if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-' || event.key === '.') {
      event.preventDefault();
    }
    // dont allwo to perform copy paste
    if (event.ctrlKey && (event.key === 'c' || event.key === 'C' || event.key === 'v' || event.key === 'V')) {
      event.preventDefault();
    }
    // also only allow max 10 characters
    if ((event.target as HTMLInputElement).value.length >= 10) {
      event.preventDefault();
    }
  }
  scrollToParagraph(paragraphId: string) {
    const paragraph = document.getElementById(paragraphId);
    if (paragraph) {
      paragraph.scrollIntoView({ behavior: 'smooth' });
    }
  }
  getCleanFormValues() {
    const formValue = this.licenceAndCertificateForm.getRawValue();
    
    // Convert FormArray values to proper arrays
    return {
      ...formValue,
      insurance_Designations: (this.licenceAndCertificateForm.get('insurance_Designations') as FormArray).value || [],
      certifications: (this.licenceAndCertificateForm.get('certifications') as FormArray).value || [],
      adjuster_Licenses: (this.licenceAndCertificateForm.get('adjuster_Licenses') as FormArray).value || []
    };
  }

  isCertificateFormValid() {
    // debugger
    if (this.userType == 1) {
      let obj = {
        licenceAndCertificateForm: this.getCleanFormValues()
      }
      return obj;
    }
     // Check if 'adjuster_Licenses' has at least one entry
     const adjusterLicensesControl = this.licenceAndCertificateForm.get('adjuster_Licenses');
     if (adjusterLicensesControl && adjusterLicensesControl instanceof FormArray) {
       if (adjusterLicensesControl.length === 0 || adjusterLicensesControl.controls.every(control => control.value === '')) {
         // If the condition is true, show the Swal message and set the focus
         Swal.fire({
           title: '',
           text: 'Please fill all the required fields (marked with *)',
           icon: 'warning',
           confirmButtonText: 'Ok',
           confirmButtonColor: '#ffa022',
         }).then((result) => {
           if (result.isConfirmed) {
             // After the user closes the Swal, focus the adjuster licenses element
             const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="adjuster_Licenses"]');
             if (invalidControl) {
               invalidControl.focus();
             }
           }
         });
         return false;
       }
     }
     
    if (this.licenceAndCertificateForm.valid == false) {
      this.submit = true;
      for (const key of Object.keys(this.licenceAndCertificateForm.controls)) {
        if (this.licenceAndCertificateForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          if (invalidControl && key != 'how_Did_You_Hear_About_Us') {
            invalidControl.focus();
          } else {
            //console.log(`Form control with name ${key} not found.`);
            this.scrollToParagraph(key);
          }
          // key === 'how_Did_You_Hear_About_Us' ? this.scrollToParagraph(key) : null
          // if (key === 'how_Did_You_Hear_About_Us') {
          //   this.scrollToParagraph(key);
          // }
          Swal.fire({
            title: '',
            text: 'Please fill all the required fields (marked with *)',
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
          break;
        }
      }
      return false;
    }
    else {
      let obj = {
        licenceAndCertificateForm: this.getCleanFormValues()
      }
      return obj;
    }
  }
  isCertificateFormDirty() {
   return this.licenceAndCertificateForm.dirty;
  }
  isview:boolean=true;
  isCertificateFormView(){
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    const path = currentUrlObj.pathname;
    if(['/main/admin/view-profile'].includes(path)){
      this.licenceAndCertificateForm.disable();
      this.isview=false
      }
  }
  clearValidationForInternal(){
    // debugger;
    this.licenceAndCertificateForm.clearValidators();
this.licenceAndCertificateForm.setValidators(null);
this.licenceAndCertificateForm.updateValueAndValidity();
return true
  }
  reset() {
    this.submit = false;
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    if (currentUrlObj.pathname == "/main/admin/add-user-tabs") {
      if (localStorage.getItem('editUser')) {
        this.setNullValuesInCheckboxFields()
        let edituser = JSON.parse(localStorage.getItem('editUser') || '');
        this.FetchUser();
      }
      else {
        Object.keys(this.licenceAndCertificateForm.controls).forEach(controlName => { //resetting all formcontrols except array type, we need to reset array manually.
          const control = this.licenceAndCertificateForm.get(controlName);
          // Check if the control is not an array type
          if (control && !(control instanceof FormArray)) {
            control.reset();
          }
        });

        this.setNullValuesInCheckboxFields() 
      }
    }
    else if (currentUrlObj.pathname == "/main/admin/update-profile") {
      this.setNullValuesInCheckboxFields()
      let loggedUserid = localStorage.getItem('LoggeduserId');
      // Note: You should set this.data with the user data before calling FetchUser()
      // this.data = fetchedUserData; // Set appropriate user data here
      this.FetchUser();
    }
  }

  setNullValuesInCheckboxFields() {
    const insurance = this.licenceAndCertificateForm.get('insurance_Designations') as FormArray;
    insurance.clear();

    const certifications = this.licenceAndCertificateForm.get('certifications') as FormArray;
    certifications.clear();

    const adjuster_Licenses = this.licenceAndCertificateForm.get('adjuster_Licenses') as FormArray;
    adjuster_Licenses.clear();
  }



  enableEditMode() {
    this.licenceAndCertificateForm.enable();
    this.isview=true
  }
}
