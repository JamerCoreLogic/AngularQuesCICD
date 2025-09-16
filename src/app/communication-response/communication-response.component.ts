import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DeclineResponseComponent } from './decline-response/decline-response.component';
import { CommunicationService } from './../services/communication.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-communication-response',
  templateUrl: './communication-response.component.html',
  styleUrls: ['./communication-response.component.scss']
})
export class CommunicationResponseComponent implements OnInit {
  showMore: boolean = false;
  shouldShowMoreToggle: boolean = false;
  shortDescription: string = "";

  toggleReadMore(){
    this.showMore = !this.showMore;
  }

  encryptedData: any;
  opDatails: any;
  constructor(private aRoute: ActivatedRoute, private CS:CommunicationService, private router:Router ,public dialog: MatDialog,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {

    this.aRoute.queryParams.subscribe(params => {
      this.encryptedData = params['token'];
      this.encryptedData = this.encryptedData.replace(/ /g, '+');
      //console.log("encryptedData", this.encryptedData)

    });
    this.CS.GetDataForBindUIScreen(this.encryptedData).subscribe((response:any ) => {
      this.opDatails = response.data[0];
      //console.log("opDatails",this.opDatails);
      this.checkForReadMore(this.opDatails?.description);
      // load the data in the UI if the communication is not declined
      // if(this.opDatails.communicationStatus == "completed"){
      //   //console.log("completed")
      //   Swal.fire({
      //     title: 'Opportunity is closed',
      //     text: 'Thank you for your interest in this opportunity. Unfortunately this opportunity has been closed. If you think you have recieved this in error, please contact recruiting@fpdsolutions.com.',
      //     icon: 'warning',
      //     showCancelButton: false,
      //     confirmButtonText: 'Ok',
      //     confirmButtonColor: '#ffa022',
      //   }).then((result) => {
      //     if (result) {
      //       this.router.navigate(['login']);
      //     }
      //   })
      // }


    })
  }
  checkForReadMore(description: string) {
    if (!description) {
      this.shouldShowMoreToggle = false;
      this.shortDescription = '';
      return;
    }
  
    const words = description.split(' ');
    if (words.length > 6) {
      this.shouldShowMoreToggle = true;
      this.shortDescription = words.slice(0, 6).join(' ') + '...';
    } else {
      this.shouldShowMoreToggle = false;
      this.shortDescription = '';
    }
  }

  accept() {
    //navigate to the screen /submit with the encrypted data
    this.router.navigate(['communication/submit'], { queryParams: { data: this.encryptedData } });
  }
  decline() {
    this.spinner.show();
    const data={
      "adjusterResponseId": 0,
      "adjusterRequestId": this.opDatails.adjusterRequestId,
      "isDeclined": true,
      "receivedOn": new Date().toISOString().split('.')[0]+"Z",
      "isCurrent": true,
      "isDeleted": false,
      "createdOn": new Date().toISOString().split('.')[0]+"Z",
      "createdBy": this.opDatails.adjusterRequestId.toString(),
      "modifiedOn": new Date().toISOString().split('.')[0]+"Z",
      "modifiedBy": this.opDatails.adjusterRequestId.toString(),

    }

    this.CS.SubmitResponce(data).subscribe((response:any ) => {
      //console.log("response",response);
      if(response.success == true){
        this.spinner.hide();

      const dialogRef =this.dialog.open(DeclineResponseComponent,{

        data:"right click",
        panelClass: 'decline'
      });

      // const dialogRef =this.dialog.open(DetailboxComponent
      // );

      dialogRef.afterClosed().subscribe(result => {
        //console.log('The dialog was closed');
      });
    }


  },(error)=>{
    this.spinner.hide();
    //console.log("error",error);
  }
    )

  }
}
