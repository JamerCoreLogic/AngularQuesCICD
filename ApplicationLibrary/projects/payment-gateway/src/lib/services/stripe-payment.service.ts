import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StripePaymentApi } from '../classes/stripe-payment-api'
import { IStripeSessionResp } from '../interfaces/base-stripe-session-resp';

@Injectable({
  providedIn: 'root'
})
export class StripePaymentService {

  constructor(
    private _http: HttpClient,
    private _api: StripePaymentApi
  ) { }

  getSession(transaction, successUrl, cancelUrl):Observable<IStripeSessionResp> {
    return this._http.post<IStripeSessionResp>(this._api.getStripeSessionApi, {
      "Transaction": transaction,
      "SuccessUrl": successUrl,
      "CancelUrl": cancelUrl
    });
  }

  updatePayment(paymentID, status, transactionData){
    return this._http.post(this._api.getUpdatePaymentApiUrl, {
      "paymentID": paymentID,
      "status": status,
      "transactionData": transactionData
    })
  }
}
