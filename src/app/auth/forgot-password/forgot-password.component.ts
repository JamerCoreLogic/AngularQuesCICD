import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  submit: boolean = false
  PasswordResetForm!: FormGroup
  currentYear: any;
  // email = new FormControl();

  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder, private SpinnerService: NgxSpinnerService) {
    this.createForm()
  }

  ngOnInit(): void {
    this.currentYear=(new Date()).getFullYear()
  }

  createForm() {
    this.PasswordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]]
    })
  }

  sendLink(e: any) {
    this.submit = true;
     
    if (this.PasswordResetForm.valid) {
      this.SpinnerService.show();
        //console.log("email : ", this.PasswordResetForm.controls['email'].value)
        let obj = {
          emailAddress: this.PasswordResetForm.getRawValue().email
        }
        this.authService.forgotPasswordSendLink(obj).pipe(
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
              Swal.fire({
                // title: '',
                text: res.message,
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              })
              this.router.navigate(['/login'])
            }
            else if (res.success == false) {
              Swal.fire({
                // title: '',
                html: res.message,
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              })
            }

          })
      }
    }
  }
