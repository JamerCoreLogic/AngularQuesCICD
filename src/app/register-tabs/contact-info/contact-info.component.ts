import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {
  addUserForm!: FormGroup
  submit: boolean = false
  userRoles: any
  userTypes: any
  selectedRolesAsString: any
  editUserId!: number
  countries = [{ value: 'United States' }, { value: 'Canada' }]
  StatesList: any
  data: any
  zipLabel = 'Zip';
  stateLabel = 'State'
  isUpdateProfile = false
  Assignments = ['Claims Supervisor', 'Desk Assignments', 'Field Assignments', 'File Review', 'Underwriting Field Inspections', 'Virtual Adjusting', 'W2 Positions']
  ClaimType = ['Both', 'CAT', 'Daily']
  isEmailCheckbox: boolean = true;
  isPhoneCheckbox: boolean = true;
  private mobilePhoneValidationApplied = false;

  constructor(private fb: FormBuilder, private el: ElementRef, private authService: AuthService) {
    this.createAddUser()
    this.getStates('United States');
  }

  ngOnInit(): void {
    this.checkifMobileIsValid();
  }
  
  checkifMobileIsValid(){
    this.addUserForm.controls['mobile'].valueChanges.subscribe(this.validateMobileOrPhone.bind(this));
    this.addUserForm.controls['phone'].valueChanges.subscribe(this.validateMobileOrPhone.bind(this));
  }
  
  validateMobileOrPhone() {
    //console.log('Validating mobile or phone');
    const mobile = this.addUserForm.controls['mobile'];
    const phone = this.addUserForm.controls['phone'];
    const phoneOptionChecked = this.addUserForm.get('i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In')?.value;
  
    if (mobile.value === '' && phone.value === '') {
      //console.log('Both mobile and phone are empty');
      mobile.setValidators([Validators.required, Validators.minLength(14)]);
      phone.setValidators([Validators.required, Validators.minLength(14)]);
    } else if (phoneOptionChecked) {
      mobile.setValidators([Validators.required, Validators.minLength(14)]);
      phone.clearValidators();
    } else if (mobile.valid || phone.valid) {
      //console.log('Either mobile or phone is valid');
      mobile.clearValidators();
      phone.clearValidators();
    }
  
    mobile.updateValueAndValidity({emitEvent: false});
    phone.updateValueAndValidity({emitEvent: false});
  }

  createAddUser() {
    this.addUserForm = this.fb.group({
      userId: [],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      middleName: ['',],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      confirmEmail: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(14)]],
      mobile: ['', [Validators.required,Validators.minLength(14)]],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required]],
      country: ['United States', [Validators.required]],
      assignments: this.fb.array([]),
      what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned: [, [Validators.required]],
      i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In: [true],
      i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In: [true]
    })
    this.addUserForm.get('confirmEmail')?.valueChanges.subscribe(() => {
      this.emailValidator(this.addUserForm);
    });
    this.addUserForm.get('country')?.valueChanges.subscribe(() => {
      this.getStates(this.addUserForm.get('country')?.value);
    });
    // this.addUserForm.get('i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In')?.valueChanges.subscribe(() => {
    //   this.onUncheckEmailCommOrPhoneText('email');
    // });
    // this.addUserForm.get('i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In')?.valueChanges.subscribe(() => {
    //   this.onUncheckEmailCommOrPhoneText('phone');
    // });
  }

  transformToPhonePipe() {
    this.transformPhoneNumber('phone');
    this.transformPhoneNumber('mobile');
  }
  
  transformPhoneNumber(fieldName: string) {
    const value = this.addUserForm.controls[fieldName].value;
    if (value && value.length > 0) {
      let digits = value.replace(/\D/g, '');
      if (digits.length < 10) {
        // If there are fewer than 10 digits, reset the value to an empty string or keep the original value
        this.addUserForm.patchValue({ [fieldName]: '' });
        return;
      }
      digits = digits.slice(0, 10); // Accepting only 10 digits, removing next.
      const formattedNumber = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      this.addUserForm.patchValue({ [fieldName]: formattedNumber });
    } else {
      // When the input field is cleared, reset the value to an empty string.
      this.addUserForm.patchValue({ [fieldName]: '' });
    }
  }
  onUncheckEmailCommOrPhoneText(event: any) {
     
    const emailValue = this.addUserForm.get('i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In')?.value
    const phoneValue = this.addUserForm.get('i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In')?.value
    if (event == 'email' && emailValue == false) {
       
      //console.log("Email checked false",)
      this.isPhoneCheckbox = false
      Swal.fire({
        title: '',
        text: 'We use email for deployment and onboarding alerts. By opting out of email communications, you may receive fewer deployment notifications. Are you sure you want to opt-out?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffa022',
        denyButtonText: 'No',

      }).then((result) => {
        if (result.isConfirmed) {

        } else if (result.isDenied) {
          this.addUserForm.get('i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In')?.setValue(true);
          this.isPhoneCheckbox = true
        }
      })
    }
    else if (event == 'phone' && phoneValue == false) {
      //console.log("Phone checked false",)
      this.isEmailCheckbox = false
      Swal.fire({
        title: '',
        text: 'We use text for deployment and onboarding alerts. By opting out of text communications, you may receive fewer deployment notifications. Are you sure you want to opt-out?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffa022',
        denyButtonText: 'No',

      }).then((result) => {
        if (result.isConfirmed) {
          this.addUserForm.get('mobile')?.clearValidators();
        this.addUserForm.get('mobile')?.updateValueAndValidity();
        this.addUserForm.get('phone')?.setValidators([Validators.required, Validators.minLength(14)]);
        this.addUserForm.get('phone')?.updateValueAndValidity();
        } else if (result.isDenied) {
          this.addUserForm.get('i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In')?.setValue(true);
          this.isEmailCheckbox = true
        }
      })
    }

    else if (phoneValue == true && emailValue == true) {
      this.isEmailCheckbox = true
      this.isPhoneCheckbox = true;
      this.addUserForm.get('mobile')?.setValidators([Validators.required, Validators.minLength(14)]);
      this.addUserForm.get('mobile')?.updateValueAndValidity();
      this.addUserForm.get('phone')?.clearValidators();
      this.addUserForm.get('phone')?.updateValueAndValidity();
    }
  }
  onCheckboxChangeforAssignments(event: any) {
     
    const formArray = this.addUserForm.get('assignments') as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.source.value);
      formArray.removeAt(index);
    }
    //console.log(this.addUserForm.get('assignments')?.value);
  }

  isAssignmentCheckedOnEdit(assignment: string): boolean {  //for unchecking the checkbox while reseting the form.
    const formArray = this.addUserForm.get('assignments') as FormArray;
    return formArray.value.includes(assignment);
  }
  emailValidator(formGroup: FormGroup) {
    const emailControl = formGroup.get('email');
    const confirmEmailControl = formGroup.get('confirmEmail');

    if (emailControl && confirmEmailControl && emailControl.value !== confirmEmailControl.value) {
      confirmEmailControl.setErrors({ emailMismatch: true });
    } else {
      if (confirmEmailControl) {
        confirmEmailControl.setErrors(null);
      }
    }
  }

  getStates(country: any) {
    let val
    (country == 'United States' ? val = 1 : country == 'Canada' ? val = 2 : '')
    if (val) {
      this.authService.getStates(val).subscribe((res: any) => {
        if (res != null) {
          this.StatesList = res["data"];
        }
      })
    }
  }

  onLock() {
    this.addUserForm.controls['isActive'].setValue(this.addUserForm.controls['isLocked'].value);
  }

  toLower(event: any) {
    let x = event.target.value.toLowerCase()
    // event.target.value = x;
    this.addUserForm.get(event.currentTarget.attributes.formcontrolname.nodeValue)?.setValue(x);
  }

  getStateZipLabel() {
    if (this.addUserForm.controls['country'].value == 'United States') {
      this.zipLabel = 'Zip';
      this.stateLabel = 'State'
    }
    else {
      this.zipLabel = 'Postal Code';
      this.stateLabel = 'Province'

    }
  }

  saveUserId(id: any) {
    this.addUserForm.controls['userId'].setValue(id);
  }

  isBasicInfoFormValid() {
    this.submit = true;
  
    const controls = this.addUserForm.controls;
    const invalidFields = Object.keys(controls).filter(key => controls[key].invalid);
    // console.log("invalid fields",invalidFields);
  
    // Check if mobile is the only invalid field
    const isOnlyMobileInvalid = 
      invalidFields.length <= 2 && 
      invalidFields.includes('mobile') && 
      this.addUserForm.get('i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In')?.value;

    // console.log("isOnlyMobileInvalid",isOnlyMobileInvalid);
  
    if (isOnlyMobileInvalid) {
      const mobileInput = this.el.nativeElement.querySelector('[formcontrolname="mobile"]');
      mobileInput?.focus();
  
      Swal.fire({
        title: '',
        text: 'Mobile number is required because you opted in for text communication.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      });
  
      return false;
    }
  
    // If multiple fields are invalid, show a generic message
    if (invalidFields.length > 0 && !isOnlyMobileInvalid) {
      const firstInvalidField = this.el.nativeElement.querySelector(`[formcontrolname="${invalidFields[0]}"]`);
      firstInvalidField?.focus();
  
      Swal.fire({
        title: '',
        text: 'Please fill all the required fields (marked with *).',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      });
  
      return false;
    }
  
    return { basicInfoForm: this.addUserForm.getRawValue() };
  }
  isContactInfoformDirty() {
    return this.addUserForm.dirty;
  }

  reset() {
    this.submit = false;
    this.addUserForm.reset();
    this.addUserForm.get('i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In')?.setValue(true);
    this.addUserForm.get('i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In')?.setValue(true);
    this.isEmailCheckbox = true;
    this.isPhoneCheckbox = true;
    this.addUserForm.get('country')?.setValue('United States');
    //console.log("Reset mathos hit in basic component")
    this.setNullValuesInCheckboxFields()
  }
  setNullValuesInCheckboxFields() {
    const assignments = this.addUserForm.get('assignments') as FormArray;
    assignments.clear();
  }
}
