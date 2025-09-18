import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IAQFormsResp } from '../../interfaces/base-aq-forms';
import { AQForms } from '../../classes/aq-forms';
import { QuotesApi } from '../../classes/quotes-api';
import { IQuoteFromChatbotResp } from '../../interfaces/base-quote-from-chat';
import { Observable } from 'rxjs';
import { IFullQuoteFromChatbotResp } from '../../interfaces/base-fullquote-chat';


@Injectable({
  providedIn: 'root'
})
export class AQFormsService {

  constructor(
    private _http: HttpClient,
    private api: QuotesApi
  ) { }



  AQForms(UserId, LOB, State, QuoteType, insuredId?: any, ClientId?: any) {
    return this._http.post(this.api.AQFormsAPI, {
      UserId: UserId,
      LOB: LOB,
      State: State,
      QuoteType: QuoteType,
      insuredId: insuredId,
      ClientId: ClientId
    }).pipe(
      map((resp: IAQFormsResp) => {
        if (resp && resp.data) {
          sessionStorage.setItem('AQFormData', JSON.stringify(resp));
          return new AQForms(resp);
        } else {
          return resp;
        }
      })
    )
  }

  GetAQFormsFromStorage(): IAQFormsResp {
    let aqfoms = sessionStorage.getItem('AQFormData');
    if (aqfoms) {
      let parsedForm: IAQFormsResp = JSON.parse(aqfoms);
      return parsedForm;
    }
  }

  ClearAQFormStorage() {
    sessionStorage.removeItem('AQFormData');
  }

  QuoteDataFromChatbot(AgentId: string, QuoteType: string, XMLData: string):Observable<IQuoteFromChatbotResp> {
    return this._http.post<IQuoteFromChatbotResp>(this.api.AddQuoteFromChatAPI, {
      AgentId: AgentId, QuoteType: QuoteType, XMLData: XMLData
    }).pipe(
      map((resp:IQuoteFromChatbotResp)=>{
        return resp;
      })
    )
  }
  GenerateFullQuoteByChatbot(AgentId: string, QuoteType: string, XMLData: string):Observable<IFullQuoteFromChatbotResp> {
    return this._http.post<IFullQuoteFromChatbotResp>(this.api.generateFullQuoteByChatbot, {
      AgentId: AgentId, QuoteType: QuoteType, XMLData: XMLData
    }).pipe(
      map((resp:IFullQuoteFromChatbotResp)=>{
        return resp;
      })
    )
  }
}
