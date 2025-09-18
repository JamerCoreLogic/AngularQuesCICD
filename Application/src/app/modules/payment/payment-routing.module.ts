import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentFailedComponent } from './components/payment-failed/payment-failed.component';
import { PaymentSucessfullComponent } from './components/payment-sucessfull/payment-sucessfull.component';
import { StripeComponent } from './components/stripe/stripe.component';
import { PaymentResolverService } from './services/payment-resolver.service';


const routes: Routes = [
  { path: 'stripe-payment', component: StripeComponent },
  { path: 'payment-successful', component: PaymentSucessfullComponent, resolve: [PaymentResolverService] },
  { path: 'payment-failed', component: PaymentFailedComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
