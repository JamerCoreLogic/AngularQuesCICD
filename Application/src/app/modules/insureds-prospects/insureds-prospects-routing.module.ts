import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsuredsProspectsMasterComponent } from './component/insureds-prospects-master/insureds-prospects-master.component';
import { GetInsuredsProspectsComponent } from './component/get-insureds-prospects/get-insureds-prospects.component';
import { InsuredDetailComponent } from './component/insured-detail/insured-detail.component';
import { Roles } from 'src/app/global-settings/roles';

const routes: Routes = [
  { path: '', component: InsuredsProspectsMasterComponent, children : [
    { path:'', component: GetInsuredsProspectsComponent, data: { roles: [Roles.Manager.roleCode,Roles.Supervisor.roleCode, Roles.Agent.roleCode, Roles.Underwriter.roleCode, Roles.UnderwriterAssistant.roleCode, Roles.UWManager.roleCode, Roles.UWSupervisior.roleCode] }  },
    {path:'insuredDetail', component: InsuredDetailComponent, data: { roles: [Roles.Manager.roleCode,Roles.Supervisor.roleCode, Roles.Agent.roleCode] } }
  ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuredsProspectsRoutingModule { }
