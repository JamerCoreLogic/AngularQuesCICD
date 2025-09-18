import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MgaMasterComponent } from './component/mga-master/mga-master.component';
import { MgaConfigurationComponent } from './component/mga-configuration/mga-configuration.component';
import { Roles } from 'src/app/global-settings/roles';


const routes: Routes = [ 
  { path: '', component: MgaMasterComponent, children: [
      { path: '', redirectTo: 'configuration', pathMatch: 'full' },
      { path: 'configuration', component: MgaConfigurationComponent,  data: { roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] }, }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MgaRoutingModule { }
