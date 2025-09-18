import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Roles } from 'src/app/global-settings/roles';
import { LOBListResolver } from '../aqforms/resolver/lob-list-resolver';
import { MGAProgramResolver } from '../aqforms/resolver/mga-program-resolver';
import { ParameterResolver } from '../aqforms/resolver/parameter-resolver';
import { GetappointedComponent } from './component/getappointed/getappointed.component';



const routes: Routes = [
  {
    path: '', component: GetappointedComponent, 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetAppointedRoutingModule { }
