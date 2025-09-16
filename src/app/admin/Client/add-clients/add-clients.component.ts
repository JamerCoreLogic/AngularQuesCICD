import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-clients',
  templateUrl: './add-clients.component.html',
  styleUrls: ['./add-clients.component.scss']
})
export class AddClientsComponent implements OnInit {
  addClientForm!: FormGroup
  submit: boolean = false
  isEdit = localStorage.getItem('currentPage');
  color: ThemePalette = 'accent';

  constructor(public dialog: MatDialog, private router: Router, private authService: AuthService,
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    private SpinnerService: NgxSpinnerService) {
    this.createAddClient();

    if (this.isEdit == 'editClientPage') {
      //console.log("data of edit user", this.data);
      this.onEdit();
    }
  }

  ngOnInit(): void {
  }

  createAddClient() {
    this.addClientForm = this.fb.group({
      firstName: ['', Validators.required],
      address1: [''],
      address2: [''],
      city: [''],
      state: [''],
      zip: [''],
      phone: ['', [Validators.required, Validators.minLength(14)]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      isActive: [true, Validators.required],
    })
  }

  toLower(event: any) {
    let x = event.target.value.toLowerCase()
    event.target.value = x
  }

  onEdit() {
    this.addClientForm.controls['firstName'].setValue(this.data.firstName)
    this.addClientForm.controls['address1'].setValue(this.data.address1)
    this.addClientForm.controls['address2'].setValue(this.data.address2)
    this.addClientForm.controls['city'].setValue(this.data.city)
    this.addClientForm.controls['state'].setValue(this.data.state)
    this.addClientForm.controls['zip'].setValue(this.data.zip)
    this.addClientForm.controls['phone'].setValue(this.data.primaryPhone)
    this.transformToPhonePipe();
    this.addClientForm.controls['email'].setValue(this.data.Email)
    this.addClientForm.controls['isActive'].setValue(this.data.isActive)
  }
  transformToPhonePipe() {
     
    if (this.addClientForm.controls['phone'].value) {
      const phoneControl = this.addClientForm.controls['phone']
      const digits = phoneControl.value.replace(/\D/g, '');
      const formattedNumber = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      this.addClientForm.patchValue({ phone: formattedNumber });
      if (phoneControl) {
        phoneControl.setValidators([Validators.required, Validators.minLength(14)])
        phoneControl.updateValueAndValidity();
      }
    }
  }
  transFormPhone() {
     
    if (this.addClientForm.controls['phone'].value) {
      const simpleNumber = this.addClientForm.controls['phone'].value.replace(/\D/g, '');
      this.addClientForm.controls['phone'].setValue(simpleNumber);
    }
    if (this.addClientForm.controls['phone']) {
      this.addClientForm.controls['phone'].setValidators([Validators.required, Validators.minLength(10)])
      this.addClientForm.controls['phone'].updateValueAndValidity();
    }
  }
  updateClient() {
     
    this.SpinnerService.show();
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 15000);
    this.submit = true;
    if (this.addClientForm.valid == false) {
      this.SpinnerService.hide();
      for (const key of Object.keys(this.addClientForm.controls)) {
        if (this.addClientForm.controls[key].value == '') {
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
      this.transFormPhone()
      let payload = {
        clientId: this.data.clientId,
        fName: this.addClientForm.getRawValue().firstName,
        address1: this.addClientForm.getRawValue().address1,
        address2: this.addClientForm.getRawValue().address2,
        city: this.addClientForm.getRawValue().city,
        state: this.addClientForm.getRawValue().state,
        zip: this.addClientForm.getRawValue().zip,
        primaryPhone: this.addClientForm.getRawValue().phone,
        emailAddress: this.addClientForm.getRawValue().email,
        isActive: this.addClientForm.getRawValue().isActive,
        isDeleted: false,
        createdBy: localStorage.getItem('LoggeduserId'),
        createdOn: new Date(),
        status: ""
      }
      let model = JSON.stringify(payload);
      this.authService.editClient(payload).pipe(
        catchError(error => {
          this.SpinnerService.hide();
          this.transformToPhonePipe()
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
              text: this.addClientForm.getRawValue().firstName + " updated successfully.",
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            })
            this.dialog.closeAll()
            this.router.navigate(['main/admin/clients'])
          }
          else {
             
            this.transformToPhonePipe()
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

  addClient() {
     
    this.SpinnerService.show();
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 10000);
    this.submit = true;
    if (this.addClientForm.valid == false) {
      this.SpinnerService.hide();
      for (const key of Object.keys(this.addClientForm.controls)) {
        if (this.addClientForm.controls[key].value == '') {
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
      this.transFormPhone()
      let payload = {
        // clientId: 0,
        fName: this.addClientForm.getRawValue().firstName,
        address1: this.addClientForm.getRawValue().address1,
        address2: this.addClientForm.getRawValue().address2,
        city: this.addClientForm.getRawValue().city,
        state: this.addClientForm.getRawValue().state,
        zip: this.addClientForm.getRawValue().zip,
        primaryPhone: this.addClientForm.getRawValue().phone,
        emailAddress: this.addClientForm.getRawValue().email,
        isActive: this.addClientForm.getRawValue().isActive,
        isDeleted: false,
        createdBy: localStorage.getItem('LoggeduserId'),
        createdOn: new Date(),
        status: ""
      }
      let model = JSON.stringify(payload);  
      this.authService.addClient(payload).pipe(
        catchError(error => {
          this.SpinnerService.hide();
          this.transformToPhonePipe()
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
              title: '',
              text: this.addClientForm.getRawValue().firstName + " added successfully.",
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            })
            this.dialog.closeAll()
            this.router.navigate(['main/admin/clients'])
          }
          else {
             
            this.transformToPhonePipe()
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

  reset() {
    this.submit = false;
    this.addClientForm.reset();
    this.addClientForm.controls['isActive'].setValue(true);
  }
  onAutoFill(event: AnimationEvent): void {
    // console.log("event onAutoFillStart",event)
    if (event.animationName === 'onAutoFillStart') {
      // Trigger change detection and form validation
      this.addClientForm.get('phone')?.updateValueAndValidity();
    }
  }
}
