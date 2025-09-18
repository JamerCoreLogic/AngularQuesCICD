import { StripePaymentService } from '@agenciiq/payment-gateway';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption/encryption-decryption.service';

@Component({
    selector: 'app-payment-sucessfull',
    templateUrl: './payment-sucessfull.component.html',
    styleUrls: ['./payment-sucessfull.component.sass'],
    standalone: false
})
export class PaymentSucessfullComponent implements OnInit {



  constructor(
    private _activatedRoute: ActivatedRoute
  ) {
    this._activatedRoute.data.subscribe(details=>{
    })
  }

  ngOnInit() {
   
  }

  close() {
    window.close();
  }
}
