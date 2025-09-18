import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Roles } from 'src/app/global-settings/roles';
import { OtherScreenMasterComponent } from './component/other-screen-master/other-screen-master.component';
import { OtherScreenComponent } from './component/other-screen/other-screen.component';
import { ManageScreenComponent } from './component/manage-screen/manage-screen.component';
import { ParameterResolver } from './resolver/parameter-resolver'
//'./resolver/parameter-resolver';


const routes: Routes = [
  { path: '', component: OtherScreenMasterComponent, children: [
    { path: '', redirectTo:'list', pathMatch:'full' },
    { path:'list', component: OtherScreenComponent,  data: { roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] } },
    { path:'manage', component: ManageScreenComponent,resolve: { parameter: ParameterResolver },  data: { roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] } }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherScreensRoutingModule { }
