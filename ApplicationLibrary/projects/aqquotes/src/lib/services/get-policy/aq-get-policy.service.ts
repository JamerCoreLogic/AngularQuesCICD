import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {  IPolicyGetResponse } from '../../interfaces/base-get-policy-resp';
import { QuotesApi } from '../../classes/quotes-api';
import { IPolicyGetRequest } from '../../interfaces/base-get-policy-req';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';



@Injectable({
    providedIn: 'root'
  })

  
export class AQPolicyGetService {

    constructor(
        private _http: HttpClient,
        private _api: QuotesApi
       
    ) { }

    GetPolicy(policyGetRequest:IPolicyGetRequest):Observable<IPolicyGetResponse> {
  
        return this._http.post<IPolicyGetResponse>(this._api.AQGetPolicyAPI, policyGetRequest).pipe(

            map((resp: IPolicyGetResponse) => {            
                return resp;
              })
        )
    }
    
}