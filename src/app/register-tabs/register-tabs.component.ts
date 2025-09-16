import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyTabChangeEvent as MatTabChangeEvent, MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { HistoryInfoComponent } from './history-info/history-info.component';
import { CertificateInfoComponent } from './certificate-info/certificate-info.component';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { WelcomeFPDComponent } from './welcome-fpd/welcome-fpd.component';
import { CanRegisterComponentDeactivate } from '../services/can-deactivate-register.service';
import { CoreValuesComponent } from './core-values/core-values.component';

@Component({
  selector: 'app-register-tabs',
  templateUrl: './register-tabs.component.html',
  styleUrls: ['./register-tabs.component.scss']
})
export class RegisterTabsComponent implements OnInit, CanRegisterComponentDeactivate {
  @ViewChild('contactInfoComponent') contactInfoComponent!: ContactInfoComponent;
  @ViewChild('historyInfoComponent') historyInfoComponent!: HistoryInfoComponent;
  @ViewChild('certificateInfoComponent') certificateInfoComponent!: CertificateInfoComponent;
  @ViewChild('coreValuesComponent') coreValuesComponent!: CoreValuesComponent;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  isFirstTab: boolean = true;
  isLastTab: boolean = false;
  activeTabIndex = 0;
  tabCount = 4;
  basicInfoForm: any;
  additionalInfoForm: any
  certificateInfoForm: any
  coreValuesForm: any
  isSubmitEnable: boolean = true;
  selectedRolesAsString: any
  adjusterInformationData: any
  editUserRes: any;
  saveAllowed:boolean=false;


  constructor(private authService: AuthService, private SpinnerService: NgxSpinnerService, private router: Router, public dialog: MatDialog) {

  }

  ngOnInit(): void {

  }

