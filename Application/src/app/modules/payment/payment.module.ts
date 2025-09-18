import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentRoutingModule } from './payment-routing.module';
import { StripeComponent } from './components/stripe/stripe.component';
import { PaymentSucessfullComponent } from './components/payment-sucessfull/payment-sucessfull.component';
import { PaymentFailedComponent } from './components/payment-failed/payment-failed.component';


@NgModule({
  declarations: [StripeComponent, PaymentSucessfullComponent, PaymentFailedComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule
  ]
})
export class PaymentModule { }
