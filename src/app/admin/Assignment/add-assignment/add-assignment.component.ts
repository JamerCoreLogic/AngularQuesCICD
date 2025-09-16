import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, catchError, finalize, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.scss']
})
export class AddAssignmentComponent implements OnInit {
  addAssignmentForm!: FormGroup
  submit: boolean = false
  isEdit = localStorage.getItem('currentPage');
  color: ThemePalette = 'accent';

  constructor(public dialog: MatDialog, private router: Router, private authService: AuthService,
    private fb: FormBuilder, private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer, private SpinnerService: NgxSpinnerService) {
    this.createAddClient();

    if (this.isEdit == 'editAssignmentPage') {
      //console.log("data of edit user", this.data);
      this.onEdit();
    }
  }

  ngOnInit(): void {
  }

  createAddClient() {
    this.addAssignmentForm = this.fb.group({
      type: ['', Validators.required],
    })
  }

  onEdit() {
    this.addAssignmentForm.controls['type'].setValue(this.data.type)
  }

  updateAssignment() {
     
    this.submit=true;
    this.SpinnerService.show();
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 15000);
    if (this.addAssignmentForm.valid == false) {
      this.SpinnerService.hide();
      for (const key of Object.keys(this.addAssignmentForm.controls)) {
        if (this.addAssignmentForm.controls[key].value == '') {

        }
      }
    }

    else {
      let payload = {
        assessmentTypeId: this.data.assessmentTypeId,
        type: this.addAssignmentForm.getRawValue().type,
        isDeleted: false,
        createdBy: localStorage.getItem('LoggeduserId'),
        createddOn: new Date(),
        status: ""
      }
      let model = JSON.stringify(payload);
      this.authService.editAssessment(payload).pipe(
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
            //console.log('The server cannot or will not process the request due to something that is perceived to be a client error');
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
              title: '',
              text: this.addAssignmentForm.getRawValue().type + " updated successfully.",
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            })
            this.dialog.closeAll()
            this.router.navigate(['main/admin/assignment'])
          }
          else {
             
            Swal.fire({
              title: '',
              text: res.message,
              icon: 'error',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            })
            //console.log("Error Message: ", res.message);
          }
        })
    }
  }

  addAssignment() {
     
    this.submit=true;
    this.SpinnerService.show();
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 15000);
    if (this.addAssignmentForm.valid == false) {
      this.SpinnerService.hide();
      for (const key of Object.keys(this.addAssignmentForm.controls)) {
        if (this.addAssignmentForm.controls[key].value == '') {
          Swal.fire({
            title: '',
            text: 'Please fill all the required fields (marked with *)',
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
        }
      }
    }

    else {
      let payload = {
        type: this.addAssignmentForm.getRawValue().type,
        isDeleted: false,
        createdBy: localStorage.getItem('LoggeduserId'),
        createddOn: new Date(),
        status: ""
      }
      let model = JSON.stringify(payload);
      this.authService.addAssessment(payload).pipe(
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
            //console.log('The server cannot or will not process the request due to something that is perceived to be a client error');
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
              title: '',
              text: this.addAssignmentForm.getRawValue().type + " added successfully.",
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            })
            this.dialog.closeAll()
            this.router.navigate(['main/admin/assignment'])
          }
          else {
             
            Swal.fire({
              title: '',
              text: res.message,
              icon: 'error',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            })
            //console.log("Error Message: ", res.message);
          }
        })
    }
  }
  clearForm() {
    this.addAssignmentForm.reset();
  }

}
