import { StripePaymentService } from '@agenciiq/payment-gateway';
import { Component, OnInit } from '@angular/core';
import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption/encryption-decryption.service';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.component.html',
  styleUrls: ['./payment-failed.component.sass'],
  standalone: false
})
export class PaymentFailedComponent implements OnInit {

  private paymentID: any;
  private paymentStatus: any = "Error";
  private sessionID: any;

  constructor(
    private _payment: StripePaymentService,
    private _decriptService: EncryptionDecryptionService
  ) {

    let paymentInfo = JSON.parse(sessionStorage.getItem('paymentKeyInfo'));
    if (paymentInfo && paymentInfo['paymentInfo'] && paymentInfo['sessionId']) {
      let paymentInfoArray: any[] = this._decriptService.Decrypt(atob(paymentInfo['paymentInfo'])).split('|');
      if (paymentInfoArray.length > 0) {
        this.paymentID = paymentInfoArray[0];
        this.sessionID = paymentInfo['sessionId'];
      }
    }
  }

  ngOnInit() {
    if (typeof this.paymentID == undefined || typeof this.sessionID == undefined) {
      return;
    }
    this._payment.updatePayment(this.paymentID, this.paymentStatus, this.sessionID).subscribe(resp => {
      sessionStorage.removeItem('paymentKeyInfo');
    });
  }

  close() {
    window.close();
  }

}
