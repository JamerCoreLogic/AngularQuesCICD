import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorkboardListResp } from '../../classes/Model/workboardlist-res/workboardlist-res';
import { IWorkboardRes, Data } from '../../interface/workboard-res/base-workboard-res';
import { WorkboardApi } from '../../classes/Api/workboard-api.service'
import { AqworkboardModule } from '../../aqworkboard.module';
import { IWorkboardReq } from '../../interface/workboard-req/base-workboard-req';
import { IWorkboardPeriodRes } from '../../interface/workboard-period-res/workboard-period-res'
import { INewWorkboardRes } from '../../interface/workboard-res/base-newWorkboard-res'

@Injectable({
  providedIn: "root"
})
export class AqworkboardServiceService {

  private _workData: Data;

  constructor(
    private _http: HttpClient,
    private _workbooardApi: WorkboardApi
  ) { }

  workboardList(period: string, startDate: Date, endDate: Date, agencyID: number, agentID: number, userId: string, clientId: string): Observable<IWorkboardRes> {
    let workboardlist: IWorkboardReq = {
      Period: period,
      StartDate: startDate,
      EndDate: endDate,
      AgencyId: agencyID,
      AgentId: agentID,
      ClientID: clientId,
      UserId: userId
    }
    return this._http.post<IWorkboardRes>(this._workbooardApi.getWorkBoardApi, workboardlist)
      .pipe(
        map((resp: IWorkboardRes) => {
          if (resp && resp.data && resp.data.workBoard) {
            return new WorkboardListResp(resp);
          }
        })
      )
  }

  newWorkboardList(period: string, startDate: Date, endDate: Date, agencyID: number, agentID: number, userId: string, clientId: string): Observable<INewWorkboardRes> {
    let workboardlist: IWorkboardReq = {
      Period: period,
      StartDate: startDate,
      EndDate: endDate,
      AgencyId: agencyID,
      AgentId: agentID,
      ClientID: clientId,
      UserId: userId
    }
    return this._http.post<INewWorkboardRes>(this._workbooardApi.getNewWorkBoardApi, workboardlist)
      .pipe(
        map((resp: INewWorkboardRes) => {
          
          if (resp && resp.data) {
            return (resp);
          }
        })
      )
  }

  


  workboardPeriodList(): Observable<IWorkboardPeriodRes>{
    return this._http.get<IWorkboardPeriodRes>(this._workbooardApi.getperioddApi).pipe(
      map((resp: IWorkboardPeriodRes) => {
        if (resp) {
          return resp;
        }
      })
    )
  }

}

