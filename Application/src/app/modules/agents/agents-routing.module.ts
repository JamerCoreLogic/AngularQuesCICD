import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddagentComponent } from './component/addagent/addagent.component';
import { AgentMasterComponent } from './component/agent-master/agent-master.component';
import { AgentlistComponent } from './component/agentlist/agentlist.component';
import { Roles } from 'src/app/global-settings/roles';

const routes: Routes = [
  {
    path: '', component: AgentMasterComponent, children: [
      { path: '', component: AgentlistComponent, data: { roles: [Roles.AgencyAdmin.roleCode, Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] } },
      { path: 'adduser', component: AddagentComponent, data: { roles: [Roles.AgencyAdmin.roleCode, Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] } }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }
