import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAgentListResp, IAgentList } from '../../interfaces/base-agent-list-resp';
import { AgentListApi } from '../../classes/agent-list-api';
import { map } from 'rxjs/operators';
import { AgentListResp } from "../../classes/agent-list-resp";
import { IAgentlistReq } from '../../interfaces/base-agent-list-req';
import { IAgentAddResp } from '../../interfaces/base-agent-add-resp';
import { IAgentAddReq } from '../../interfaces/base-agent-add-req';
import { IAgentDeleteReq } from '../../interfaces/base-agent-delete-req';
import { IAgentDeleteResp } from '../../interfaces/base-agent-delete-resp';
import { IAgentUpdateReq } from '../../interfaces/base-agent-update-req';
import { IAgentUpdateResp } from '../../interfaces/base-agent-update-resp';
import { IAgenRoleReq } from '../../interfaces/base-agent-roles-req';
import { AgentAd } from '../../classes/agent-add-resp';
import { Agentupdte } from '../../classes/agent-update-resp';
import { AgentDel } from '../../classes/agent-delete-rep';
import { AgentRol } from '../../classes/agent-roles-resp'
import { IAgentRolesResp } from '../../interfaces/base-agent-roles-resp';

@Injectable({
  providedIn: 'root'
})
export class AQAgentListService {

  constructor(
    private http: HttpClient,
    private api: AgentListApi
  ) {

  }

  AgentList(
    UserId: number,
    AgencyId: number,
    AgencyName?: string,
    ManagerName?: string,
    SupervisorName?: string,
    IsActive?: boolean,
  ): Observable<IAgentListResp> {

    var agentListRequestObject: IAgentlistReq = {
      UserId: UserId,
      AgencyName: AgencyName,
      ManagerName: ManagerName,
      SupervisorName: SupervisorName,
      IsActive: IsActive
    }
    return this.http.post<IAgentListResp>(this.api.AgentListApi, agentListRequestObject)
      .pipe(
        map((resp: IAgentListResp) => {

          if (resp && resp.data && resp.data.agentList) {
            sessionStorage.setItem('agentList', JSON.stringify(resp.data.agentList));
            return new AgentListResp(resp);
          }
        })
      )
  }

  CreateAgent(req: IAgentAddReq): Observable<IAgentAddResp> {
    return this.http.post<IAgentAddResp>(this.api.AgentAdd, req)
      .pipe(
        map((resp: IAgentAddResp) => {
          if (resp) {
            return new AgentAd(resp);
          }
        })
      )
  }

  UpdateAgent(req: IAgentUpdateReq): Observable<IAgentUpdateResp> {
    return this.http.post<IAgentUpdateResp>(this.api.AgentAdd, req)
      .pipe(
        map((resp: IAgentUpdateResp) => {
          if (resp && resp.data && resp.data.agent) {
            return new Agentupdte(resp);
          }
        })
      )
  }

  DeleteAgent(
    UserId?: string,
    BranchId?: string,
    AgentId?: string,
    AgencyId?: string,
    ClientId?: string
  ): Observable<IAgentDeleteResp> {
    var agentdeleteRequestObject: IAgentDeleteReq = {
      UserId: UserId,
      BranchId: BranchId,
      AgentId: AgentId,
      ClientId: ClientId,
      AgencyId: AgencyId
    }
    return this.http.post<IAgentDeleteResp>(this.api.AgentDelete, agentdeleteRequestObject)
      .pipe(
        map((resp: IAgentDeleteResp) => {
          if (resp) {
            return new AgentDel(resp);
          }
        })
      )
  }

  AgentById(agentId) {

    let agentList: IAgentList[] = JSON.parse(sessionStorage.getItem('agentList'))
    if (agentList.length > 0) {
      return agentList.filter(agent => agent.agent.agentId == agentId);
    }
  }


  AgentRole(RoleId: string,
    UserId: string,
    ClientId: string,): Observable<IAgentRolesResp> {
    var agentRoleRequestObject: IAgenRoleReq = {
      RoleId: RoleId,
      UserId: UserId,
      ClientId: ClientId

    }
    return this.http.post<IAgentRolesResp>(this.api.agentRole, agentRoleRequestObject)
      .pipe(
        map((resp: IAgentRolesResp) => {
          if (resp) {
            return new AgentRol(resp);
          }
        })
      )
  }

}
