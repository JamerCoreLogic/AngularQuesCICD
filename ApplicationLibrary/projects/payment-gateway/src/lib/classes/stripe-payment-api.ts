import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class StripePaymentApi {

    private _getStripeSessionApi = '/api/Payment/GetStripeSession';
    private _updatePaymentApi = '/api/Payment/UpdatePayment'



    //api/AQForms/GetExcelFormDownload

    get getStripeSessionApi() {
        return this._getStripeSessionApi;
    }

    get getUpdatePaymentApiUrl() {
        return this._updatePaymentApi;
    }


    set PaymentApiEndPoint(value) {
        this._getStripeSessionApi = value + this._getStripeSessionApi;
        this._updatePaymentApi = value + this._updatePaymentApi;
    }
}
