import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { AgencyApi } from '../../classes/agency-api';
import { Observable, pipe } from 'rxjs';
import { AgencyListResp } from '../../classes/agency-list-resp';
import { map } from 'rxjs/operators';
import { IAgencyList, IAgencyListResp, IAgencyDetails } from '../../interfaces/base-agency-list-resp';
import { IAgencyListReq } from '../../interfaces/base-agency-list-req';
import { AQAgencyModule } from '../../aqagency.module';
import { ICreateAgencyReq } from '../../interfaces/base-create-agency-req';
import { ICreateAgencyResp } from '../../interfaces/base-create-agency-resp';
import { CreateAgencyResposeModel } from '../../classes/create-agency';
import { IAgencyProgramResp } from '../../interfaces/base-agency-program-resp';
import { INewAgencyListResp } from '../../interfaces/base-new-agency-list-resp';
import { AgencyProgramList } from '../../classes/agency-program';


@Injectable({
  providedIn: "root"
})

export class AQAgencyService {

  private _agencyData: IAgencyList[];

  constructor(
    private _http: HttpClient,
    private _agencyApi: AgencyApi
  ) { }

  AgencyList(userId: number, agencyId:number, clientId: string): Observable<IAgencyListResp> {
    let agencyListReq: IAgencyListReq = {
      userId: userId,
      AgencyId: agencyId,
      clientId: clientId
    }
    return this._http.post<IAgencyListResp>(this._agencyApi.agencyListApi, agencyListReq)
      .pipe(map((resp: IAgencyListResp) => {
        if (resp && resp.data) {
          sessionStorage.setItem('AgencyList', JSON.stringify(resp.data.agencyList));
          return new AgencyListResp(resp);
        }
      })
      );
  }

  NewAgencyList(userId: number, agencyId:number, agentId: Number): Observable<INewAgencyListResp> {
    let agencyListReq = {
      userId: userId,
      AgencyId: agencyId,
      AgentId: agentId
    }
    return this._http.post<INewAgencyListResp>(this._agencyApi.newAgencyListApi, agencyListReq)
      .pipe(map((resp: INewAgencyListResp) => {
        if (resp && resp.data) {
          sessionStorage.setItem('AgencyList', JSON.stringify(resp.data.agencyList));
          return resp
         // new AgencyListResp(resp);
        }
      })
      );
  }

  AgencyDetail(userId: number, agencyId:number, agentId: Number): Observable<IAgencyListResp> {
    let agencyListReq = {
      userId: userId,
      AgencyId: agencyId,
      AgentId: agentId
    }
    return this._http.post<IAgencyListResp>(this._agencyApi.agencyDetailApi, agencyListReq)
      .pipe(map((resp: IAgencyListResp) => {
        if (resp && resp.data) {
          sessionStorage.setItem('AgencyList', JSON.stringify(resp.data.agencyList));
          return new AgencyListResp(resp);
        }
      })
      );
  }

  AgencyById(agencyId) {
    let agencyList: IAgencyList[] = JSON.parse(sessionStorage.getItem('AgencyList'))
    if (agencyList.length > 0) {
      return agencyList.filter(agency => agency.agency.agencyId == agencyId);
    }
  }

  BranchById(agencyId, branchId) {
    let agencyList: IAgencyList[] = JSON.parse(sessionStorage.getItem('AgencyList'))
    if (agencyList.length > 0) {
      let agency: IAgencyList[] = agencyList.filter(agency => agency.agency.agencyId == agencyId);
      if (agency.length > 0) {
        let branches = agency.map(agency => agency.branches);
        if (branches.length > 0) {
          return branches[0].filter(branch => branch.branchId == branchId);
        }
      }
    }
  }

  AgencyProgramByAgencyId(agencyId) {
    let agencyList: IAgencyList[] = JSON.parse(sessionStorage.getItem('AgencyList'))
    if (agencyList.length > 0) {
      let agency: IAgencyList[] = agencyList.filter(agency => agency.agency.agencyId == agencyId);
      if (agency.length > 0) {
        return agency.map(agency => agency.agencyPrograms);        
      }
    }
  }

  CreateAgency(req: ICreateAgencyReq): Observable<ICreateAgencyResp> {
    return this._http.post<ICreateAgencyResp>(this._agencyApi.createAgencyApi, req)
      .pipe(
        map((resp: ICreateAgencyResp) => {
          if (resp) {
            return new CreateAgencyResposeModel(resp);
          }
        })
      )
  }

  UpdateAgency(req: ICreateAgencyReq): Observable<ICreateAgencyResp> {
    return this._http.post<ICreateAgencyResp>(this._agencyApi.createAgencyApi, req)
      .pipe(
        map((resp: ICreateAgencyResp) => {
          if (resp && resp.data) {
            return new CreateAgencyResposeModel(resp);
          }
        })
      )
  }

  AgencyProgramList(userId: number): Observable<IAgencyProgramResp> {
    return this._http.post<IAgencyProgramResp>(this._agencyApi.getProgramListApi, {
      "UserId": userId
    }).pipe(
      map((resp: IAgencyProgramResp) => {
        if (resp) {
          return new AgencyProgramList(resp);
        }
      })
    )
  }

  ClearAgencyListSession() {
    sessionStorage.removeItem('AgencyList');
  }

}
