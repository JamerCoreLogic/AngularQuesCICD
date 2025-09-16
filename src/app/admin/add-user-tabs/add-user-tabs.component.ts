import { AdditionalInfoComponent } from './additional-info/additional-info.component';
import { Component, EventEmitter, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AttachmentsComponent } from './attachments/attachments.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { MatLegacyTabChangeEvent as MatTabChangeEvent, MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { InternalInfoComponent } from './internal-info/internal-info.component';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { NavigationEnd, Router,  Event as RouterEvent } from '@angular/router';
import { catchError, throwError, filter } from 'rxjs';
import { LiencesAndCertificationComponent } from './liences-and-certification/liences-and-certification.component';
import { Location } from '@angular/common';
import { DeploymentInfoComponent } from './deployment-info/deployment-info.component';

import { CoreValuesComponent } from './core-values/core-values.component';
import { FileTracInfoComponent } from './file-trac-info/file-trac-info.component';

// @ts-ignore: Disable template type checking for this component
@Component({
  selector: 'app-add-user-tabs',
  templateUrl: './add-user-tabs.component.html',
  styleUrls: ['./add-user-tabs.component.scss']
})
export class AddUserTabsComponent implements OnInit , AfterViewInit, OnDestroy   {
  @ViewChild('basicInfoComponent') basicInfoComponent!: BasicInfoComponent;
  @ViewChild('additionalInfoComponent') additionalInfoComponent!: AdditionalInfoComponent;
  @ViewChild('liencesAndCertificationComponent') liencesAndCertificationComponent!: LiencesAndCertificationComponent;
  @ViewChild('deploymentInfoComponent') deploymentInfoComponent!: DeploymentInfoComponent;
  @ViewChild('internalInfoComponent') internalInfoComponent!: InternalInfoComponent;
  @ViewChild('coreValuesComponent') coreValuesComponent!: CoreValuesComponent;
  @ViewChild('fileTracInfoComponent') fileTracInfoComponent!: FileTracInfoComponent;
  @ViewChild('attachmentsComponent') attachmentsComponent!: AttachmentsComponent;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  isFirstTab: boolean = true;
  isLastTab: boolean = false;
  activeTabIndex = 0;
  tabCount = 6;
  basicInfoForm: any;
  additionalInfoForm: any
  licenceAndCertificateForm: any
  deploymentInfoForm:any
  internalInfoForm: any
  coreValuesForm: any
  isSubmitEnable: boolean = false;
  editUserResponse: any;
  isClearDisable: boolean = false;
  isProfile: boolean = false
  isEdit: any;
  adjusterLeadSaveAllowed: boolean = false;
  adjusterLeadSubmitAllowed: boolean = false;
  saveAllowed: boolean = false;
  isviewProfile:boolean=false;
  userType = Number((localStorage.getItem('LoggedUserType')));
  userRole = Number((localStorage.getItem('LoggedUserRole')));
  private previousUrl: string = '';
  private currentUrl: string='';
  showInternalMenu = false;
  selectedInternalSection: 'internal' | 'onboarding' | 'auditTrail' = 'internal';
  showFileTracTab: boolean = false;

