import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgencylistComponent } from './component/agencylist/agencylist.component';
import { AgencyMasterComponent } from './component/agency-master/agency-master.component';
import { AgencyComponent } from './component/agency/agency.component';
import { BranchComponent } from './component/branch/branch.component';
import { Roles } from 'src/app/global-settings/roles';
import { AQRoleGuard } from '@agenciiq/login';


const routes: Routes = [
  {
    path: '', component: AgencyMasterComponent, children: [
      { path: '', component: AgencylistComponent, data: { roles: [Roles.AgencyAdmin.roleCode, Roles.MGAAdmin.roleCode] } },
      { path: 'addagency', component: AgencyComponent, data: { roles: [Roles.AgencyAdmin.roleCode, Roles.MGAAdmin.roleCode] } },
      { path: 'addbranch', component: BranchComponent, data: { roles: [Roles.AgencyAdmin.roleCode, Roles.MGAAdmin.roleCode] } }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyAdminRoutingModule { }
