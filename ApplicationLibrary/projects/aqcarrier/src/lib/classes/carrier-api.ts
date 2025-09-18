import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CarrierAPI {

    private _carrierApi = '/api/Parameters/GetCarrierData';

    get carrierAPI() {
        return this._carrierApi;
    }

    set CarrierAPiEndPoint(value) {
        this._carrierApi = value + this._carrierApi;
    }

}