  constructor(private authService: AuthService, private SpinnerService: NgxSpinnerService, private router: Router,private cdr:ChangeDetectorRef,private location: Location) {

   
    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  async ngOnInit(): Promise<void> {
    // console.log("Initial tabCount:", this.tabCount);
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    const path = currentUrlObj.pathname;
  
    const role = localStorage.getItem('LoggedUserRole');
    let userId: string | null = null;
    let editUser: any = null;
    let viewUser:any=null;
  
    switch(path) {
      case "/main/admin/add-user-tabs":
        // if (role !== '1' && role !== '2' ) {
        //   this.router.navigate(['login']);
        //   return;
        // }
        
        editUser = localStorage.getItem('editUser');
        if (editUser) {
          userId = JSON.parse(editUser).userId;
          if (typeof userId === 'string') {
            this.SpinnerService.show();
            try {
              await this.checkUserAndHideSpinner(userId);
              if(this.userType==1){
                this.tabCount= 8;
                this.basicInfoComponent.clearValidationForInternal()
              }
            } catch (error) {
              console.error('Error during user check:', error);
            }
          }
        }else{
          this.isSubmitEnable=false
        }

        if(this.userType==1){
          this.tabCount=8
        }
        this.checkAlowedUrls()
        break;
        
      case "/main/admin/update-profile":
        this.isSubmitEnable = false;
        this.isProfile = false;
        userId = localStorage.getItem('LoggeduserId');
        if (!userId) {
          console.error('LoggeduserId is missing in localStorage');
          return;
        }
        // this.checkAlowedUrls()
        break;
  
      case "/main/admin/view-profile":
        this.isviewProfile=true,
        viewUser = localStorage.getItem('viewProfile');
        //console.log("LoggeduserId", userId)
        if (viewUser) {
          userId = JSON.parse(viewUser).userId;
          if (typeof userId === 'string') {
            this.SpinnerService.show();
            try {
              await this.checkUserAndHideSpinner(userId);
            } catch (error) {
              console.error('Error during user check:', error);
            }
          }
        }
        break;
  
      default:
        // Handle invalid path if needed
    }
  
    //Common Logic for paths requiring user fetching
    if (['/main/admin/add-user-tabs', '/main/admin/update-profile','/main/admin/view-profile'].includes(path) && userId) {
      //console.log("userid",userId)
      this.SpinnerService.show();
      this.fetchUserAndHideSpinner(userId);
    }
    //console.log("userType oninit",this.userType)
  }
  
  ngAfterViewInit(): void {


  }
  checkAlowedUrls(){
    if(this.userType===2)  { 
    var obj = this.authService.isUserAllowed(window.location)
    if (obj.isAllow) {
  
    }
    else {
      this.router.navigate([obj.allowedPath]);
    }
  }
   }
  async checkUserAndHideSpinner(userId: string) {
    return new Promise<void>((resolve, reject) => {
      this.authService.checkUserForSubmit(userId).subscribe(
        (res: any) => {
          if (res != null) {
            this.isSubmitEnable = res;
            this.isEdit = true;
          }
          this.SpinnerService.hide();
          resolve();
        },
        (error: any) => {
          this.SpinnerService.hide();
          //console.log(error);
          reject(error);
        }
      );
    });
  }
  async fetchUserAndHideSpinner(userId: any) {
    return new Promise<void>((resolve, reject) => {
      // Clear any previous user data cache
      this.authService.clearUserDataCache();
      
      this.authService.getUserDataById(userId).subscribe(
        (res: any) => {
          if(res.success == true){
             
          this.basicInfoComponent.PostUserData(res.data[0]);
          this.authService.setUserData(res.data[0]);
          this.adjusterLeadSaveAllowed = this.isAdjusterLeadEditandSaveAllowed()
          this.adjusterLeadSubmitAllowed = this.isAdjusterLeadEditandSubmitAllowed()
          this.checkSubmitButtonDisabled()
          
          // console.log("testLead", this.adjusterLeadSaveAllowed)
          if (this.additionalInfoComponent) {
            this.additionalInfoComponent.PostUserData(res.data[0]);
          }
          if (this.liencesAndCertificationComponent) {
            this.liencesAndCertificationComponent.PostUserData(res.data[0].licencesPlusCertification[0]);
          }
          if (this.internalInfoComponent) {
            this.internalInfoComponent.PostUserData(res.data[0].adjusterInformationInternal[0]);
          }
          if(this.deploymentInfoComponent){
            this.deploymentInfoComponent.PostUserData(res.data[0].deploymentData);
          }
          if(this.coreValuesComponent){
            // console.log("Core Values data structure:", res.data[0].coreValueQuestions);
            this.coreValuesComponent.PostUserData(res.data[0].coreValueQuestions);
          }
          this.SpinnerService.hide();
          resolve();
        }
          
        },
        (error: any) => {
          this.SpinnerService.hide();
          //console.log(error);
          reject(error);
        }
      );
    });
  }

  navigateBack() {
    // Clear cache before navigating
    this.authService.clearUserDataCache();
    
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
    } else {
      // If there is no previous URL, use the back method of the Location service
      this.location.back();
    }
  }
  isAdjusterLeadEditandSaveAllowed(): boolean {
    const isAdjusterLead = this.basicInfoComponent.isAdjusterLead()
    const isAdminOrSuperadmin = this.isAdminOrSuperadminOrEmployee()
    return isAdjusterLead && !isAdminOrSuperadmin
  }

  isAdminOrSuperadminOrEmployee(): boolean {
    const userRole = parseInt(localStorage.getItem('LoggedUserRole') || '0');
    const userType = parseInt(localStorage.getItem('LoggedUserType') || '0');
    // now check one more condition if userRole is 3 and userType is 1 then return true
    return userRole === 1 || userRole === 2 || (userRole === 3 && userType === 1);
  }

   isAdjusterLeadEditandSubmitAllowed(): boolean {
    const isAdjusterLead = this.basicInfoComponent.isAdjusterLead()
    const isAdminOrSuperadmin = this.isAdminOrSuperadmin()
    return isAdjusterLead && !isAdminOrSuperadmin
  }
  isAdminOrSuperadmin(): boolean {
    const userRole = parseInt(localStorage.getItem('LoggedUserRole') || '0');
    // now check one more condition if userRole is 3 and userType is 1 then return true
    return userRole === 1 || userRole === 2
  }

  checkSubmitButtonDisabled(): boolean {
    if (!this.isSubmitEnable){
      return false
    }
      const hasAdjusterLeadRole = this.basicInfoComponent?.addUserForm?.get('userRole')?.value.includes(5)
      const isRoleEmpty = this.basicInfoComponent?.addUserForm?.get('userRole')?.value.length === 0;
      
      if(hasAdjusterLeadRole || isRoleEmpty) {
        // Show warning and return early to prevent further execution
        return true
      }
      else{
        return false
      }

  }

