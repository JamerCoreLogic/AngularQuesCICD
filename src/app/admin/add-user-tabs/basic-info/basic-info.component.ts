import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { PhoneMaskDirective } from 'src/app/directives/phone-mask.directive';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {
  @ViewChild(PhoneMaskDirective) phoneNumberFormatter!: PhoneMaskDirective;
  addUserForm!: FormGroup
  submit: boolean = false
  userRoles: any[] = [];
  userTypes: any
  StatesList: any
  editUserId!: number
  isEdit: any;
  countries = [{ value: 'United States' }, { value: 'Canada' }]
  data: any
  @Input() editUserDataFromParent: any;
  zipLabel = 'Zip';
  stateLabel = 'State'
  isUpdateProfile = false
  @Output() dataEvent = new EventEmitter<object>();
  isStandby = false;

  @Input()
  requiredFileType!: string;
  fileName = '';
  uploadProgress!: number;
  uploadSub!: Subscription;

  base64textString!: string;
  isEmailCheckbox: boolean = true;
  isPhoneCheckbox: boolean = true;
  private mobilePhoneValidationApplied = false;
  LoggedUserTypeInternal:boolean=true;
  userType = Number((localStorage.getItem('LoggedUserType')));

  readonly ADJUSTER_LEAD_ROLE_ID = 5;
  readonly ADJUSTER_ROLE_ID = 4;

  constructor(public dialog: MatDialog, private router: Router, private authService: AuthService,
    private fb: FormBuilder, private SpinnerService: NgxSpinnerService, private el: ElementRef,) {
    this.createAddUser();
    this.getStates('United States');

    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    this.handleFormPermissions(currentUrlObj.pathname);
  }

  /**
   * Handle form field permissions based on user role and current path
   * @param pathname Current URL path
   */
  private handleFormPermissions(pathname: string): void {
    const loggedUserRole = localStorage.getItem('LoggedUserRole');
    const isAdminOrSuperAdmin = loggedUserRole === "1" || loggedUserRole === "2";
    
    if (pathname === "/main/admin/update-profile") {
      this.isUpdateProfile = true;
      
      // Special case for external carrier admin
      if (loggedUserRole === "4" && localStorage.getItem('LoggedUserType') === "2") {
        this.setFormPermissions(false);
        return;
      }
    }
    
    // For both add-user-tabs and update-profile paths
    if (isAdminOrSuperAdmin) {
      this.setFormPermissions(true);
    } else {
      this.setFormPermissions(false);
    }
  }

  /**
   * Set permissions for form controls based on user role
   * @param isEnabled Whether controls should be enabled
   */
  protected setFormPermissions(isEnabled: boolean): void {
    this.LoggedUserTypeInternal = isEnabled;
    
    const controls = ['isLocked', 'isActive', 'userRole', 'userType'];
    controls.forEach(control => {
      if (isEnabled) {
        this.addUserForm.controls[control].enable();
      } else {
        this.addUserForm.controls[control].disable();
      }
    });
  }

  PostUserData(EditUserDataFromParent: any) {
     
    this.data = EditUserDataFromParent;
    if (this.data && this.isAdjusterLead()) {
      this.userRoles.push({ roleId: 5, role: 'Adjuster_Lead' });
      // console.log('userRoles', this.userRoles);
      // this.addUserForm.controls['userRole'].disable();
    }
    const roleIds = this.data.userRoleData.map((item: any) => item.roleId);
    const containsRoleId1 = roleIds.includes(4);
    if (containsRoleId1) {
      // this.addUserForm.controls['userRole'].disable();
    }

    this.FetchUser()
  }
  isAdjusterLead(): boolean {
    return this.data?.userRoleData?.some((item: any) => item.role === "Adjuster_Lead");
  }
  FetchUser() {
    const formValues = {
      userId: this.data.userId,
      firstName: this.data.fName,
      middleName: this.data.mName,
      lastName: this.data.lName,
      email: this.data.emailAddress,
      phone: this.data.mobile,
      standby: this.data.standby,
      userRole: this.data.userRoleData.map((item: any) => item.roleId),
      userType: this.data.userTypeId,
      address1: this.data.address1,
      address2: this.data.address2,
      city: this.data.city,
      state: this.data.state,
      zip: this.data.zip,
      country: this.data.country,
      isActive: this.data.isActive,
      isLocked: this.data.isLocked,
      confirmEmail: this.data.confirmEmail,
      typeOfPhone: this.data.what_Type_Of_Phone_Do_You_Use,
      mobile: this.data.mobileNumber,
      companyName: this.data.companyName,
      profilePic: this.data.profilePic,
      profileFileName: this.data.profileFileName,
      i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In: this.data.i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In,
      i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In: this.data.i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In,
    };

    this.addUserForm.patchValue(formValues);
    //console.log('user response data:', this.data);
    this.getStateZipLabel();
    this.transformToPhonePipe();
    this.sendRoleAndTypeToParent()
    if (!this.data.i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In) {
      this.addUserForm.controls['mobile'].clearValidators();
      this.addUserForm.controls['mobile'].updateValueAndValidity();
      this.addUserForm.get('phone')?.setValidators([Validators.required, Validators.minLength(14)]);
      this.addUserForm.get('phone')?.updateValueAndValidity();
    } else if (this.data.i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In) {
      this.addUserForm.controls['phone'].clearValidators();
      this.addUserForm.controls['phone'].updateValueAndValidity();
    }
  }

  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const file: File | null = inputElement.files ? inputElement.files[0] : null;
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (file && file.size > maxFileSize) {
      Swal.fire({
        title: '',
        text: 'File size exceeds the 5MB limit.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      });
      inputElement.value = '';
      return;
    }

    if (file) {
      let fileType = file.type;
      if (fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg') {
        this.compressAndHandleFile(file, inputElement);
      } else {
        Swal.fire({
          title: '',
          text: 'Please select either JPG or PNG format!',
          icon: 'warning',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#ffa022',
        });
        inputElement.value = '';
      }
    } else {
      inputElement.value = '';
    }
  }

  async compressAndHandleFile(file: File, inputElement: HTMLInputElement) {
    try {
      const compressedFile = await this.compressFile(file);
      this.fileName = compressedFile.name;
      this.addUserForm.patchValue({ profileFileName: this.fileName });
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(compressedFile);
      inputElement.value = '';
    } catch (error) {
      console.error('Error during file compression:', error);
      inputElement.value = '';
    }
  }

  // Compress file method
  async compressFile(file: File) {
    const options = {
      maxSizeMB: 1, // (Max file size in MB)
      maxWidthOrHeight: 320,
      useWebWorker: true
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error
    }
  }

  // Method to handle reader loaded
  _handleReaderLoaded(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    // Update your form or state with the base64 string
    this.addUserForm.patchValue({ profilePic: this.base64textString });
  }
  transform() {
    // return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64textString);
    const x = "data:image/png;base64,";
    var src;
    const profilePic = this.addUserForm.controls['profilePic'].value
    if (profilePic && profilePic.length > 50) {
      src = x.concat(profilePic)
    }
    return src;
  }

  ngOnInit(): void {
    this.getUserRole();
    this.getUserType();
    this.checkifMobileIsValid();
    this.isBasicInfoFormView();
  }

  checkifMobileIsValid() {
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

    mobile.updateValueAndValidity({ emitEvent: false });
    phone.updateValueAndValidity({ emitEvent: false });
  }



  createAddUser() {
    this.addUserForm = this.fb.group({
      userId: [],
      firstName: ['', [Validators.required, Validators.minLength(3) , Validators.maxLength(50)]],
      middleName: ['',[ Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      confirmEmail: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(14)]],
      typeOfPhone: [],        //validation removed since comment on templete, typeOfPhone: ['iphone', [Validators.required]],
      mobile: ['', [Validators.required, Validators.minLength(14)]],
      standby: [''],
      companyName: [''],
      userRole: [[], Validators.required],
      userType: [[], Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required]],
      country: ['United States', [Validators.required]],
      isActive: [true, [Validators.required]],
      isLocked: [false, [Validators.required]],
      profilePic: [],
      profileFileName: [],
      i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In: [true],
      i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In: [true]
    })
    // this.addUserForm.get('userType')?.valueChanges.subscribe(() => {
    //   this.sendRoleAndTypeToParent();
    // });
    this.addUserForm.get('confirmEmail')?.valueChanges.subscribe(() => {
      this.emailValidator(this.addUserForm);
    });
    this.addUserForm.get('userRole')?.valueChanges.subscribe(() => {
      this.toggleStandby()
    });
   
    this.addUserForm.get('country')?.valueChanges.subscribe(() => {
      this.getStates(this.addUserForm.get('country')?.value);
    });
  }
  toggleStandby() {
    const containsRoleId4 = this.addUserForm.get('userRole')?.value.includes(4);
    if (containsRoleId4) {
      this.isStandby = true;
      //console.log("if block executed.")
    }
    else{
      this.isStandby = false;
      //console.log("else block executed.")
    }
  }
  sendRoleAndTypeToParent() {//On role value change, addition tabs show hode from parent component
    const role = this.addUserForm.get('userRole')?.value
    const type = this.addUserForm.get('userType')?.value
    const userId = this.data?.userId || null;
    this.dataEvent.emit({ role, type, userId });   //Although We are not using type, later changed
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

  onLock() {
    this.addUserForm.controls['isActive'].setValue(this.addUserForm.controls['isLocked'].value);
    this.addUserForm.controls['isActive'].updateValueAndValidity();
  }
  onActive() {
    this.addUserForm.controls['isLocked'].setValue(this.addUserForm.controls['isActive'].value);
    this.addUserForm.controls['isLocked'].updateValueAndValidity();
  }

  getUserRole() {
    this.authService.getUserRoles().subscribe((res: any) => {
      if (res != null) {
        this.userRoles.push(...res["data"]);
        //console.log('userRoles', this.userRoles);
      }
    })
  }

  getUserType() {
    this.authService.getUserType().subscribe((res: any) => {
      if (res != null) {
        this.userTypes = res["data"];
      }
    })
  }

  toLower(event: any) {
    let x = event.target.value.toLowerCase()
    // event.target.value = x;
    this.addUserForm.get(event.currentTarget.attributes.formcontrolname.nodeValue)?.setValue(x);
  }
  isBasicInfoFormValid() {
    // If userType is 1, skip form validation and allow submission
    if (this.userType == 1) {
      let obj = {
        basicInfoForm: this.addUserForm.getRawValue()
      }
      return obj;
    }

    if (this.addUserForm.valid == false) {
      this.submit = true;
      for (const key of Object.keys(this.addUserForm.controls)) {
        if (this.addUserForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
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
        basicInfoForm: this.addUserForm.getRawValue()
      }
      return obj;
    }
  }

  isBasicInfoFormDirty() {
    return this.addUserForm.dirty;
  }
  isBasicInfoFormView(){
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    const path = currentUrlObj.pathname;
    if(['/main/admin/view-profile'].includes(path)){
      this.addUserForm.disable();
      }
  }
  clearValidationForInternal(){
    this.addUserForm.clearValidators();
this.addUserForm.setValidators(null);
this.addUserForm.updateValueAndValidity();
return true
  }

  reset() {
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    if (currentUrlObj.pathname == "/main/admin/add-user-tabs") {
      if (localStorage.getItem('editUser')) {
        this.resetToInicial();
      }
      else {
        this.submit = false;
        this.addUserForm.reset();
        // this.addUserForm.controls['typeOfPhone'].setValue('iphone');
        this.addUserForm.controls['country'].setValue('United States');
        this.addUserForm.controls['isLocked'].setValue(false);
        this.addUserForm.controls['isActive'].setValue(true);
        this.addUserForm.controls['i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In'].setValue(true);
        this.addUserForm.controls['i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In'].setValue(true);
        this.isEmailCheckbox = true;
        this.isPhoneCheckbox = true;
        this.base64textString = ''
      }
    }
    else if (currentUrlObj.pathname == "/main/admin/update-profile") {
      this.resetToInicial();
    }
  }

  resetToInicial() {
    const formValues = {
      userId: this.data.userId,
      firstName: this.data.fName,
      middleName: this.data.mName,
      lastName: this.data.lName,
      email: this.data.emailAddress,
      phone: this.data.mobile,
      userRole: this.data.userRoleData.map((item: any) => item.roleId),
      userType: this.data.userTypeId,
      address1: this.data.address1,
      address2: this.data.address2,
      city: this.data.city,
      state: this.data.state,
      zip: this.data.zip,
      country: this.data.country,
      isActive: this.data.isActive,
      isLocked: this.data.isLocked,
      confirmEmail: this.data.confirmEmail,
      typeOfPhone: this.data.what_Type_Of_Phone_Do_You_Use,
      mobile: this.data.mobileNumber,
      companyName: this.data.companyName,
      profilePic: this.data.profilePic,
      i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In: this.data.i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In,
      i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In: this.data.i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In,
    };

    this.addUserForm.patchValue(formValues);
    //console.log('user response data:', this.data);
    this.getStateZipLabel();
    this.transformToPhonePipe();
    this.sendRoleAndTypeToParent()
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
          if (this.addUserForm.get('mobile')?.value == null || this.addUserForm.get('mobile')?.value == '') {
            this.addUserForm.get('phone')?.setValidators([Validators.required, Validators.minLength(14)]);
            this.addUserForm.get('phone')?.updateValueAndValidity();
          }

        } else if (result.isDenied) {
          this.addUserForm.get('i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In')?.setValue(true);
          this.isEmailCheckbox = true
        }
      })
    }

    else if (phoneValue == true && emailValue == true) {
      this.isEmailCheckbox = true
      this.isPhoneCheckbox = true
      this.addUserForm.get('mobile')?.setValidators([Validators.required, Validators.minLength(14)]);
      this.addUserForm.get('mobile')?.updateValueAndValidity();
      this.addUserForm.get('phone')?.clearValidators();
      this.addUserForm.get('phone')?.updateValueAndValidity();
    }
  }
  enableEditMode() {
    this.addUserForm.enable();
  }

  isAdminOrSuperAdmin(): boolean {
    const loggedUserRole = localStorage.getItem('LoggedUserRole');
    return loggedUserRole === "1" || loggedUserRole === "2";
  }

  shouldDisableRoleOption(roleId: number): boolean {
    // If user is Adjuster_Lead and admin/super admin, only Adjuster is enabled
    if (this.isAdjusterLead() && this.isAdminOrSuperAdmin()) {
      return roleId !== this.ADJUSTER_ROLE_ID && roleId !== this.ADJUSTER_LEAD_ROLE_ID;
    }
    return false;
  }

  shouldHideRoleOption(roleId: number): boolean {
    // Hide Adjuster_Lead if Adjuster is selected
    if (this.isAdjusterLead() && this.isAdminOrSuperAdmin()) {
      const selectedRoles = this.addUserForm.get('userRole')?.value || [];
      if (selectedRoles.includes(this.ADJUSTER_ROLE_ID)) {
        return roleId === this.ADJUSTER_LEAD_ROLE_ID;
      }
    }
    return false;
  }

  onRoleSelectionChange() {
    if (this.isAdjusterLead() && this.isAdminOrSuperAdmin()) {
      let selectedRoles = this.addUserForm.get('userRole')?.value || [];
      // If Adjuster is selected, remove Adjuster_Lead
      if (selectedRoles.includes(this.ADJUSTER_ROLE_ID) && selectedRoles.includes(this.ADJUSTER_LEAD_ROLE_ID)) {
        selectedRoles = selectedRoles.filter((id: number) => id !== this.ADJUSTER_LEAD_ROLE_ID);
        this.addUserForm.get('userRole')?.setValue(selectedRoles);
      }
      // Only allow Adjuster to be selected
      if (selectedRoles.length > 1) {
        this.addUserForm.get('userRole')?.setValue([this.ADJUSTER_ROLE_ID]);
      }
    }
    this.sendRoleAndTypeToParent();
  }

}