  welcomefpd() {
    const dialogRef = this.dialog.open(WelcomeFPDComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      window.location.href = 'https://www.fieldprosdirect.com/about-us';
    });
  }

  convertToString() {
    if (this.basicInfoForm.basicInfoForm.phone) {
      const simpleNumber = this.basicInfoForm.basicInfoForm.phone.replace(/\D/g, ''); //converting "(855) (852)-4589" format to "8558524589"
      this.basicInfoForm.basicInfoForm.phone = simpleNumber;
    }
    if (this.basicInfoForm.basicInfoForm.mobile) {
      const simpleNumber = this.basicInfoForm.basicInfoForm.mobile.replace(/\D/g, '');
      this.basicInfoForm.basicInfoForm.mobile = simpleNumber;
    }
    if (this.basicInfoForm.basicInfoForm.assignments) {
      this.basicInfoForm.basicInfoForm.assignments = this.basicInfoForm.basicInfoForm.assignments.join(',');
    }
    if (this.activeTabIndex >= 1) {
      if (this.additionalInfoForm.additionalInfoForm.approximate_Date_I_Began_Adjusting) {
        const date = new Date(this.additionalInfoForm.additionalInfoForm.approximate_Date_I_Began_Adjusting);
        date.setDate(date.getDate() + 1);
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        const formattedUTCDate = `${year}-${month}-${day}`;
        this.additionalInfoForm.additionalInfoForm.approximate_Date_I_Began_Adjusting = formattedUTCDate
      }
      if (this.additionalInfoForm.additionalInfoForm.location_Preference) {
        this.additionalInfoForm.additionalInfoForm.location_Preference = this.additionalInfoForm.additionalInfoForm.location_Preference.join(',');
      }
    }
    if (this.activeTabIndex >= 2) {
      if (this.certificateInfoForm?.certificateInfoForm?.qB_Line_Of_Business_Internal) {
        this.certificateInfoForm.certificateInfoForm.qB_Line_Of_Business_Internal = this.certificateInfoForm.certificateInfoForm.qB_Line_Of_Business_Internal.join(',')
      }
      if (this.certificateInfoForm?.certificateInfoForm?.certifications) {
        this.certificateInfoForm.certificateInfoForm.certifications = this.certificateInfoForm.certificateInfoForm.certifications.join(',')
      }
      if (this.certificateInfoForm?.certificateInfoForm?.insurance_Designations) {
        this.certificateInfoForm.certificateInfoForm.insurance_Designations = this.certificateInfoForm.certificateInfoForm.insurance_Designations.join(',')
      }
      if (this.certificateInfoForm?.certificateInfoForm?.adjuster_Licenses) {
        this.certificateInfoForm.certificateInfoForm.adjuster_Licenses = this.certificateInfoForm.certificateInfoForm.adjuster_Licenses.join(',')
      }
    }
  }

  saveAndSubmit(text: any) {
    //  debugger
    var x = this.contactInfoComponent.isBasicInfoFormValid()
    var y;
    var z;
    var coreValues;
    if (this.activeTabIndex >= 1) {
      y = this.historyInfoComponent.isAdditionalInfoFormValid();
      //console.log("Additional Form", y);
    }
    if (this.activeTabIndex == 2) {
      z = this.certificateInfoComponent.iscertificateInfoFormValid();
    }
    if (this.activeTabIndex == 3) {
      z = this.certificateInfoComponent.iscertificateInfoFormValid();
      coreValues = this.coreValuesComponent.isCoreValuesFormValid();
    }

    var isValid = false;
    if (this.activeTabIndex == 0 && x != false) {
      this.basicInfoForm = x;
      this.additionalInfoForm = {};
      this.certificateInfoForm = {};
      this.coreValuesForm = {};
      isValid = true
    } else if (this.activeTabIndex == 1 && (x != false && y != false)) {
      this.additionalInfoForm = y;
      this.basicInfoForm = x;
      this.certificateInfoForm = {};
      this.coreValuesForm = {};
      isValid = true
    } else if (this.activeTabIndex == 2 && (x != false && y != false && z != false)) {
      this.certificateInfoForm = z;
      this.additionalInfoForm = y;
      this.basicInfoForm = x;
      this.coreValuesForm = {};
      isValid = true
    }
    else if (this.activeTabIndex == 3 && (x != false && y != false && z != false)) {
      this.certificateInfoForm = z;
      this.additionalInfoForm = y;
      this.basicInfoForm = x;
      this.coreValuesForm = coreValues;
      isValid = true
    }

    // console.log("Basic Info Form", this.basicInfoForm);
    // console.log("Additional Info Form", this.additionalInfoForm);
    // console.log("Internal Info Form", this.certificateInfoForm);
    // console.log("Core Values Form", this.coreValuesForm);
    if (isValid == true) {
      this.addUserConfirm(text)
    }
  }

  addUserConfirm(text: any) {
    this.saveAllowed=true;
    this.convertToString();
    let objData = {
      userId: this.basicInfoForm.basicInfoForm.userId,
      fName: this.basicInfoForm.basicInfoForm.firstName,
      lName: this.basicInfoForm.basicInfoForm.lastName,
      mName: this.basicInfoForm.basicInfoForm.middleName,
      emailAddress: this.basicInfoForm.basicInfoForm.email,
      confirmEmail: this.basicInfoForm.basicInfoForm.confirmEmail,
      mobile: this.basicInfoForm.basicInfoForm.phone,
      address1: this.basicInfoForm.basicInfoForm.address1,
      address2: this.basicInfoForm.basicInfoForm.address2,
      city: this.basicInfoForm.basicInfoForm.city,
      state: this.basicInfoForm.basicInfoForm.state,
      zip: this.basicInfoForm.basicInfoForm.zip,
      country: this.basicInfoForm.basicInfoForm.country,
      mobileNumber: this.basicInfoForm.basicInfoForm.mobile,
      companyName: this.basicInfoForm.basicInfoForm.companyName,
      i_Am_Interested_In_The_Following_Assignments: this.basicInfoForm.basicInfoForm.assignments,
      what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned: this.basicInfoForm.basicInfoForm.what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned,
      i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In: this.basicInfoForm.basicInfoForm.i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In,
      i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In: this.basicInfoForm.basicInfoForm.i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In,
      password: "",
      secondaryEmail: "",
      xactNetAddress: "",
      status: "",
      profilePic: "",
      mode: text,
      dateTimeOffSet: new Date().getTimezoneOffset().toString(),
      skillsAndWorkHistoryData: [this.additionalInfoForm.additionalInfoForm || {}],
      licencesPlusCertificationData: [this.certificateInfoForm.certificateInfoForm || {}],
      coreValueQuestions: this.coreValuesForm.coreValuesForm || []
    }
    // console.log("Payload objecttttttt: ", objData)
    let model = JSON.stringify(objData);
    this.SpinnerService.show();
    this.authService.addUserRegistration(objData).pipe(
      catchError(error => {
        this.SpinnerService.hide();
        if (error.status || error.status == 0) {
          Swal.fire({
            title: 'Status code: ' + error.status,
            text: 'Sorry! Something went wrong. Your request could not be completed, Please try again later.',
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
        }
        return throwError(error);
      })
    )
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true) {
           
          if (text == "submit") {
            // Swal.fire({
            //   title: '',
            //   text: this.basicInfoForm.basicInfoForm.firstName + " " + this.basicInfoForm.basicInfoForm.lastName + " submitted successfully.",
            //   icon: 'success'
            // }).then((result) => {
            //   if (result.isConfirmed) {
            this.welcomefpd()  //Navigate to Fpd
            //     }
            //   })
          }
          else if (text == "save") {
            if (!this.basicInfoForm.basicInfoForm.userId) {
              // Swal.fire({
              //   title: '',
              //   text: this.basicInfoForm.basicInfoForm.firstName + " " + this.basicInfoForm.basicInfoForm.lastName + " added successfully.",
              //   icon: 'success'
              // })
              //console.log("User Added Successfully")
              this.contactInfoComponent.saveUserId(res.message)
            }
            else {
              // Swal.fire({
              //   title: '',
              //   text: this.basicInfoForm.basicInfoForm.firstName + " " + this.basicInfoForm.basicInfoForm.lastName + " updated successfully.",
              //   icon: 'success'
              // })
              //console.log("User Update Successfully")
            }
          }
        }
        else {
           
          if (res.errorCode == '1' || res.errorCode == '3') {
            Swal.fire({
              title: '',
              html: res.message,
              icon: 'warning',
              confirmButtonText: 'Login',
              confirmButtonColor: '#ffa022',
              showDenyButton: true,
              denyButtonText: 'Reset Password',
              denyButtonColor: '#ffa022',
              showCancelButton: true,
              cancelButtonText: 'Cancel',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/login'])
              }
              else if (result.isDenied) {
                this.router.navigate(['/forgot-password'])
              }
              else {
                return
              }
            })
            //console.log("Error Message: ", res.message);
          }
          else {
            Swal.fire({
              title: '',
              html: res.message,
              icon: 'error',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            })
            //console.log("Error Message: ", res.message);
          }
          //console.log("Error Message: ", res.message);
          if (text != "submit") {
            this.tabGroup.selectedIndex = this.activeTabIndex - 1;
          }
        }
      })
  }

  isCurrentTabFormValid() {
    //  debugger
    var res, result;
    if (this.activeTabIndex == 0) {
      result = this.contactInfoComponent.isBasicInfoFormValid();
      if (result == false) {
        res = false
      }
      else {
        this.saveAndSubmit('save')
        this.basicInfoForm = result;
      }
    }
    else if (this.activeTabIndex == 1) {
      result = this.historyInfoComponent.isAdditionalInfoFormValid();
      if (result == false) {
        res = false
      }
      else {
        this.saveAndSubmit('save')
        this.additionalInfoForm = result;
      }
    }
    else if (this.activeTabIndex == 2) {
      result = this.certificateInfoComponent.iscertificateInfoFormValid();
      if (result == false) {
        res = false
      }
      else {
        this.saveAndSubmit('save')
        this.certificateInfoForm = result;
      }
    }
    return res;

  }
  isCurrentTabFormdirty() {
     
    var res, result;
    if (this.activeTabIndex == 0) {
      result = this.contactInfoComponent.isContactInfoformDirty();
      //console.log("result in ()", result)
      if (result == true) {
        res = true
      }
    }
    else if (this.activeTabIndex == 1) {
      result = this.historyInfoComponent.ishistoryInfoFormDirty();
      if (result == true) {
        res = true
      }
    }
    else if (this.activeTabIndex == 2) {
      result = this.certificateInfoComponent.isCertificateFormDirty()
      if (result == true) {
        res = true
      }
    }
    //console.log("res in isCurrentTabFormdirty()", res)
    return res;
  }

  tabChanged(event: MatTabChangeEvent) {
     
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

  // allowedTabs() {
  //   const userRole = Number((localStorage.getItem('LoggedUserRole')));
  //   const userType = Number((localStorage.getItem('LoggedUserType')));
  //   //console.log("Type user role and usertype", typeof (userRole), typeof (userType))
  //   this.tabCount = 3;
  //   if (userRole == 4 && userType == 2) {
  //     this.tabCount = 2;
  //   }
  // }
  Reset() {
    if (this.activeTabIndex == 0) {
      this.contactInfoComponent.reset();
    }
    else if (this.activeTabIndex == 1) {
      this.historyInfoComponent.reset()
    }
    else if (this.activeTabIndex == 2) {
      this.certificateInfoComponent.reset()
    }
    else if (this.activeTabIndex == 3) {
      this.coreValuesComponent.reset()
    }
  }

  bacK() {
    window.location.href = 'https://www.fieldprosdirect.com/join';
  }
  
  canDeactivate(){
     
    if(this.isCurrentTabFormdirty() && !this.saveAllowed){
      return Swal.fire({
        title: 'Are you sure?',
        text: 'You want to leave this page. Your changes will be lost!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave it!',
        confirmButtonColor:'#ffa022',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No, keep it'
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


}
