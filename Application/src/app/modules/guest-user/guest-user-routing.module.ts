import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Roles } from 'src/app/global-settings/roles';
import { LOBListResolver } from '../aqforms/resolver/lob-list-resolver';
import { MGAProgramResolver } from '../aqforms/resolver/mga-program-resolver';
import { ParameterResolver } from '../aqforms/resolver/parameter-resolver';
import { GuestuserMasterComponent } from './component/guestuser-master/guestuser-master.component';
import { GuestuserComponent } from './component/guestuser/guestuser.component';


const routes: Routes = [
  {
    path: '', component: GuestuserMasterComponent, children: [
      { path: '', component: GuestuserComponent, }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestUserRoutingModule { }
