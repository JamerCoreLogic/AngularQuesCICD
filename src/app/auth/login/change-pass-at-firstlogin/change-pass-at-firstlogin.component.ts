import { Component, OnInit,PipeTransform } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Pipe } from '@angular/core';

@Pipe({ name: 'tooltipList' })
export class TooltipListPipe implements PipeTransform {

  transform(lines: string[]): string {

    let list: string = '';

    lines.forEach(line => {
      list += '• ' + line + '\n';
    });

    return list;
  }
}
@Component({
  selector: 'app-change-pass-at-firstlogin',
  templateUrl: './change-pass-at-firstlogin.component.html',
  styleUrls: ['./change-pass-at-firstlogin.component.scss']
})


export class ChangePassAtFirstloginComponent implements OnInit {
  hide = true;
  SavePasswordForm!: FormGroup
  passwordSubmit: boolean = false;
  hasUpperCase: any;
  hasLowerCase: any;
  hasNumber: any;
  hasSpecialChar: any;
  hasMinLength: any;
  submit: boolean = false
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private SpinnerService: NgxSpinnerService,
    private aRoute: ActivatedRoute, public dialog: MatDialog) {
    this.createForm();
  }

  ngOnInit(): void {
     
    // this.aRoute.queryParams.subscribe(params => {
    //   var token = params['token'];
    //   this.SavePasswordForm.controls['token'].setValue(token.replace(/ /g, '+'));

    //   var url = window.location;
    //   var access_token = new URLSearchParams(url.search).get('token');
    //   //console.log("token is 1:", this.SavePasswordForm.controls['token'].value, '  Access token using window location', access_token)
    // });
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
      token: ['',],
      newPassword: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator })
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
  }

  savePassword() {
     
    this.passwordSubmit = true
    this.submit = true;
    if (this.SavePasswordForm.invalid) {
      Swal.fire({
        // title: 'Status code: ' + error.status,
        text: 'Please validate the password.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      })
    }
    else {
      let obj = {
        "emailAddress": "",
        "password": this.SavePasswordForm.getRawValue().newPassword,
        "userId": localStorage.getItem('LoggeduserId'),
        "value": "2"
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
            Swal.fire({
              // title: '',
              text: 'Password updated successfully.',
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            })
            this.dialog.closeAll()
            this.router.navigate(['login'])
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
  }
}
