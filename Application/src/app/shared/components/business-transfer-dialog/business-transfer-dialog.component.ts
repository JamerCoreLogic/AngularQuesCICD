import { Component, OnInit } from '@angular/core';
import { BusinessTransferService } from '@agenciiq/aqbusinesstransfer';
import { DialogRef } from '../../utility/aq-dialog/dialog-ref';
import { DialogConfig } from '../../utility/aq-dialog/dialog-config';

@Component({
    selector: 'app-business-transfer-dialog',
    templateUrl: './business-transfer-dialog.component.html',
    standalone: false
})
export class BusinessTransferDialogComponent implements OnInit {

  message:string;
  constructor(private _businessTranferService: BusinessTransferService,private dialog: DialogRef, private config: DialogConfig) { }

  ngOnInit() {

    this.message=this.config.data;
  }
  onCancel(){
    this.dialog.close(null);

  }
  onClose() {
   
   this.dialog.close('');
   
  }

}
