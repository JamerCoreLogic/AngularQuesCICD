import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessTransferMasterComponent } from './component/business-transfer-master/business-transfer-master.component';
import { Roles } from 'src/app/global-settings/roles';



const routes: Routes = [
  {
    path: '', component: BusinessTransferMasterComponent, data: { roles: [Roles.AgencyAdmin.roleCode, Roles.Manager.roleCode,  Roles.Supervisor.roleCode] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessTransferRoutingModule { }
