import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AqkpiService } from '../../classes/API/aqkpi.service';
import { map } from 'rxjs/operators';
import { Observable, pipe, Subject } from 'rxjs';
import { kpiresponse } from '../../classes/Model/kpi-res';
import { IKpiRes, IKpiRespons } from '../../interface/base-kpi-res';
import { IKpiReq } from '../../interface/base-kpi-req';

@Injectable({
  providedIn: 'root'
})
export class KpiService {

  private quotient = new Subject<IKpiRespons[]>();

  constructor(
    private _http: HttpClient,
    private _kpiApi: AqkpiService
  ) { }

  AqkpiList(userId: number, period: string, startDate: Date, endDate: Date, agencyID: number, agentID: number, clientId: string): Observable<IKpiRes> {
    
    let kpiListReq: IKpiReq = {
      UserId: userId,
      Period: period,
      StartDate: startDate,
      EndDate: endDate,
      AgencyId: agencyID,
      AgentId: agentID,
      ClientID: clientId,
    }
    return this._http.post<IKpiRes>(this._kpiApi.aqkpiApi, kpiListReq)
      .pipe(
        map((resp: IKpiRes) => {
          if (resp && resp.data) {
            let AQQuotient = resp.data.kpiResponses.filter(data=>{
              return data.aqkpi == true;
            })
            if(AQQuotient){
              //sessionStorage.setItem('AQQuotient', JSON.stringify(AQQuotient));
              this.quotient.next(AQQuotient);
            }            
            return new kpiresponse(resp);
          }
        })
      )
  }

  getQuotionData(): Observable<IKpiRespons[]>{
    return this.quotient.pipe(
      map(resp=>{
        return resp as IKpiRespons[];
      })
    )
  }
}
