import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILOBGetRequest } from '../../interfaces/base-get-lob-req';
import { ILOBGetResponse } from '../../interfaces/base-get-lob-resp';
import { QuotesApi } from '../../classes/quotes-api';

@Injectable({
    providedIn: 'root'
})

export class LOBService {
    constructor(private _quotesApi: QuotesApi, private _httpClient: HttpClient) { }
    GetLOBList(UserId): Observable<ILOBGetResponse> {
        let lobGetRequest: ILOBGetRequest = {
            UserId: UserId
        }
        return this._httpClient.post<ILOBGetResponse>(this._quotesApi.LOBListApi, lobGetRequest)
            .pipe(
                map((resp: ILOBGetResponse) => {
                    if (resp && resp.data && resp.data.lobsList) {
                        return resp;
                    }
                })
            )
    }


}
