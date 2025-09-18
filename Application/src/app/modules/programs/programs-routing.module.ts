import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramsMasterComponent } from './components/programs-master/programs-master.component';
import { ProgramListComponent } from './components/program-list/program-list.component';
import { Roles } from 'src/app/global-settings/roles';
import { AddAqProgramComponent } from './components/add-aq-program/add-aq-program.component';


const routes: Routes = [
  { path: '', component: ProgramsMasterComponent, children: [
    { path: '', redirectTo:'list', pathMatch:'full' },
    { path:'list', component: ProgramListComponent,  data: { roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] } },
    { path:'aqProgram', component: AddAqProgramComponent,  data: { roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] } }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramsRoutingModule { }
