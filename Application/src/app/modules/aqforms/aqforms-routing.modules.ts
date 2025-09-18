import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Roles } from 'src/app/global-settings/roles';
import { AQFormsMasterComponent } from './component/aqforms-master/aqforms-master.component';
import { AQFormsListComponent } from './component/aqformlist/aqformslist.component';
import { AQManageFormsComponent } from './component/manage-forms/manage-forms.component';
import { LOBListResolver } from './resolver/lob-list-resolver';
import { MGAProgramResolver } from './resolver/mga-program-resolver';
import { ParameterResolver } from './resolver/parameter-resolver';
import { AqformtypeComponent } from './component/aqformtype/aqformtype.component';

const routes: Routes = [
  {
    path: '', component: AQFormsMasterComponent, children: [
      { path: '', redirectTo: 'aqformlist', pathMatch: 'full' },
      { path: 'list', component: AQFormsListComponent, data: { roles: [Roles.SystemAdmin.roleCode, Roles.MGAAdmin.roleCode] }, resolve:{ mgaPrograms: MGAProgramResolver, parameter: ParameterResolver } },
      { path: 'manage', component: AQManageFormsComponent, resolve: { lobList: LOBListResolver, mgaPrograms: MGAProgramResolver, parameter: ParameterResolver }, data: { roles: [Roles.SystemAdmin.roleCode, Roles.MGAAdmin.roleCode] } },
      { path: 'aqformlist', component: AqformtypeComponent, data: { roles: [Roles.SystemAdmin.roleCode, Roles.MGAAdmin.roleCode] }, resolve:{ mgaPrograms: MGAProgramResolver, parameter: ParameterResolver } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AQFormRoutingModule { }
