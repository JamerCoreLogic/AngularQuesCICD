import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISavePolicy } from '../../interfaces/base-save-policy';
import { QuotesApi } from '../../classes/quotes-api';
import { ISavePolicyResp } from '../../interfaces/base-save-policy-resp';
import { IQuoteFormResp } from '../../interfaces/base-quote-form-resp';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AQSavePolicyService {

  constructor(
    private _http: HttpClient,
    private _api: QuotesApi
  ) { }



  SavePolicy(quoteRequest: ISavePolicy): Observable<ISavePolicyResp> {
    return this._http.post<ISavePolicyResp>(this._api.AQSavePolicyAPI, quoteRequest)
      .pipe(
        map((resp: ISavePolicyResp) => {
          return resp;
        })
      )
  }

  CheckAqXML(quoteRequest: ISavePolicy): Observable<ISavePolicyResp> {
    return this._http.post<ISavePolicyResp>(this._api.AQCheckAqXMLAPI, quoteRequest)
      .pipe(
        map((resp: ISavePolicyResp) => {
          return resp;
        })
      )
  }

  getQuoteForm(QuoteID: number, UserId: any): Observable<IQuoteFormResp> {
    return this._http.post<IQuoteFormResp>(this._api.getQuoteForms, {
      "QuoteID": QuoteID,
      "UserId": UserId
    }).pipe(
      map((resp: IQuoteFormResp) => {
        if (resp) {
          return resp;
        }
      })
    )
  }

  getRiskAnalysisForms(QuoteID: number, UserId: any): Observable<IQuoteFormResp> {
    return this._http.post<IQuoteFormResp>(this._api.getRiskAnalysisForms, {
      "QuoteID": QuoteID,
      "UserId": UserId
    }).pipe(
      map((resp: IQuoteFormResp) => {
        if (resp) {
          return resp;
        }
      })
    )
  }

  uploadAcord(userid, lob, state, quoteType, acordData):Observable<any> {
    return this._http.post(this._api.uploadAcordApi, { 
      "UserId": userid, 
      "LOB": lob, 
      "State": state, 
      "QuoteType": quoteType, 
      "ACORDDATA": acordData 
    });
  }

}
