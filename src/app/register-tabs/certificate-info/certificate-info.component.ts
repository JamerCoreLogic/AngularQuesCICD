import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-certificate-info',
  templateUrl: './certificate-info.component.html',
  styleUrls: ['./certificate-info.component.scss']
})
export class CertificateInfoComponent implements OnInit {
  certificateInfoForm!: FormGroup
  submit: boolean = false
  // QbStatus = ["Unknown", "Vetting", "Vetted", "Qualifying", "Systems Setup", "FileTrac Processing", "Onboarding Complete", "Does Not Meet", "Do Not Deploy", "Discarded", "Unresponsive"]
  // QbRating = ["A", "B", "C", "D", "X"]
  // QbLineOfBusiness = ["Auto", "Casualty", "Commercial", "Flood", "Liability", "Mobile Home", "Residential", "Workman Comp"]
  certificatelist = ['AIC', 'ARM', 'CPCU', 'Haag Commercial', 'Haag Residential', 'HAAG Reviewer', 'IICRC', 'PTC1', 'PTC2', 'PTC3', 'Other'];
  insurancelist = ["American Family", "Earthquake", "Florida Citizens", "Liberty Mutual", "NFIP/Flood", "Nationwide", "Part 107 Drone License", "Rope and Harness", "State Farm", "The Hartford", "Tower Hill", "TWIA", "USAA", "Zurich", "Other"]
  States = [{ "name": "Alabama", "abbreviation": "AL" }, { "name": "Alaska", "abbreviation": "AK" }, { "name": "Arizona", "abbreviation": "AZ" }, { "name": "Arkansas", "abbreviation": "AR" }, { "name": "California", "abbreviation": "CA" }, { "name": "Colorado", "abbreviation": "CO" }, { "name": "Connecticut", "abbreviation": "CT" }, { "name": "Delaware", "abbreviation": "DE" }, { "name": "Florida", "abbreviation": "FL" }, { "name": "Georgia", "abbreviation": "GA" }, { "name": "Hawaii", "abbreviation": "HI" }, { "name": "Idaho", "abbreviation": "ID" }, { "name": "Illinois", "abbreviation": "IL" }, { "name": "Indiana", "abbreviation": "IN" }, { "name": "Iowa", "abbreviation": "IA" }, { "name": "Kansas", "abbreviation": "KS" }, { "name": "Kentucky", "abbreviation": "KY" }, { "name": "Louisiana", "abbreviation": "LA" }, { "name": "Maine", "abbreviation": "ME" }, { "name": "Maryland", "abbreviation": "MD" }, { "name": "Massachusetts", "abbreviation": "MA" }, { "name": "Michigan", "abbreviation": "MI" }, { "name": "Minnesota", "abbreviation": "MN" }, { "name": "Mississippi", "abbreviation": "MS" }, { "name": "Missouri", "abbreviation": "MO" }, { "name": "Montana", "abbreviation": "MT" }, { "name": "Nebraska", "abbreviation": "NE" }, { "name": "Nevada", "abbreviation": "NV" }, { "name": "New Hampshire", "abbreviation": "NH" }, { "name": "New Jersey", "abbreviation": "NJ" }, { "name": "New Mexico", "abbreviation": "NM" }, { "name": "New York", "abbreviation": "NY" }, { "name": "North Carolina", "abbreviation": "NC" }, { "name": "North Dakota", "abbreviation": "ND" }, { "name": "Ohio", "abbreviation": "OH" }, { "name": "Oklahoma", "abbreviation": "OK" }, { "name": "Oregon", "abbreviation": "OR" }, { "name": "Pennsylvania", "abbreviation": "PA" }, { "name": "Rhode Island", "abbreviation": "RI" }, { "name": "South Carolina", "abbreviation": "SC" }, { "name": "South Dakota", "abbreviation": "SD" }, { "name": "Tennessee", "abbreviation": "TN" }, { "name": "Texas", "abbreviation": "TX" }, { "name": "Utah", "abbreviation": "UT" }, { "name": "Vermont", "abbreviation": "VT" }, { "name": "Virginia", "abbreviation": "VA" }, { "name": "Washington", "abbreviation": "WA" }, { "name": "West Virginia", "abbreviation": "WV" }, { "name": "Wisconsin", "abbreviation": "WI" }, { "name": "Wyoming", "abbreviation": "WY" }]
  isinsurance_Designations_Other: boolean = false;
  iscertifications_Other: boolean = false
  isfcn: boolean = false;
  ishow_Did_You_Hear_About_Us_Other: boolean = false

