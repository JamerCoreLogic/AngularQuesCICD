import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { QuotesApi } from '../../classes/quotes-api';
import { map, catchError, retry } from 'rxjs/operators';
import { IQuotesResp, IQuotes } from '../../interfaces/base-quotes-list-resp';
import { Observable, throwError, forkJoin } from 'rxjs';
import { QuotesResp } from '../../classes/quotes-resp';
import { IQuotesListReq } from '../../interfaces/base-quotes-list-req';
import { IQuotesFilterReq } from '../../interfaces/base-quotes-filter-req';

import { IQuotesViewUwListresp } from '../../interfaces/base-quoteView-UwList';
import { IQuotePolicyDoc } from '../../interfaces/base-quoteView-policyDoc-resp';
import { IQuoteViewSubmissionResp } from '../../interfaces/base-quoteview-submission';
import { IQuoteViewReq } from '../../interfaces/base-quoteView-req';

import { QuotesView } from '../../classes/quotes-view';
import { IQuotesViewResp } from '../../interfaces/base-quote-view-resp';
import { QuotesViewResp } from '../../classes/quotes-view-resp';


@Injectable({
  providedIn: 'root'
})
export class AQQuotesListService {

  private _quotesData: IQuotes[];

  constructor(
    private _http: HttpClient,
    private _api: QuotesApi,
  ) { }


  QuotesList(userId: number, agentId: number, agencyId: number): Observable<IQuotesResp> {
    let reqData: IQuotesListReq = {
      AgentId: agentId,
      UserId: userId,
      AgencyId: agencyId
    }
    return this._http.post<IQuotesResp>(this._api.quotesListApi, reqData)
      .pipe(
        map((resp: IQuotesResp) => {
          if (resp && resp.data && resp.data.quote) {
            this._quotesData = resp.data.quote;
            sessionStorage.setItem('QuotesData', JSON.stringify(this._quotesData));
            return new QuotesResp(resp);
          }
        })
      )
  }

  QuotesViewList(quoteViewReq: IQuoteViewReq, isEnableForkJoin: boolean = false): Observable<any> {
    /************************************************************
     * 
     * This api has used forkjoin to call 2 api at same time.
     * 
     * **********************************************************/


    // Calling api get quote list
    const _quoteList = this._http.post<IQuotesViewResp>(this._api.quotesListApi, quoteViewReq)
      .pipe(
        map((resp: IQuotesViewResp) => {
          if (resp && resp.data && resp.data.quote) {
            return new QuotesViewResp(resp);
          }
        })
      );

    // Crating request object for quotelist count api
    let quotesCountRequest = JSON.parse(JSON.stringify(quoteViewReq));
    quotesCountRequest.PageSize = "0";
    /* {
      "AgencyId": quoteViewReq.AgencyId,
      "AgentId": quoteViewReq.AgentId,
      "PageNumber": quoteViewReq.PageNumber,
      "PageSize": 0,
      "SearchText": quoteViewReq.SearchText,
      "SortingColumn": "",
      "SortingOrder": "",
      "UserId": quoteViewReq.UserId,
      "ClientID": 1,
      "EffectiveFromDate":quoteViewReq.EffectiveFromDate,
      "EffectiveToDate":quoteViewReq.EffectiveToDate,
      "Period":quoteViewReq.Period,
      "WorkboardStatus":quoteViewReq.WorkboardStatus,
    } */

    // Calling quote list count api
    const _quotesCount = this._http.post(this._api.QuotesCountApi, quotesCountRequest)

    // using fork join to combine 2 apis
    if (isEnableForkJoin) {
      return forkJoin([_quoteList, _quotesCount])
    } else {
      return forkJoin([_quoteList]);
    }
  }

  QuotesFilter(RequstObject: IQuotesFilterReq): Observable<IQuotesResp> {
    return this._http.post<IQuotesResp>(this._api.quotesFilerAPI, RequstObject)
      .pipe(
        map((resp: IQuotesResp) => {
          if (resp && resp.data && resp.data.quote) {
            this._quotesData = resp.data.quote;
            return new QuotesResp(resp);
          }
        })
      )
  }
  QuotesViewFilter(QuoteID: number, UserId: any): Observable<IQuotesViewResp> {
    return this._http.post<IQuotesViewResp>(this._api.quotesViewAPI, {
      "QuoteID": QuoteID,
      "UserId": UserId
    }).pipe(
      map((resp: IQuotesViewResp) => {
        if (resp) {
          return resp;
        }
      })
    )
  }
  QuotesViewUwList(UserId: number, AgentId: number, ClientId: any): Observable<IQuotesViewUwListresp> {
    return this._http.post<IQuotesViewUwListresp>(this._api.quotesViewUwListAPI, {
      "UserId": UserId,
      "AgentId": AgentId,
      "ClientId": ClientId
    }).pipe(
      map((resp: IQuotesViewUwListresp) => {
        if (resp) {
          return resp;
        }
      })
    )
  }



  QuoteGetPolicyDocument(UserId: number, documentType: any, quoteType: any, productType: any, quoteId: number): Observable<IQuotePolicyDoc> {
    return this._http.post<IQuotePolicyDoc>(this._api.getPolicyDocument, {
      "UserId": UserId,
      "documentType": documentType,
      "productType": productType,
      "quoteId": quoteId
    }).pipe(
      map((resp: IQuotePolicyDoc) => {
        if (resp) {
          return resp;
        }
      })
    )
  }


  QuoteViewSubmition(QuoteId: number, UserId: number, Desposition: any, UnderwriterId: number, UnderwriterAssistantId: number, Comments: any): Observable<IQuoteViewSubmissionResp> {
    return this._http.post<IQuoteViewSubmissionResp>(this._api.submissionStatusUpdate, {
      "QuoteId": QuoteId,
      "UserId": UserId,
      "Desposition": Desposition,
      "UnderwriterId": UnderwriterId,
      "UnderwriterAssistantId": UnderwriterAssistantId,
      "Comments": Comments
    }).pipe(
      map((resp: IQuoteViewSubmissionResp) => {
        if (resp) {
          return resp;
        }
      })
    )
  }


  DownloadAcordForm(quoteId: number, formId: number): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this._http.post<Blob>(this._api.DownloadAcordFormAPI, {
      "QuoteId": quoteId,
      "FormId": formId
    }, { headers: headers, responseType: 'blob' as 'json' })
  }
}



