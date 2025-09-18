import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { QuotesApi } from '../../classes/quotes-api';
import { IInsuredsProspects } from '../../interfaces/base-insureds-prospects-resp';
import { IInsuredDetailReq } from '../../interfaces/insured-detail-req';
import { IInsuredDetailResponse } from '../../interfaces/insured-detail-resp';
import { IInsuredQuoteResp } from '../../interfaces/base-insured-quote-resp'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsuredsProspectsService {

  constructor(
    private _http: HttpClient,
    private api: QuotesApi,
  ) { }

  
  getInsuredsProspects(userId: number, clientId: any): Observable<IInsuredsProspects> {
    
    return this._http.post<IInsuredsProspects>(this.api.InsuredsProspectsApi, {
      "UserId": userId,
      "ClientID": clientId,
    }).pipe(
      map((resp: IInsuredsProspects) => {
         if (resp) {
          return resp;
        }
      })
    )
  }

  getInsuredDetail(ReqObject:IInsuredDetailReq): Observable<IInsuredDetailResponse> {
    
    return this._http.post<IInsuredDetailResponse>(this.api.GetInsuredDetail, ReqObject).pipe(
      map((resp: IInsuredDetailResponse) => {
         if (resp) {
          return resp;
        }
      })
    )
  }

  addInsuredsQuotes(insuredId: number): Observable<IInsuredQuoteResp> {
    
    return this._http.post<IInsuredQuoteResp>(this.api.AddInsuredquote, {
      "insuredId": insuredId,
    }).pipe(
      map((resp: IInsuredQuoteResp) => {
         if (resp) {
          return resp;
        }
      })
    )
  }


}
