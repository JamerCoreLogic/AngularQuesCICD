import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISaveAdvanceFilterResp, ISaveFilterResponse } from '../../interfaces/base-save-advance-filter-res';
import { ISaveAdvanceFilterReq } from '../../interfaces/base-save-advance-filter-req';
import { QuotesApi } from '../../classes/quotes-api';
import { SaveAdvanceFilterResp } from '../../classes/save-advance-filter-resp';
import { GetAdvanceFilterParameter } from '../../classes/get-advance-filter-parameter-resp';
import { map } from 'rxjs/operators';
import { IGetAdvanceFilterParameterResp } from '../../interfaces/base-get-advance-filter-parameter-resp';

@Injectable({
  providedIn: 'root'
})
export class AQSaveAdvanceFilterService {

  constructor(
    private _httpClient: HttpClient,
    private _api: QuotesApi
  ) { }

  SaveAdvanceFilter(FilterType: string, FilterName: string, FilterParticulars:string, Parameters: string, IsDefault: Boolean, UserId: number, AgentId:number, AdvancedFilterId?: number): Observable<ISaveAdvanceFilterResp> {

    let reqData: ISaveAdvanceFilterReq = {
      AgentID: AgentId,
      AdvancedFilterId: AdvancedFilterId,
      FilterType: FilterType,
      FilterName: FilterName,
      FilterParticulars:FilterParticulars,
      IsDefault: IsDefault,
      Parameters: Parameters,
      UserId: UserId
    }

    return this._httpClient.post(this._api.saveFiltersAPI, reqData)
      .pipe(
        map((resp: ISaveAdvanceFilterResp) => {
          if (resp && resp.data && resp.data.filterResponse) {
            return new SaveAdvanceFilterResp(resp);
          }
        })
      )
  }

  GetAdvanceFilterParameter(FilterType: string, userId: string, AgentId: number): Observable<IGetAdvanceFilterParameterResp> {
    return this._httpClient.post<IGetAdvanceFilterParameterResp>(this._api.getFiltersAPI, {
      FilterType: FilterType,
      "UserId": userId,
      AgentID : AgentId 
    })
      .pipe(
        map((resp: IGetAdvanceFilterParameterResp) => {
          if (resp && resp.data && resp.data.advancedFilterList) {
            return new GetAdvanceFilterParameter(resp);
          }
        })
      )
  }




}
