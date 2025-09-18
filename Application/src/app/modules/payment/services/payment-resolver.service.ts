import { StripePaymentService } from '@agenciiq/payment-gateway';
import { Injectable } from '@angular/core';

import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption/encryption-decryption.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentResolverService  {


  private paymentID: any;
  private paymentStatus: any = "Success";
  private sessionID: any;

  constructor(
    private _payment: StripePaymentService,
    private _decriptService: EncryptionDecryptionService
  ) {
    
    let paymentInfo = JSON.parse(sessionStorage.getItem('paymentKeyInfo'));
    if (paymentInfo && paymentInfo['paymentInfo'] && paymentInfo['sessionId']) {
      let base64Decoded = atob(paymentInfo['paymentInfo']);
      let paymentInfoArray: any[] = this._decriptService.Decrypt(base64Decoded).split('|');
      
      if (paymentInfoArray.length > 0) {
        this.paymentID = paymentInfoArray[0];
        this.sessionID = paymentInfo['sessionId'];
      }
    }
  }




  resolve() {
    if (typeof this.paymentID == undefined || typeof this.sessionID == undefined) {
      return;
    }
   return this._payment.updatePayment(this.paymentID, this.paymentStatus, this.sessionID)/* .subscribe(resp => {
      sessionStorage.removeItem('paymentKeyInfo');
    }); */
  }
}
