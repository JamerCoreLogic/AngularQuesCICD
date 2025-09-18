import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Roles } from 'src/app/global-settings/roles';
import { ParametersComponent } from './components/parameters/parameters.component';
import { ParametersMasterComponent } from './components/parameters-master/parameters-master/parameters-master.component';


const routes: Routes = [
  { path: '', component: ParametersMasterComponent, children: [
    { path: '', redirectTo:'list', pathMatch:'full' },
    { path:'list', component: ParametersComponent,  data: { roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] } }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametersRoutingModule{ }