  constructor(private fb: FormBuilder, private el: ElementRef) {
    this.createAdditionalInfoForm()
  }

  ngOnInit(): void {
  }

  createAdditionalInfoForm() {
    this.certificateInfoForm = this.fb.group({
      insurance_Designations: this.fb.array([]),
      insurance_Designations_Other: [],
      certifications: this.fb.array([]),
      certifications_Other: [],
      adjuster_Licenses: this.fb.array([], Validators.required),
      fcn: [],
      national_Producer_Number: [, [Validators.required, Validators.minLength(8)]],
      how_Did_You_Hear_About_Us: [, [Validators.required]],
      how_Did_You_Hear_About_Us_Other: [],      //validations are removed since default it is hide, we are adding validations late paste this inside array -> , [Validators.required]
    })
    this.certificateInfoForm.get('insurance_Designations')?.valueChanges.subscribe(() => {
      this.showInsurance_Designations_Other();
    });
    this.certificateInfoForm.get('certifications')?.valueChanges.subscribe(() => {
      this.showCertifications_OtherAndFcn();
    });
    this.certificateInfoForm.get('how_Did_You_Hear_About_Us')?.valueChanges.subscribe(() => {
      this.showHow_Did_You_Hear_About_Us_Other();
    });
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
    // also only allow max 19 characters
    if ((event.target as HTMLInputElement).value.length >= 18) {
      event.preventDefault();
    }
  }
  showInsurance_Designations_Other() {
    var insurance_Designations = this.certificateInfoForm.get('insurance_Designations')?.value
    //console.log(`designation is: `, insurance_Designations)
    const foundItem = insurance_Designations && insurance_Designations.find((item: any) => item.includes('Other'));
    if (foundItem) {
      this.isinsurance_Designations_Other = true

    } else {
      this.certificateInfoForm.get('insurance_Designations_Other')?.setValue('')
      this.isinsurance_Designations_Other = false
    }
  }
  showCertifications_OtherAndFcn() {
    var certifications = this.certificateInfoForm.get('certifications')?.value
    const foundItem2 = certifications.find((item: any) => item.includes("Other"));
    if (foundItem2) {
      this.iscertifications_Other = true

    } else {
      this.certificateInfoForm.get('certifications_Other')?.setValue('')
      this.iscertifications_Other = false
    }
    const foundItem3 = certifications.find((item: any) => item.includes("NFIP/Flood"));
    if (foundItem3) {
      this.isfcn = true;

    } else {
      this.certificateInfoForm.get('fcn')?.setValue('')
      this.isfcn = false;
    }
  }
  showHow_Did_You_Hear_About_Us_Other() {
    var how_Did_You_Hear_About_Us = this.certificateInfoForm.get('how_Did_You_Hear_About_Us')?.value
    // if (how_Did_You_Hear_About_Us) {
    if (how_Did_You_Hear_About_Us == 'Other') {
      this.ishow_Did_You_Hear_About_Us_Other = true
      this.certificateInfoForm.get('how_Did_You_Hear_About_Us_Other')?.setValidators(Validators.required);
      this.certificateInfoForm.get('how_Did_You_Hear_About_Us_Other')?.updateValueAndValidity()
    } else {
      this.certificateInfoForm.get('how_Did_You_Hear_About_Us_Other')?.setValue('')
      this.certificateInfoForm.get('how_Did_You_Hear_About_Us_Other')?.clearValidators();
      this.certificateInfoForm.get('how_Did_You_Hear_About_Us_Other')?.updateValueAndValidity()
      this.ishow_Did_You_Hear_About_Us_Other = false
    }
    // }
  }