  convertToString() {
     
    if (this.basicInfoForm.basicInfoForm.userRole) {
      this.basicInfoForm.basicInfoForm.userRole = this.basicInfoForm.basicInfoForm.userRole.join(',') //converting "(855) (852)-4589" format to "8558524589"
    }
    if (this.basicInfoForm.basicInfoForm.phone) {
      const simpleNumber = this.basicInfoForm.basicInfoForm.phone.replace(/\D/g, ''); //converting "(855) (852)-4589" format to "8558524589"
      this.basicInfoForm.basicInfoForm.phone = simpleNumber;
    }
    if (this.basicInfoForm.basicInfoForm.mobile) {
      const simpleNumber = this.basicInfoForm.basicInfoForm.mobile.replace(/\D/g, '');
      this.basicInfoForm.basicInfoForm.mobile = simpleNumber;
    }
    if (this.basicInfoForm.basicInfoForm.i_Am_Interested_In_The_Following_Assignments) {
      this.basicInfoForm.basicInfoForm.i_Am_Interested_In_The_Following_Assignments = this.basicInfoForm.basicInfoForm.i_Am_Interested_In_The_Following_Assignments.join(',');
    }
    if (this.tabCount >= 2) {
      if (this.additionalInfoForm.additionalInfoForm.approximate_Date_I_Began_Adjusting) {
        const date = new Date(this.additionalInfoForm.additionalInfoForm.approximate_Date_I_Began_Adjusting);
        this.additionalInfoForm.additionalInfoForm.approximate_Date_I_Began_Adjusting = date
      }
      if (this.additionalInfoForm.additionalInfoForm.i_Am_Interested_In_The_Following_Assignments) {
        this.additionalInfoForm.additionalInfoForm.i_Am_Interested_In_The_Following_Assignments = this.additionalInfoForm.additionalInfoForm.i_Am_Interested_In_The_Following_Assignments.join(',');
      }
      if (this.additionalInfoForm.additionalInfoForm.location_Preference) {
        this.additionalInfoForm.additionalInfoForm.location_Preference = this.additionalInfoForm.additionalInfoForm.location_Preference.join(',');
      }
    }
    if (this.tabCount >= 3) {
      if (this.licenceAndCertificateForm.licenceAndCertificateForm.qB_Line_Of_Business_Internal) {
        this.licenceAndCertificateForm.licenceAndCertificateForm.qB_Line_Of_Business_Internal = this.licenceAndCertificateForm.licenceAndCertificateForm.qB_Line_Of_Business_Internal.join(',')
      }
      if (this.licenceAndCertificateForm.licenceAndCertificateForm.certifications) {
        this.licenceAndCertificateForm.licenceAndCertificateForm.certifications = this.licenceAndCertificateForm.licenceAndCertificateForm.certifications.join(',')
      }
      if (this.licenceAndCertificateForm.licenceAndCertificateForm.insurance_Designations) {
        this.licenceAndCertificateForm.licenceAndCertificateForm.insurance_Designations = this.licenceAndCertificateForm.licenceAndCertificateForm.insurance_Designations.join(',')
      }
      if (this.licenceAndCertificateForm.licenceAndCertificateForm.adjuster_Licenses) {
        this.licenceAndCertificateForm.licenceAndCertificateForm.adjuster_Licenses = this.licenceAndCertificateForm.licenceAndCertificateForm.adjuster_Licenses.join(',')
      }
    } if (this.tabCount >= 8) {
      if (this.internalInfoForm.internalInfoForm.qB_Line_Of_Business_Internal) {
        this.internalInfoForm.internalInfoForm.qB_Line_Of_Business_Internal = this.internalInfoForm.internalInfoForm.qB_Line_Of_Business_Internal.join(',')
      }
      if (this.internalInfoForm.internalInfoForm.prevetting) {
        this.internalInfoForm.internalInfoForm.prevetting = this.internalInfoForm.internalInfoForm.prevetting.join(',')
      }
      if (this.internalInfoForm.internalInfoForm.average_Mgr_Rating_Internal) {
        this.internalInfoForm.internalInfoForm.average_Mgr_Rating_Internal = this.internalInfoForm.internalInfoForm.average_Mgr_Rating_Internal.toString()
      }
      if (this.internalInfoForm.internalInfoForm.goodCandidateFor) {
        this.internalInfoForm.internalInfoForm.goodCandidateFor = this.internalInfoForm.internalInfoForm.goodCandidateFor.join(',')
      }
    }
  }

