import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParameterApi } from '../../classes/parameter-api';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AQZipDetailsService {

  constructor(
    private _http: HttpClient,
    private _api: ParameterApi
  ) { }

  ZipDetails(zipcode: number) {
    return this._http.post(this._api.zipDetailsApi, {
      Zip5: zipcode
    });
  }


  ValidateAddress(zipCode: number, city: string, state: string, address1?: string, address2?: string) {
  //  return this._http.post(this._api.validateAddressApi.toLowerCase().includes("convelo.agenciiq.net")?this._api.validateAddressApi.replace("https://convelo.agenciiq.net","https://united.agenciiq.net"):this._api.validateAddressApi
    return this._http.post(this._api.validateAddressApi, {
      Address1: address1,
      Address2: address2,
      City: city,
      State: state,
      Zip5: zipCode,
      Zip4: ""
    })
  }

  ValidateAddressField(Zip5: number, Zip4: number, city: string, state: string, address1?: string, address2?: string) {
    return this._http.post(this._api.validateAddressFieldApi, {
      Address1: address1,
      Address2: address2,
      City: city,
      State: state,
      Zip5: Zip5,
      Zip4: Zip4
    })
  }
}