  onCheckboxChangeforInsurance_Designations(event: any) {
     
    const formArray = this.certificateInfoForm.get('insurance_Designations') as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.source.value);
      formArray.removeAt(index);
    }
    //console.log(this.certificateInfoForm.get('insurance_Designations')?.value);
  }
  isinsurance_DesignationsOnEdit(assignment: string): boolean {
    const formArray = this.certificateInfoForm.get('insurance_Designations') as FormArray;
    return formArray.value.includes(assignment);
  }
  onCheckboxChangeforCertifications(event: any) {
     
    const formArray = this.certificateInfoForm.get('certifications') as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.source.value);
      formArray.removeAt(index);
    }
    //console.log(this.certificateInfoForm.get('certifications')?.value);
  }
  iscertificationsOnEdit(assignment: string): boolean {
    const formArray = this.certificateInfoForm.get('certifications') as FormArray;
    return formArray.value.includes(assignment);
  }
  onCheckboxChangeforAdjuster_Licenses(event: any) {
     
    const formArray = this.certificateInfoForm.get('adjuster_Licenses') as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.source.value);
      formArray.removeAt(index);
    }
    //console.log(this.certificateInfoForm.get('adjuster_Licenses')?.value);
  }
  isadjuster_LicensesOnEdit(assignment: string): boolean {
    const formArray = this.certificateInfoForm.get('adjuster_Licenses') as FormArray;
    return formArray.value.includes(assignment);
  }
  scrollToParagraph(paragraphId: string) {
    const paragraph = document.getElementById(paragraphId);
    if (paragraph) {
      paragraph.scrollIntoView({ behavior: 'smooth' });
    }
  }
  iscertificateInfoFormValid() {
    const nationalProducerNumberControl = this.certificateInfoForm.get('national_Producer_Number');
    //console.log("producer number value is", nationalProducerNumberControl?.value);
    if (nationalProducerNumberControl?.errors) {
      const errorKeys = Object.keys(nationalProducerNumberControl.errors);
      //console.log('Errors:', errorKeys);

      // If you want to log each individual error message
      errorKeys.forEach(errorKey => {
        //console.log(`Error: ${errorKey}, Value: ${nationalProducerNumberControl.errors?.[errorKey]}`);
      });
    }
    if (this.certificateInfoForm.valid == false) {
      this.submit = true;
      for (const key of Object.keys(this.certificateInfoForm.controls)) {
        if (this.certificateInfoForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          if (invalidControl && key != 'how_Did_You_Hear_About_Us') {
            invalidControl.focus();
          } else {
            //console.log(`Form control with name ${key} not found.`);
            this.scrollToParagraph(key);
          }
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
      return false
    }
    else {
      let obj = {
        certificateInfoForm: this.certificateInfoForm.getRawValue()
      }
      return obj;
    }
  }
  isCertificateFormDirty() {
    return this.certificateInfoForm.dirty;
  }

  reset() {
    this.submit = false;
    Object.keys(this.certificateInfoForm.controls).forEach(controlName => { //resetting all formcontrols except array type, we need to reset array manually.
      const control = this.certificateInfoForm.get(controlName);
      // Check if the control is not an array type
      if (control && !(control instanceof FormArray)) {
        control.reset();
      }
    });

    this.setNullValuesInCheckboxFields()
  }

  setNullValuesInCheckboxFields() {
     
    const insurance = this.certificateInfoForm.get('insurance_Designations') as FormArray;
    insurance.clear();

    const certifications = this.certificateInfoForm.get('certifications') as FormArray;
    certifications.clear();

    const adjuster_Licenses = this.certificateInfoForm.get('adjuster_Licenses') as FormArray;
    adjuster_Licenses.clear();
  }
}
