import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
@Pipe({ name: 'tooltipList' })
export class TooltipListPipe implements PipeTransform {

  transform(lines: string[]): string {

    let list: string = '';

    lines.forEach(something => {
      list += '• ' + something + '\n';
    });

    return list;
  }
}
@Component({
  selector: 'app-confirm-otp',
  templateUrl: './confirm-otp.component.html',
  styleUrls: ['./confirm-otp.component.scss']
})
export class ConfirmOtpComponent implements OnInit {
  SavePasswordForm!: FormGroup
  isHitOtpVerify: boolean = false
  // otpVerified: boolean = false
  // otpSubmit: boolean = false
  passwordSubmit: boolean = false
  token: any;
  hide = true;
  hasUpperCase: any;
  hasLowerCase: any;
  hasNumber: any;
  hasSpecialChar: any;
  hasMinLength: any;
  isOtpValid: boolean = true;
  showAlerts: boolean = false;
  currentYear: any;


  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private SpinnerService: NgxSpinnerService,
    private aRoute: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit(): void {
    this.currentYear=(new Date()).getFullYear()
     
    this.aRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      this.token = this.token.replace(/ /g, '+');
      //console.log("token is 1:", this.token)

      // this.token = this.token.replace(/ /g, '+');
      // //console.log("token is 2:", this.token)

    });
    let currentValue: any;
    this.SavePasswordForm.controls['newPassword'].valueChanges.subscribe((newValue) => {
      if (newValue !== currentValue) {
        currentValue = newValue;
        this.SavePasswordForm.controls['newPassword'].updateValueAndValidity();
      }
    });
  }

  createForm() {
    this.SavePasswordForm = this.fb.group({
      otp: ['', [Validators.required]],
      newPassword: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value ? null : { 'notMatched': true };
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
    if (this.SavePasswordForm.controls['newPassword'].errors?.['strength']) {
      const password = this.SavePasswordForm.controls['newPassword'].value;
      this.hasUpperCase = /[A-Z]/.test(password);
      this.hasLowerCase = /[a-z]/.test(password);
      this.hasNumber = /[0-9]/.test(password);
      this.hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
      this.hasMinLength = password.length >= 8;
    }
  }



  confirmpassfunction(event: any) {
    this.checkPasswordStrength();
    let newpass = this.SavePasswordForm.controls['newPassword'].value
    let confirmnewpass = this.SavePasswordForm.controls['confirmPassword'].value
    if (newpass && confirmnewpass) {
      if (newpass == confirmnewpass) {
        this.SavePasswordForm.controls['confirmPassword'].setErrors({ 'notMatched': false })
        this.SavePasswordForm.controls['confirmPassword'].updateValueAndValidity();
      }
      else {
        this.SavePasswordForm.controls['confirmPassword'].setErrors({ 'notMatched': true })
      }
    }
    if (event.target.value) {
      this.showAlerts = true;
    } else {
      this.showAlerts = false;
    }
  }
  generatePasswordTooltip() {
    if (this.SavePasswordForm.controls['newPassword'].hasError('required')) {
      return 'Password is required';
    } else if (this.SavePasswordForm.controls['newPassword'].hasError('pattern')) {
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



  // verifyOtp() {
  //   this.otpSubmit = true
  //   if (this.otpVerified == false && this.SavePasswordForm.controls['otp'].valid) {
  //     let obj = {
  //       "otp": this.SavePasswordForm.getRawValue().otp,
  //       "userId": this.token,
  //       "value": "string"
  //     }

  //     this.SpinnerService.show();
  //     setTimeout(() => {
  //       this.SpinnerService.hide();
  //     }, 15000);

  //     this.authService.verifyOtp(obj).pipe(
  //       catchError(error => {
  //         this.SpinnerService.hide();
  //         if (error.status == 0) {
  //           Swal.fire({
  //             title: 'Status code: ' + error.status,
  //             text: 'Please check the connection. Unable to communicate with server via HTTP(s).',
  //             icon: 'warning'
  //           })
  //         }
  //         else if (error.status) {
  //           Swal.fire({
  //             title: 'Status code: ' + error.status,
  //             text: 'Sorry! Something went wrong. Your request could not be completed, Please try again later.',
  //             icon: 'warning'
  //           })
  //         }
  //         if (error.status === 404) {
  //           //console.log('the server cannot or will not process the request due to something that is perceived to be a client error');
  //         } else {
  //           //console.log('Error retrieving data:', error.message);
  //         }
  //         return throwError(error);

  //       })
  //     )
  //       .subscribe((res: any) => {
  //         this.SpinnerService.hide();
  //         this.isHitOtpVerify = true;
  //         if (res == true) {
  //           this.otpVerified = true
  //         }
  //       })
  //   }
  // }

  savePassword() {
     
    this.passwordSubmit = true
    if (this.SavePasswordForm.valid) {
      let obj = {
        "emailAddress": "",
        "password": this.SavePasswordForm.getRawValue().newPassword,
        "userId": this.token,
        "value": "",
        "otp": this.SavePasswordForm.getRawValue().otp
      }

      this.SpinnerService.show();
      setTimeout(() => {
        this.SpinnerService.hide();
      }, 15000);

      this.authService.saveForgotPassword(obj).pipe(
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
          if (res.success == true) {
            this.isOtpValid = true
            Swal.fire({
              // title: '',
              text: 'Password updated successfully.',
              icon: 'success',
              confirmButtonText: 'Log-in',
              showCancelButton: false,
              confirmButtonColor: '#ffa022',
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                this.router.navigate(['login'])
              }
            })
          }

          else {
            if (res.message == "The OTP code you’ve entered is incorrect. Please check your email for the correct OTP.") {
              this.isOtpValid = false
              //console.log("Invalid OTP")
            }
            else {
              // Swal.fire({
              //   // title: 'Status code: ' + error.status,
              //   text: res.message,
              //   icon: 'error',
              //   confirmButtonText: 'Ok',
              //   confirmButtonColor: '#ffa022',
              // })
              //console.log(res.message);
            }
          }
        })
    }
  }
}
