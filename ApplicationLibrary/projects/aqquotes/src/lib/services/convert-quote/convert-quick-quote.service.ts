import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { QuotesApi } from '../../classes/quotes-api';
import { IConvertQuickQuoteResponse, IPolicyGetData } from '../../interfaces/base-convert-quick-quote-resp';
import { IConvertQuickQuoteRequest, IProceedToBindReq, IIssueQuoteRequest } from '../../interfaces/base-convert-quick-quote-req';
import { Observable } from 'rxjs';
import { ConvertQuickQuoteResp } from '../../classes/convert-quick-quote-resp';
import { IProceedToBindResp } from '../../interfaces/base-proceed-to-bind-resp';
import { IIssueQuoteResp } from '../../interfaces/base-issue-quote-resp';


@Injectable({
    providedIn: 'root'
})
export class AQConvertQuickQuoteService {

    constructor(
        private _http: HttpClient,
        private _quotesApi: QuotesApi
    ) { }

    ConvertQuickQuote(convertQuickQuoteRequest: IConvertQuickQuoteRequest): Observable<IConvertQuickQuoteResponse> {
        return this._http.post<IConvertQuickQuoteResponse>(this._quotesApi.getConvertQuickQuoteAPI, convertQuickQuoteRequest)
            .pipe(
                map((resp: IConvertQuickQuoteResponse) => {
                    if (resp && resp.data) {
                        sessionStorage.setItem('fullQuotesResponse', JSON.stringify(resp.data));
                        return new ConvertQuickQuoteResp(resp);
                    }
                })
            )
    }

    ConvertedQuoteResponse(): IPolicyGetData {
        const resp: IPolicyGetData = JSON.parse(sessionStorage.getItem('fullQuotesResponse'));
        if (resp) {
            return resp;
        }
    }

    ClearConvertedQuoteResponse() {
        sessionStorage.removeItem('fullQuotesResponse');
    }


    proceedToBind(proceedToBindReq: IProceedToBindReq): Observable<IProceedToBindResp> {
        return this._http.post<IProceedToBindResp>(this._quotesApi.ProceedToBindAPI, proceedToBindReq)
            .pipe(
                map((resp: IProceedToBindResp) => {
                    return resp;
                })
            )
    }

    IssueQuote(IssueQuoteRequest: IIssueQuoteRequest): Observable<IIssueQuoteResp> {
        return this._http.post<IIssueQuoteResp>(this._quotesApi.IssueQuoteAPI, IssueQuoteRequest)
            .pipe(
                map((resp: IIssueQuoteResp) => {
                    return resp;
                })
            )
    }

}