  saveAndSubmit(text: any) {
    debugger
    var x = this.basicInfoComponent.isBasicInfoFormValid()
    var y, z, deployment,internal, coreValues;
    if (this.tabCount >= 2) {
      y = this.additionalInfoComponent.isAdditionalInfoFormValid();
    }
    if (this.tabCount >= 3) {
       
      z = this.liencesAndCertificationComponent.isCertificateFormValid();
    }
    if (this.tabCount >= 5) {
      deployment = this.deploymentInfoComponent.isDeploymentInfoFormValid();
    }
    if (this.tabCount >= 6) {
      coreValues = this.coreValuesComponent.isCoreValuesFormValid();
    }
    if (this.tabCount >= 8) {
      internal = this.internalInfoComponent.isInternalInfoFormValid();
    }

    var isValid = false;
    if (this.tabCount == 1 && x != false) {
      this.basicInfoForm = x;
      this.additionalInfoForm = {}
      this.licenceAndCertificateForm = {}
      this.deploymentInfoForm={}
      this.coreValuesForm = {}
      this.internalInfoForm = {};
      isValid = true
    } else if (this.tabCount == 2 && (x != false && y != false)) {
      this.basicInfoForm = x;
      this.additionalInfoForm = y
      this.licenceAndCertificateForm = {}
      this.deploymentInfoForm={}
      this.coreValuesForm = {}
      this.internalInfoForm = {};
      isValid = true
    } else if (this.tabCount == 3 && (x != false && y != false && z != false)) {
      this.basicInfoForm = x;
      this.additionalInfoForm = y
      this.licenceAndCertificateForm = z
      this.deploymentInfoForm={}
      this.coreValuesForm = {}
      this.internalInfoForm = {}
      isValid = true
    } else if (this.tabCount == 5 && (x != false && y != false && z != false && deployment != false)) {
      this.basicInfoForm = x;
      this.additionalInfoForm = y
      this.licenceAndCertificateForm = z
      this.deploymentInfoForm=deployment
      this.coreValuesForm = {}
      this.internalInfoForm = {}
      isValid = true
    }else if (this.tabCount == 6 && (x != false && y != false && z != false && deployment != false && internal != false)) {
      this.basicInfoForm = x;
      this.additionalInfoForm = y
      this.licenceAndCertificateForm = z
      this.deploymentInfoForm=deployment
      this.coreValuesForm = coreValues
      this.internalInfoForm = {}
      isValid = true
    }
    else if (this.tabCount == 7 && (x != false && y != false && z != false && deployment != false && internal != false)) {
      this.basicInfoForm = x;
      this.additionalInfoForm = y
      this.licenceAndCertificateForm = z
      this.deploymentInfoForm=deployment
      this.coreValuesForm = coreValues
      this.internalInfoForm = {}
      isValid = true
    }
    else if (this.tabCount == 8 && (x != false && y != false && z != false && deployment != false && internal != false)) {
      this.basicInfoForm = x;
      this.additionalInfoForm = y
      this.licenceAndCertificateForm = z
      this.deploymentInfoForm=deployment
      this.coreValuesForm = coreValues
      this.internalInfoForm = internal
      isValid = true
    }
    if (isValid == true) {
      if (!this.basicInfoForm.basicInfoForm.userId) {
        this.addUser(text);
      }
      else {
        this.addUserConfirm(text)
      }
    }
  }


