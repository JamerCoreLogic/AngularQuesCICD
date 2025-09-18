import { Injectable } from '@angular/core';
import { AQAgentListService } from '@agenciiq/aqagent';
import { AQUserInfo, AQAgencyInfo } from '@agenciiq/login';


@Injectable({
  providedIn: 'root'
})
export class AgentListService {

  private supervisorList = [];
  private mangerList = [];

  constructor(
    private _agentService: AQAgentListService,
    private _userInfo: AQUserInfo,
    private _agencyInfo: AQAgencyInfo
  ) {

    let _userId = this._userInfo.UserId() ? this._userInfo.UserId() : 0;
    let _agencyId = this._agencyInfo.Agency() && this._agencyInfo.Agency().agencyId ? this._agencyInfo.Agency().agencyId : 0;

    this.getSupervisorAndManagerNameList(_userId, _agencyId);
  }

  ManagerList() {
    return this.mangerList;
  }

  SupervisorList() {
    this.supervisorList;
  }

  private getSupervisorAndManagerNameList(userId, agencyId) {
    this._agentService.AgentList(userId, agencyId)
      .subscribe(data => {
        if (data && data.data && data.data.agentList) {
          let _agencyList = data.data.agentList;

          // Logic to find supervisor list

          let _supervisorList = _agencyList.filter(agent => {
            return agent.agentRoles.some(role => {
              return role.roleCode == 'Supervisor'
            })
          }).map(supervisor => {
            return {
              supervisorId: supervisor.agent.agentId,
              supervisorName: supervisor.agent.firstName + " " + supervisor.agent.middleName + " " + supervisor.agent.lastName
            }
          });

          this.supervisorList = _supervisorList;

         

          // Logic to find manager list

          let _managerList = _agencyList.filter(agent => {
            return agent.agentRoles.some(role => {
              return role.roleCode == 'Manager'
            })
          }).map(manager => {
            return {
              managerId: manager.agent.agentId,
              managerName: manager.agent.firstName + " " + manager.agent.middleName + " " + manager.agent.lastName
            }
          });

          this.mangerList = _managerList;

        

        }
      })
  }

}
