import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-and-reset-password',
  templateUrl: './change-and-reset-password.component.html',
  styleUrls: ['./change-and-reset-password.component.scss']
})
export class ChangeAndResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup
  submit: boolean = false
  currentPage = localStorage.getItem('currentPage');

  constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router, private authService: AuthService,
    private SpinnerService: NgxSpinnerService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createReserPassForm();
    if (this.currentPage == 'resetPass') {
      this.onEdit();
    }
  }

  ngOnInit(): void {
  }

  createReserPassForm() {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
    })
  }

  onEdit() {
    this.resetPasswordForm.controls['email'].setValue(this.data.emailAddress)
    this.resetPasswordForm.controls['email'].disable()
    this.resetPasswordForm.updateValueAndValidity()
  }
  changeResetPassword(value: any) {
     
    this.submit = true
    if (this.resetPasswordForm.invalid) {

    }
    else {
      let obj = {
        "updateBy": Number(localStorage.getItem('LoggeduserId')),
        "email": this.resetPasswordForm.getRawValue().email,
        "value": value,
      }

      let model = JSON.stringify(obj);  
      this.SpinnerService.show();
      setTimeout(() => {
        this.SpinnerService.hide();
      }, 15000);

      this.authService.updateResetPassword(obj).pipe(
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
            if (value == 'update') {
              Swal.fire({
                // title: '',
                text: 'Password updated successfully.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
                }).then(res=>{
                  
                })
            }
            else {
              Swal.fire({
                // title: '',
                text: 'Password reset successfully.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              }).then(res=>{
                
              })
            }
            this.dialog.closeAll()
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
