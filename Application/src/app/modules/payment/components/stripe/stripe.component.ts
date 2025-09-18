import { Component, OnDestroy, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption/encryption-decryption.service';
import { StripePaymentService } from '@agenciiq/payment-gateway';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.sass'],
  standalone: false
})
export class StripeComponent implements OnInit, OnDestroy {

  private transation: string = "";
  private successUrl: string = "";
  private cancelUrl: string = "";
  private routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private encryptionService: EncryptionDecryptionService,
    private stripePaymentService: StripePaymentService
  ) {

    this.successUrl = window.location.origin + "/#/payment/payment-successful";
    this.cancelUrl = window.location.origin + "/#/payment/payment-failed";

    this.routeSubscription = this.route.queryParams.subscribe(data => {
      this.transation = data['transaction'];
    });
  }

  ngOnInit() {
    this.CheckOut();
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async CheckOut() {

    let stripePromise = await loadStripe(environment.StripeKey);

    this.stripePaymentService.getSession(atob(this.transation), this.successUrl, this.cancelUrl).subscribe(resp => {
      if (resp?.data?.stripeSessionId) {
        console.log("resp.data.stripeSessionId", resp.data.stripeSessionId);
        sessionStorage.setItem('paymentKeyInfo', JSON.stringify({ paymentInfo: this.transation, sessionId: resp.data.stripeSessionId }));
        stripePromise.redirectToCheckout({ sessionId: resp.data.stripeSessionId }).then(resp => {

        }).catch(err => {

        })
      } else {

      }
    });
  }

}

