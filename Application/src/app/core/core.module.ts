import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CoreDashboardComponent } from './components/core-dashboard/core-dashboard.component';
import { SystemAdminDashboardComponent } from './components/system-admin-dashboard/system-admin-dashboard.component';
import { MgaDashboardComponent } from './components/mga-dashboard/mga-dashboard.component';
import { AgencyDashboardComponent } from './components/agency-dashboard/agency-dashboard.component';
import { AgentDashboardComponent } from './components/agent-dashboard/agent-dashboard.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardMasterComponent } from './components/dashboard-master/dashboard-master.component';
import { AqchatboardModule } from '@agenciiq/aqchatboard';



@NgModule({
  declarations: [
    LoginComponent,
    CoreDashboardComponent,
    SystemAdminDashboardComponent,
    MgaDashboardComponent,
    AgencyDashboardComponent,
    AgentDashboardComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    DashboardMasterComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule,
    SharedModule,
    AqchatboardModule,
  ],
  providers: [

  ]
})
export class CoreModule { }
