import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICarrierResp } from '../interface/base-carrier-resp';
import { CarrierAPI } from '../classes/carrier-api';
import { ICarrierReq } from '../interface/base-carrier-req';
import { map } from 'rxjs/operators';
import { CarrierResp } from '../classes/carrier-resp';

@Injectable({
  providedIn: 'root'
})
export class AQCarrierService {

  constructor(
    private _http: HttpClient,
    private _carrierApi: CarrierAPI
  ) { }

  CarrierList(UserId): Observable<ICarrierResp> {
    let carrierReq: ICarrierReq = {
      UserId: UserId
    }
    return this._http.post<ICarrierResp>(this._carrierApi.carrierAPI, carrierReq)
      .pipe(
        map((resp: ICarrierResp) => {
          if (resp) {
            return new CarrierResp(resp);
          }
        })
      )
  }

}
