import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FileTracService } from 'src/app/services/file-trac.service';
import Swal from 'sweetalert2';

interface ClientData {
  clientId: number;
  fName: string;
}

@Component({
  selector: 'app-internal-info',
  templateUrl: './internal-info.component.html',
  styleUrls: ['./internal-info.component.scss']
})
export class InternalInfoComponent implements OnInit {
  internalInfoForm!: FormGroup
  data: any
  @Input() editUserDataFromParent: any;
  @Input() selectedSection: 'internal' | 'onboarding' | 'auditTrail' = 'internal';
  submit: boolean = false
  QbStatus = ["Discarded","Does Not Meet","Do Not Deploy","FileTrac Processing","Onboarding Complete","Qualifying","Systems Setup","Unknown","Unresponsive","Vetted","Vetting"]
  QbRating = ["A", "B", "C", "D", "X", "PF","Pre-vet field residential", "Pre-vet field commercial", "Pre-vet desk residential","Pre-vet desk commercial","Pre-Vetted Proctor","Vetted Proctor"]
  QbLineOfBusiness = ["Auto", "Casualty", "Commercial", "Flood", "Liability", "Mobile Home", "Residential", "Workman Comp"]
  deployment_Status = ["CAT Standby", "Non-CAT Standby", "Not A Good Candidate", "Poor Past Performancce", "Remove From Roster (see notes)", "Reserve"]
  fieldGrades = ["A", "B", "C", "D", "X"];
  userType = Number((localStorage.getItem('LoggedUserType')));
  goodcandidatelistdata: ClientData[] = [];

  // Onboarding dropdown options
  onboardingBackgroundStatuses = ["None", "Requested", "Completed", "Expired", "Cancelled"];
  onboardingContractStatuses = ["None", "Requested", "Completed", "Expired","Requested Update", "Completed Update"];
  onboardingPayrollStatuses = ["Inactive", "Active", "Upwork"];

  constructor(private fb: FormBuilder, private authService: AuthService, private el: ElementRef , private FTS: FileTracService) {
    this.createAdditionalInfoForm();

  }

  PostUserData(EditUserDataFromParent: any) {
    this.data = EditUserDataFromParent;
    // console.log("PostUserData this.data", this.data);
    this.FetchUser();
  }

  // Utility to parse API date as UTC
  parseAPIDateAsUTC(dateString: string): Date {
    return new Date(dateString + 'Z');
  }

  FetchUser() {
    this.internalInfoForm.patchValue(this.data);
    // goodCandidateFor: this.data.goodCandidateFor?.map((id: string) => Number(id)) || []
    this.internalInfoForm.get('goodCandidateFor')?.setValue(this.data.goodCandidateFor?.map((id: string) => Number(id)) || []);

    // Handle onboarding date fields (convert from UTC to local date)
    const onboarding = this.data.onboarding || {};
    const onboardingGroup = this.internalInfoForm.get('onboarding');
    if (onboardingGroup) {
      const dateFields = [
        'backgroundExpiration',
        'fieldAdjusterContractExpiration',
        'deskAdjusterContractExpiration',
        'supervisorContractExpiration',
        'adminContractExpiration'
      ];
      dateFields.forEach(field => {
        if (onboarding[field]) {
          // Parse as UTC
          const dateObj2 = new Date(onboarding[field]);
          const dateObj = this.parseAPIDateAsUTC(onboarding[field]);
          if (!isNaN(dateObj2.getTime())) {
            const localDate = new Date(dateObj2.getFullYear(), dateObj2.getMonth(), dateObj2.getDate());
            onboardingGroup.get(field)?.setValue(localDate);
          }
        }
      });
    }
  }

  ngOnInit(): void {
    this.isInternalInfoFormView()
    this.goodcandidatelist();
    }
  

  createAdditionalInfoForm() {
    this.internalInfoForm = this.fb.group({
      residential_Field_Grade: [],
      commercial_Field_Grade: [],
      liability_Grade: [],
      inspector_Grade: [],
      desk_Grade: [],
      claims_Supervisor_Grade: [],
      file_Review_Grade: [],
      prevetting: [], // Previously "QB Rating"
      headLineOverview: [],
      internalNotes: [],
      goodCandidateFor: [],
      // Onboarding fields
      onboarding: this.fb.group({
        backgroundCheckStatus: [],
        backgroundExpiration: [],
        fieldAdjusterContract: [],
        fieldAdjusterContractExpiration: [],
        deskAdjusterContract: [],
        deskAdjusterContractExpiration: [],
        supervisorContract: [],
        supervisorContractExpiration: [],
        adminContract: [],
        adminContractExpiration: [],
        payrollStatus: []
      })
    })
  }

  isInternalInfoFormValid() {
    if (this.userType == 1) {
      let obj = {
        internalInfoForm: this.internalInfoForm.getRawValue()
      }
      return obj;
    }
    if (this.internalInfoForm.valid == false) {
      this.submit = true;
      for (const key of Object.keys(this.internalInfoForm.controls)) {
        if (this.internalInfoForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          if (invalidControl) {
            invalidControl.focus();
          } else {
            // Handle the case when the control is not found
            //console.log(`Form control with name ${key} not found.`);
          }
          Swal.fire({
            title: '',
            text: 'Please fill all the required fields (marked with *)',
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
        }
      }
      return false;
    }
    else {
      let obj = {
        internalInfoForm: this.internalInfoForm.getRawValue()
      }
      return obj;
    }
  }
  isInternalInfoFormDirty() {
    return this.internalInfoForm.dirty;
  }

  isInternalInfoFormView() {
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    const path = currentUrlObj.pathname;
    if(['/main/admin/view-profile'].includes(path)){
      this.internalInfoForm.disable();
      }
  }

  reset() {
    this.submit = false;
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    if (currentUrlObj.pathname == "/main/admin/add-user-tabs") {
      if (localStorage.getItem('editUser')) {
        let edituser = JSON.parse(localStorage.getItem('editUser') || '');
        this.FetchUser();
      }
      else {
        this.internalInfoForm.reset();
      }
    }
    else if (currentUrlObj.pathname == "/main/admin/update-profile") {
      let loggedUserid = localStorage.getItem('LoggeduserId');
      this.FetchUser();
    }
  }
  goodcandidatelist() {
    this.authService.getClients().subscribe((data: any) => {
      if (data.success && data.data) {
        this.goodcandidatelistdata = data.data.sort((a: any, b: any) => a.fName.localeCompare(b.fName));  
      }
      // console.log("goodcandidatelistdata", this.goodcandidatelistdata);
    });
  }
  
  formatLabel(label: string): string {
    return label
      .split(/(?=[A-Z])|_/)  // Split on capital letters or underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  }

  enableEditMode() {
    this.internalInfoForm.enable();
  }


}
