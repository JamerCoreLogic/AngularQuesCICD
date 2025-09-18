import { Injectable } from '@angular/core';
import { IAgent } from '../../../interfaces/base-login-resp';

@Injectable({
  providedIn: 'root'
})
export class AQAgentInfo {

  constructor() { }

  Agent(): IAgent {
    let agents: IAgent = JSON.parse(sessionStorage.getItem('agent'));
    return agents ? agents : null;
  }

  AgentId(): Number {
    return this.Agent() && this.Agent().agentId ? this.Agent().agentId : 0;
  }

  AgentFirstName(): String {
    return this.Agent() && this.Agent().firstName ? this.Agent().firstName : '';
  }

  AgentMiddleName(): String {
    return this.Agent() && this.Agent().middleName ? this.Agent().middleName : '';
  }

  AgentLastName(): String {
    return this.Agent() && this.Agent().lastName ? this.Agent().lastName : '';
  }

  AgentFullName(): String {
    return this.Agent() ? this.Agent().firstName + " " + this.Agent().middleName + " " + this.Agent().lastName : '';
  }

  AgentManagerId(): Number {
    return this.Agent() && this.Agent().managerId ? this.Agent().managerId : 0;
  }

  AgentManagerName(): String {
    return this.Agent() && this.Agent().managerName ? this.Agent().managerName : '';
  }

  AgentSupervisorId(): Number {
    return this.Agent() && this.Agent().supervisorId ? this.Agent().supervisorId : 0;
  }

  AgentSupervisorName(): String {
    return this.Agent() && this.Agent().supervisorname ? this.Agent().supervisorname : '';
  }

}
