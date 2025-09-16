import { Location } from '@angular/common';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router,  Event as RouterEvent } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, filter, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  ChangePasswordForm!: FormGroup
  submit: boolean = false
  matched: boolean = false
  hide = true;
  passwordSubmit: boolean = false
  hasUpperCase: any;
  hasLowerCase: any;
  hasNumber: any;
  hasSpecialChar: any;
  hasMinLength: any;
  showAlerts: boolean = false;
  private previousUrl: string = '';
  private currentUrl: string='';

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private SpinnerService: NgxSpinnerService,
    private location: Location
    ) {
    this.createChangePasswordForm();
    if (localStorage.getItem('LoggeduserId') && localStorage.getItem('LoggeduserEmail') && localStorage.getItem('LoggedUserName')) {
      //console.log("Logged user id: ", localStorage.getItem('LoggeduserId'))
    }
    else {
      this.authService.logout();
      this.router.navigate(['/login'])
    }
    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  ngOnInit(): void {
    let currentValue: any;
    this.ChangePasswordForm.controls['newPassword'].valueChanges.subscribe((newValue) => {
      if (newValue !== currentValue) {
        currentValue = newValue;
        this.ChangePasswordForm.controls['newPassword'].updateValueAndValidity();
      }
    });
  }

 
  createChangePasswordForm() {
    this.ChangePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value ? null : {'notMatched': true};
}
  passwordStrengthValidator(control: FormControl) {
    const hasUpperCase = /[A-Z]/.test(control.value);
    const hasLowerCase = /[a-z]/.test(control.value);
    const hasNumber = /[0-9]/.test(control.value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(control.value);
    const hasMinLength = control.value.length >= 8;
  
    const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
  
    if (!passwordValid) {
      return { 'strength': true };
    }
  
    return null;
  }
  checkPasswordStrength() {
   if (this.ChangePasswordForm.controls['newPassword'].errors?.['strength']) {
     const password = this.ChangePasswordForm.controls['newPassword'].value;
     this.hasUpperCase = /[A-Z]/.test(password);
     this.hasLowerCase = /[a-z]/.test(password);
     this.hasNumber = /[0-9]/.test(password);
     this.hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
     this.hasMinLength = password.length >= 8;
   }
 }

  validatePassword(controlName: string) {
    const control = this.ChangePasswordForm.get(controlName);
    if (control) {
      control.markAsTouched();
      if (control.invalid) {
        this.submit = true;
      }
    }
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls['newPassword'].value;
    let confirmPass = group.controls['confirmPassword'].value;
    // only apply the notMatched error if both fields have values
    if (pass && confirmPass) {
      return pass === confirmPass ? null : { notMatched: true }
    }
    return null;
  }
  confirmpassfunction(event: any) {
    this.checkPasswordStrength();
    let newpass = this.ChangePasswordForm.controls['newPassword'].value
    let confirmnewpass = this.ChangePasswordForm.controls['confirmPassword'].value
    if (newpass && confirmnewpass) {
      if (newpass == confirmnewpass) {
        this.ChangePasswordForm.controls['confirmPassword'].setErrors({ 'notMatched': false })
        this.ChangePasswordForm.controls['confirmPassword'].updateValueAndValidity();
      }
      else {
        this.ChangePasswordForm.controls['confirmPassword'].setErrors({ 'notMatched': true })
      }
    }
    if (event.target.value) {
      this.showAlerts = true;
    } else {
      this.showAlerts = false;
    }
  }
  generatePasswordTooltip() {

    if (this.ChangePasswordForm.controls['newPassword'].hasError('required')) {
      return 'Password is required';
    } else if (this.ChangePasswordForm.controls['newPassword'].hasError('pattern')) {
      let errorMessages = [];
      if (!this.hasUpperCase) {
        errorMessages.push('Must contain at least one uppercase letter.');
      }
      if (!this.hasLowerCase) {
        errorMessages.push('Must contain at least one lowercase letter.');
      }
      if (!this.hasNumber) {
        errorMessages.push('Must contain at least one number.');
      }
      if (!this.hasSpecialChar) {
        errorMessages.push('Must contain at least one special character.');
      }
      if (!this.hasMinLength) {
        errorMessages.push('Must be at least 8 characters.');
      }
      return errorMessages.join('\n');
    } else {
      return 'Password is valid';
    }
  }

  savePassword() {
     
    this.SpinnerService.show();
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 15000);

    this.submit = true;
    if (this.ChangePasswordForm.valid == false) {
      this.SpinnerService.hide();
      for (const key of Object.keys(this.ChangePasswordForm.controls)) {
        if (this.ChangePasswordForm.controls[key].value == '') {
          //console.log("key is:", key)
          Swal.fire({
            title: 'Required!',
            text: 'All fields must fulfilled!',
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
        }
      }
    }
    else {
      let payload = {
        "emailAddress": "",
        "oldPassword": this.ChangePasswordForm.getRawValue().currentPassword,
        "newPassword": this.ChangePasswordForm.getRawValue().newPassword,
        "userId": localStorage.getItem('LoggeduserId'),
        "value": "1"
      }
      this.authService.changePass(payload).pipe(
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
          if (error.status === 404) {
            //console.log('the server cannot or will not process the request due to something that is perceived to be a client error');
          } else {
            //console.log('Error retrieving data:', error.message);
          }
          return throwError(error);
        })
      )
        .subscribe((res: any) => {
          this.SpinnerService.hide();
          //console.log("response is:", res);
          if (res.success == true) {
            //console.log("response is: true");
            Swal.fire({
              // title: 'Status code: ' + error.status,
              text: 'Password updated successfully.',
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['/login']);
              }
            })
          }
          else {
            Swal.fire({
              // title: 'Status code: ' + error.status,
              text: res.message,
              icon: 'error',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            })
          }
        })

    }
    //console.log(this.ChangePasswordForm.controls['currentPassword'].valid, "   value", this.ChangePasswordForm.controls['currentPassword'].value)
    //console.log(this.ChangePasswordForm.controls['newPassword'].valid, "   value", this.ChangePasswordForm.controls['newPassword'].value)
    //console.log(this.ChangePasswordForm.controls['confirmPassword'].valid, "   value", this.ChangePasswordForm.controls['confirmPassword'].value)
  }
  navigateToPreviousUrl() {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
    } else {
      // If there is no previous URL, use the back method of the Location service
      this.location.back();
    }
  }
}