  addUser(text: any) {
    this.SpinnerService.show();
    // setTimeout(() => {
    //   this.SpinnerService.hide();
    // }, 15000);
    if (this.basicInfoForm.basicInfoForm.isLocked == true && this.basicInfoForm.basicInfoForm.isActive == false) {
      this.SpinnerService.hide();
      Swal.fire({
        title: '',
        text: 'You are creating user with locked & inactive status.\n Do you still want to continue?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffa022',
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          // this.SpinnerService.show();
          this.addUserConfirm(text);
        }
      })
    }
    else if (this.basicInfoForm.basicInfoForm.isActive == false) {
      this.SpinnerService.hide();
      Swal.fire({
        title: '',
        text: 'You are creating user with inactive status.\n Do you still want to continue?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffa022',
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.SpinnerService.show();
          this.addUserConfirm(text);
        }
      })
    }
    else if (this.basicInfoForm.basicInfoForm.isLocked == true) {
      this.SpinnerService.hide();
      Swal.fire({
        title: '',
        text: 'You are creating user with locked status.\n Do you still want to continue?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffa022',
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.SpinnerService.show();
          this.addUserConfirm(text);
        }
      })
    }
    else {
      this.SpinnerService.show();
      this.addUserConfirm(text);
    }

  }

  addUserConfirm(text: any) {
    // debugger
    this.SpinnerService.show();
    this.saveAllowed = true;
    this.convertToString();
    let objData = {
      userId: this.basicInfoForm.basicInfoForm.userId,
      fName: this.basicInfoForm.basicInfoForm.firstName,
      lName: this.basicInfoForm.basicInfoForm.lastName,
      mName: this.basicInfoForm.basicInfoForm.middleName,
      emailAddress: this.basicInfoForm.basicInfoForm.email,
      confirmEmail: this.basicInfoForm.basicInfoForm.confirmEmail,
      mobile: this.basicInfoForm.basicInfoForm.phone,
      standby: this.basicInfoForm.basicInfoForm.standby,
      userRoleId: this.basicInfoForm.basicInfoForm.userRole,
      userTypeId: this.basicInfoForm.basicInfoForm.userType,
      address1: this.basicInfoForm.basicInfoForm.address1,
      address2: this.basicInfoForm.basicInfoForm.address2,
      city: this.basicInfoForm.basicInfoForm.city,
      state: this.basicInfoForm.basicInfoForm.state,
      zip: this.basicInfoForm.basicInfoForm.zip,
      country: this.basicInfoForm.basicInfoForm.country,
      mobileNumber: this.basicInfoForm.basicInfoForm.mobile,
      what_Type_Of_Phone_Do_You_Use: this.basicInfoForm.basicInfoForm.typeOfPhone,
      companyName: this.basicInfoForm.basicInfoForm.companyName,
      password: "",
      secondaryEmail: "",
      xactNetAddress: "",
      status: "",
      isDeleted: false,
      isActive: this.basicInfoForm.basicInfoForm.isActive,
      isLocked: this.basicInfoForm.basicInfoForm.isLocked,
      failedLoginCount: 0,
      createdBy: localStorage.getItem('LoggeduserId'),
      profilePic: this.basicInfoForm.basicInfoForm.profilePic,
      profileFileName: this.basicInfoForm.basicInfoForm.profileFileName,
      mode: text,
      dateTimeOffSet: new Date().getTimezoneOffset().toString(),
      i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In: this.basicInfoForm.basicInfoForm.i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In,
      i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In: this.basicInfoForm.basicInfoForm.i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In,
      skillsAndWorkHistoryAddUserData: this.additionalInfoForm.additionalInfoForm != null ? [this.additionalInfoForm.additionalInfoForm] : [],
      licencesPlusCertificationAddUserData: this.licenceAndCertificateForm.licenceAndCertificateForm != null ? [this.licenceAndCertificateForm.licenceAndCertificateForm] : [], 
      coreValueQuestions: this.coreValuesForm.coreValuesForm || [],
      internalInformationAddUserData: this.internalInfoForm.internalInfoForm != null ? [this.internalInfoForm.internalInfoForm] : [],
      deploymentData: this.deploymentInfoForm.deploymentInfoForm != null ? [this.deploymentInfoForm.deploymentInfoForm] : [],
      attachments: this.userType !== 1 && this.attachmentsComponent ? this.attachmentsComponent.getAttachmentsData() : [],
    }
    // console.log("Payload objecttttttt: ", objData)
    let model = JSON.stringify(objData);
    this.SpinnerService.show()
    this.authService.addUser(objData).pipe(
      catchError(error => {
        this.SpinnerService.hide();
        if (error.status == 0) {
          Swal.fire({
            title: 'Status code: ' + error.status,
            text: 'Please check the connection. Unable to communicate with server via HTTP(s).',
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
        }
        else if (error.status) {
          Swal.fire({
            title: 'Status code: ' + error.status,
            text: 'Sorry! Something went wrong. Your request could not be completed, Please try again later.',
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
        }
        if (error.status === 400) {
          //console.log('the server cannot or will not process the request due to something that is perceived to be a client error');
        } else {
          //console.log('Error retrieving data:', error.message);
        }
        return throwError(error);
      })
    )
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true) {
          // Clear the cache after successful update
           
          if (text == "submit") {
            Swal.fire({
              title: '',
              text: "User Submitted Successfully.",
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                this.isSubmitEnable = false;
                
                
              }
            })
          }
          else if (text == "save") {
            if (!this.basicInfoForm.basicInfoForm.userId) {
              Swal.fire({
                title: '',
                text: "User Added Successfully.",
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                  const userId =res.message
                  this.fetchUserAndHideSpinner(userId);
                  localStorage.setItem('editUser', JSON.stringify({ userId: userId }));
                  this.savePendingUploads(userId);
                  
                 
                }
              })
            }
            else {
              Swal.fire({
                title: '',
                text: "Profile Updated Successfully.",
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                  localStorage.setItem('editUser', JSON.stringify({ userId: this.basicInfoForm.basicInfoForm.userId }));
                  this.fetchUserAndHideSpinner(this.basicInfoForm.basicInfoForm.userId);
                  
                 
                }
              })
            }
          }
          //this.router.navigate(['main/admin'])
        }
        else {
           
          this.SpinnerService.hide();
          Swal.fire({
            title: '',
            html: res.message,
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
          //console.log("Error Message: ", res.message);
        }
      })
  }

  savePendingUploads(userId:any){
    userId=parseInt(userId);
    if (this.attachmentsComponent.pendingUploads.length > 0) {
      let pendingUploads=this.attachmentsComponent.getPendingUploads();
      // remove the id form pendingUploads
      let pendingUploadsWithoutId=pendingUploads.map(upload=>{
        const {id,...rest}=upload;
        return rest;
      });
      this.authService.processPendingUploads(
        userId, 
        pendingUploadsWithoutId
      ).subscribe({
        next: () => {
          this.attachmentsComponent.clearPendingUploads();
          setTimeout(()=>{
            this.attachmentsComponent.loadAttachments();
          },4000)
        },
        error: (error) => {
          // Handle upload errors
          Swal.fire({
            title: '',
            text: 'Some attachments failed to upload. Please try uploading them again.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          });
        }
      });
    }

  }

  isCurrentTabFormValid() {
    if (this.userType == 1 || this.isviewProfile) {
      return true;
    }
     
    var res, result;
    if (this.activeTabIndex == 0) {
      if (this.userType== 1){
        result = this.basicInfoComponent.clearValidationForInternal();
        if (result == false) {
          res = false
        }
      }else{
      result = this.basicInfoComponent.isBasicInfoFormValid();
      if (result == false) {
        res = false
      }
    }
    }
    else if (this.activeTabIndex == 1) {
      if (this.userType== 1){
        result = this.additionalInfoComponent.clearValidationForInternal();
        if (result == false) {
          res = false
        }
      }else{
      result = this.additionalInfoComponent.isAdditionalInfoFormValid();
      if (result == false) {
        res = false
      }
    }
    }
    else if (this.activeTabIndex == 2) {
      if (this.userType== 1){
        result = this.liencesAndCertificationComponent.clearValidationForInternal();
        if (result == false) {
          res = false
        }
      }else{
      result = this.liencesAndCertificationComponent.isCertificateFormValid()
      if (result == false) {
        res = false
      }
    }
    }
    return res;

  }
  isCurrentTabFormdirty() {
     
    var res, result;
    if (this.activeTabIndex == 0) {
      result = this.basicInfoComponent.isBasicInfoFormDirty();
      //console.log("result in ()", result)
      if (result == true) {
        res = true
      }
    }
    else if (this.activeTabIndex == 1) {
      result = this.additionalInfoComponent.isAdditionalInfoFormDirty();
      if (result == true) {
        res = true
      }
    }
    else if (this.activeTabIndex == 2) {
      result = this.liencesAndCertificationComponent.isCertificateFormDirty()
      if (result == true) {
        res = true
      }
    }
    //console.log("res in isCurrentTabFormdirty()", res)
    return res;
  }



  tabChanged(event: MatTabChangeEvent) {
    this.selectedInternalSection !='internal'?this.selectedInternalSection = 'internal':this.selectedInternalSection;
  
    if (this.activeTabIndex < event.index) {
      var x = this.isCurrentTabFormValid()
      if (x == false) {
        this.tabGroup.selectedIndex = this.activeTabIndex;
      }
      else {
        this.activeTabIndex = event.index;
        this.isFirstTab = event.index === 0;
        this.isLastTab = event.index === this.tabCount - 1;
      }
    }
    else {
      this.activeTabIndex = event.index;
      this.isFirstTab = event.index === 0;
      this.isLastTab = event.index === this.tabCount - 1;
    }
  }


  changeTab(index: any, changeTo: any) {
    if (changeTo == 'next') {
      this.tabGroup.selectedIndex = index + 1;
    }
    else {
      this.tabGroup.selectedIndex = index - 1;
    }
  }
  // checkCurrentTab(){
  //   console.log("activeTabIndex", this.activeTabIndex )
  //   if (this.activeTabIndex === 8){
  //     return true
  //   }else{
  //     return false
  //   }
  // }

   receiveRoleAndTypeData(data: { role?: number[] | any; type?: number; userId?: string | null } | any) {
  // console.log("Before role check - tabCount:", this.tabCount);
  const userRole = Number((localStorage.getItem('LoggedUserRole')));
  const userType = Number((localStorage.getItem('LoggedUserType')));

  const currentURL = window.location.href;
  const currentUrlObj = new URL(currentURL);
  
  if (currentUrlObj.pathname == "/main/admin/add-user-tabs" || currentUrlObj.pathname == "/main/admin/view-profile") {
    if (data.role && data.role.length != 0) {
      for (const x of data.role) {
        if (x == 4 && userRole == 1) {
          this.tabCount = 8;      //for Tabs
          this.isFirstTab = true; // For disable Previous button
          this.isLastTab = false;
          this.showFileTracTab = true;
          break;
        }
        else if (x == 4 && (userRole == 2 || userRole == 3)) {
          if (userType == 2) {
          this.tabCount = 7;      //for Tabs (increased by 1 for Attachments)
          this.isFirstTab = true; // For disable Previous button
          this.isLastTab = false;
          this.checkFileTracTabAllowed();
          }else{
            this.tabCount = 8;      //for Tabs (increased by 1 for Attachments)
            this.isFirstTab = true; // For disable Previous button
            this.isLastTab = false;
            this.showFileTracTab = true;
          }
          break;
        }
        else {
          this.tabCount = 1;      //for Tabs
          this.isFirstTab = true; // For disable Previous button
          this.isLastTab = true;
          this.showFileTracTab = false;
        }
      }
    }
    else {
      this.tabCount = 1;      //for Tabs
      this.isFirstTab = true; // For disable Previous button
      this.isLastTab = true;
      this.showFileTracTab = false;
    }
  }
  else if (currentUrlObj.pathname == "/main/admin/update-profile") {
    debugger
    // Get current user data from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userRoles = data?.role || [];
    const loggedUserType = Number(localStorage.getItem('LoggedUserType'));
    
    // Check if user has adjuster role (role id 4)
    const hasAdjusterRole = userRoles.some((role: any) => role === 4);
    
    if (hasAdjusterRole) {
      // User is an adjuster
      if (loggedUserType === 1) {
        // Adjuster with internal user type
        this.tabCount = 8; // Increased by 1 for Attachments
        this.isFirstTab = true;
        this.isLastTab = false;
        this.showFileTracTab = true;
      } else if (loggedUserType === 2) {
        // Adjuster with external user type - check if FileTrac tab is allowed
        this.tabCount = 6; // Default for adjuster (increased by 1 for Attachments)
        this.isFirstTab = true;
        this.isLastTab = false;
        this.showFileTracTab = false;
        this.checkFileTracTabAllowed(); // This will update tabCount to 7 if FileTrac is allowed
      } else {
        // Default adjuster configuration
        this.tabCount = 6; // Increased by 1 for Attachments
        this.isFirstTab = true;
        this.isLastTab = false;
        this.showFileTracTab = false;
      }
    } else {
      // User is admin, superadmin, or employee
      this.tabCount = 1;
      this.isFirstTab = true;
      this.isLastTab = true;
      this.showFileTracTab = false;
    }
  }

 
  else {
    this.tabCount = 1;      //for Tabs
    this.isFirstTab = true; // For disable Previous button
    this.isLastTab = true;  // For disable next button
    this.showFileTracTab = false;
  }

  // Update the UI first with the tab changes
  this.cdr.detectChanges();

  // Get the latest user data from authService after tabs are set up
  // Deliberately using a timeout to let Angular complete its rendering cycle
  // and make sure we have the latest user data
  setTimeout(() => {
    this.authService.getUserData()
      .pipe(
        filter((userData: any) => userData !== null) // Filter out null values
      )
      .subscribe(userData => {
        // console.log("userData from subscription", userData);
        if (userData) {
          this.updateComponentsWithUserData(userData);
        }
      });
      // console.log("After role check - tabCount:", this.tabCount);
  }, 0);
}

// New helper method to update components with user data
private updateComponentsWithUserData(userData: any) {
  // Only update components that are visible based on tabCount
  if (this.additionalInfoComponent && this.tabCount >= 2) {
    this.additionalInfoComponent.PostUserData(userData);
  }
  if (this.liencesAndCertificationComponent && this.tabCount >= 3) {
    this.liencesAndCertificationComponent.PostUserData(userData.licencesPlusCertification[0]);
  }
  if (this.deploymentInfoComponent && this.tabCount >= 5) {
    this.deploymentInfoComponent.PostUserData(userData.deploymentData);
  }
  if (this.coreValuesComponent && this.tabCount >= 6) {
    // console.log("Core Values data in updateComponentsWithUserData:", userData.coreValueQuestions);
    this.coreValuesComponent.PostUserData(userData.coreValueQuestions);
  }
  if (this.internalInfoComponent && this.tabCount >= 8 && this.userType == 1) {
    this.internalInfoComponent.PostUserData(userData.adjusterInformationInternal[0]);
  }
}

  Reset() {
    if (this.activeTabIndex == 0) {
      this.basicInfoComponent.reset();
    }
    else if (this.activeTabIndex == 1) {
      this.additionalInfoComponent.reset()
    }
    else if (this.activeTabIndex == 2) {
      this.liencesAndCertificationComponent.reset()
    }
    else if (this.activeTabIndex == 3) {
      if (this.userType != 1) { // Only reset for non-internal users
        this.attachmentsComponent.reset()
      }
    }
    else if (this.activeTabIndex == 5) {
      this.deploymentInfoComponent.reset()
    }
    else if (this.activeTabIndex == 6) { // Fixed index for Core Values
      this.coreValuesComponent.reset()
    }
    else if (this.activeTabIndex == 8) {
      this.internalInfoComponent.reset()
    }
  }

  canDeactivate() {
    if (this.isCurrentTabFormdirty() && !this.saveAllowed) {
      return Swal.fire({
        title: 'Are you sure?',
        text: 'Your unsaved changes will be lost! Do you want to leave this page?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave it!',
        confirmButtonColor: '#ffa022',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No, stay on page!'
      }).then((result) => {
        if (result.value) {
          return true;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          return false;
        }
        return false; // Default return value if neither condition is met
      })
    }
    return true;
  }

  clearSessionCache(key: string) {
    localStorage.removeItem(key);
  }

  selectInternalSection(section: 'internal' | 'onboarding' | 'auditTrail') {
    this.selectedInternalSection = section;
    this.showInternalMenu = false; // Hide menu after selection
  }

  /**
   * Check if FileTrac tab should be allowed and configure tab count accordingly
   */
  checkFileTracTabAllowed() {
    const userPayload = this.getUserPayload();
    
    if (!userPayload) {
      // Fallback to default configuration if no user data available
      this.tabCount = 6;
      this.showFileTracTab = false;
      this.cdr.detectChanges();
      return;
    }

    this.authService.GetFileTracId(userPayload).subscribe((item: any) => {
      const userType = Number(localStorage.getItem('LoggedUserType'));
      const userRole = Number(localStorage.getItem('LoggedUserRole'));

      
      // console.log("userType", userType, "userRole", userRole, "item.data", item.data);
      
      this.configureTabsBasedOnUserType(item.data, userType);
      this.cdr.detectChanges();
      
      // console.log("this.tabCount", this.tabCount, "showFileTracTab", this.showFileTracTab);
    });
  }

  /**
   * Get user payload based on priority: editUser → currentUser → viewProfile
   * @returns User payload object or null if no valid user data found
   */
  private getUserPayload(): { userId: any; email: string } | null {
    // Priority 1: editUser
    // Priority 2: currentUser
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    if (currentUrlObj.pathname == "/main/admin/update-profile") {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.data?.userId) {
      return {
        userId: currentUser.data.userId,
        email: currentUser.data.emailAddress
      };
    }
  }
  else{
    const editUser = JSON.parse(localStorage.getItem('editUser') || '{}');
    if (editUser.userId) {
      return {
        userId: editUser.userId,
        email: editUser.emailAddress
      };
    }

    const viewProfile = JSON.parse(localStorage.getItem('viewProfile') || '{}');
    if (viewProfile.userId) {
      return {
        userId: viewProfile.userId,
        email: viewProfile.emailAddress
      };
    }

  }
    // Priority 3: viewProfile (Fixed bug: was using currentUser data instead of viewProfile)
   
    return null;
  }

  /**
   * Configure tab count and FileTrac tab visibility based on user type and FileTrac data
   * @param fileTracData - Data returned from GetFileTracId API
   * @param userType - Type of the logged-in user
   */
  private configureTabsBasedOnUserType(fileTracData: any, userType: number): void {
    // console.log("Before configuring tabs - tabCount:", this.tabCount);
    if (userType === 1 && this.shouldShowEditButton()) {
      // Admin user type
      this.tabCount = 8; // Increased by 1 for Attachments
      // console.log("Admin user type - tabCount set to:", this.tabCount);
      this.showFileTracTab = true;
    } else if (userType === 2 && fileTracData && fileTracData > 0) {
      // User type 2 with valid FileTrac data
      // console.log("item.data", fileTracData);
      this.tabCount = 7; // Increased by 1 for Attachments
      this.showFileTracTab = true;
    } else if (this.showFileTracTabForAdjuster() && fileTracData && fileTracData > 0) {
      this.tabCount = 7; // Increased by 1 for Attachments
      this.showFileTracTab = true;
    } else {
      // Default configuration
      this.tabCount = 6; // Increased by 1 for Attachments
      this.showFileTracTab = false;
    }
  }
  showFileTracTabForAdjuster(): boolean {
    const loggedUserType = Number(localStorage.getItem('LoggedUserType'));
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const roles = user?.data?.role || [];
      const hasInternalAdjusterRole = roles.some((role: any) => role.roleName === 'Adjuster');
      if (hasInternalAdjusterRole && loggedUserType == 1) {
        return true;
      }
    }
    return false;
  }


  /**
   * Check if the current user has permission to see the Edit button
   * Only Admin, Super Admin, and Employee with Internal user type can see the Edit button
   */
  shouldShowEditButton(): boolean {
    const loggedUserRole = Number(localStorage.getItem('LoggedUserRole'));
    const loggedUserType = Number(localStorage.getItem('LoggedUserType'));
    const currentUser = localStorage.getItem('currentUser');
    
    // Check if user type is Internal (1)
    if (loggedUserType !== 1) {
      return false;
    }
    
    // Check if user has Admin (1), Super Admin (2), or Employee role
    if (loggedUserRole === 1 || loggedUserRole === 2) {
      return true;
    }
    
    // Additional check for Employee role from user data
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const roles = user?.data?.role || [];
      
      const hasEmployeeRole = roles.some((role: any) => role.roleName === 'Employee');
      if (hasEmployeeRole) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Enable edit mode when Edit button is clicked
   * This switches from view-only mode to edit mode
   */
  enableEditMode(): void {
    this.isviewProfile = false;
    this.isEdit = true;
    this.basicInfoComponent.enableEditMode();
    if (this.additionalInfoComponent && this.tabCount >= 2) {
      this.additionalInfoComponent.enableEditMode();
    }
    if (this.liencesAndCertificationComponent && this.tabCount >= 3) {
      this.liencesAndCertificationComponent.enableEditMode();
    }
    if(this.attachmentsComponent && this.tabCount >= 4){
      this.attachmentsComponent.enableEditMode();
    }
    if (this.deploymentInfoComponent && this.tabCount >= 5) {
      this.deploymentInfoComponent.enableEditMode();
    }
    if (this.coreValuesComponent && this.tabCount >= 6) {
      this.coreValuesComponent.enableEditMode();
    }
    if (this.fileTracInfoComponent && this.tabCount >= 7) {
      this.fileTracInfoComponent.enableEditMode();
    }
    if (this.internalInfoComponent && this.tabCount >= 8 && this.userType == 1) {
      this.internalInfoComponent.enableEditMode();
    }

   
    // Trigger change detection to update the UI
    this.cdr.detectChanges();
    
    // Show success message
    // Swal.fire({
    //   title: 'Edit Mode Enabled',
    //   text: 'You can now edit the adjuster profile.',
    //   icon: 'success',
    //   timer: 2000,
    //   showConfirmButton: false
    // });
  }

  ngOnDestroy(): void {
    // Clean up when component is destroyed
    this.authService.clearUserDataCache();
    localStorage.removeItem('editUser');
    localStorage.removeItem('viewProfile');
  }
}
