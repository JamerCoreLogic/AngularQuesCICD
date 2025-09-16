import { CommunicationService } from './../../services/communication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SubmissionReceivedComponent } from '../submission-received/submission-received.component';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-submit-response',
  templateUrl: './submit-response.component.html',
  styleUrls: ['./submit-response.component.scss']
})
export class SubmitResponseComponent implements OnInit {
  token: any;
  details: any;
  isDeclined: boolean = false;
  adjusterRequestId:any;
  receivedOn: any;
  isSubmitted!:boolean


  constructor(public dialog: MatDialog, private ar:ActivatedRoute,
     private cs:CommunicationService,
     private router: Router,
     private spinner: NgxSpinnerService

     ) { }
  acceptanceForm!: FormGroup;


  openDialogesubmission() {
    const dialogRef =this.dialog.open(SubmissionReceivedComponent,{

      data:"right click",
      panelClass: 'submission'
    });

    // const dialogRef =this.dialog.open(DetailboxComponent
    // );

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });

  }
  ngOnInit(): void {
    this.ar.queryParams.subscribe(params => {
      //console.log("params",params);
      if(params['data']){
        this.token = params['data'];
        this.cs.GetDataForBindUIScreen(this.token).subscribe((response:any ) => {
          //console.log("response",response.data[0]);
        this.details = response.data[0];
        this.adjusterRequestId = response.data[0].adjusterRequestId;
      }
      )}
    });
    this.acceptanceForm = new FormGroup({
      'xactNetAddress': new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      'inspectLossTime': new FormControl(null,[Validators.required,Validators.maxLength(2)]),
      'estimateReturnTime': new FormControl(null,[Validators.required,Validators.maxLength(2)]),
      'remarks': new FormControl(null),
    });

  }
  onSubmit() { 
    this.isSubmitted=true;
    if (!this.acceptanceForm.valid) {

  } else {
    this.spinner.show();
    const payload = {
      "adjusterResponseId": 0,
      "adjusterRequestId": this.adjusterRequestId,
      "isDeclined": this.isDeclined,
      "xactnetAddress": this.acceptanceForm.value.xactNetAddress,
      "insuredClaimantCanInspectLossInDays": this.acceptanceForm.value.inspectLossTime,
      "returnTheEstimateInDays": this.acceptanceForm.value.estimateReturnTime,
      "receivedOn": new Date().toISOString().split('.')[0]+"Z",
      "isCurrent": true,
      "isDeleted": false,
      "createdOn": new Date().toISOString().split('.')[0]+"Z",
      "createdBy": this.adjusterRequestId.toString(),
      "modifiedOn": new Date().toISOString().split('.')[0]+"Z",
      "modifiedBy": this.adjusterRequestId.toString(),
      "remarks": this.acceptanceForm.value.remarks
    }
    //console.log(payload);
    this.cs.SubmitResponce(payload).subscribe((response:any ) => {
      //console.log("response",response);
      if(response.success == true){
        this.spinner.hide();
        this.openDialogesubmission();
      }
      else{
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.message,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#ffa022',
        })
      }
    })
  }

  }
  thanksPage(){
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You want to cancel this!',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#ffa022',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
    this.router.navigate(['communication/thanks']);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
       
      }
  })
  }

}


