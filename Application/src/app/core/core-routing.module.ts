import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CoreDashboardComponent } from './components/core-dashboard/core-dashboard.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { GuestuserComponent } from 'src/app/modules/guest-user/component/guestuser/guestuser.component'
import { DashboardMasterComponent } from './components/dashboard-master/dashboard-master.component';
import { AQRouteGuard, AQRoleGuard } from '@agenciiq/login';
import { Roles } from '../global-settings/roles';
import { MGAConfigResolver } from './services/mga-config-resolver.service';
import { GuestuserMasterComponent } from '../modules/guest-user/component/guestuser-master/guestuser-master.component';


const routes: Routes = [
  { path: '', component: LoginComponent, resolve: { mgaConfigResolver: MGAConfigResolver } },
  { path: 'resetpassword', component: ResetPasswordComponent, canActivate: [AQRouteGuard] },
  
  {
    path: 'guest-user',
    loadChildren: () => import('../modules/guest-user/guest-user.module').then(m => m.GuestUserModule)
  },
  {
    path: 'get-appointed',
    loadChildren: () => import('../modules/getappointed/get-appointed.module').then(m => m.GetAppointedModule)
  },
  {
    path: 'submit-business',
    loadChildren: () => import('../modules/getappointed/get-appointed.module').then(m => m.GetAppointedModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('../modules/payment/payment.module').then(m => m.PaymentModule),
    data: {},
    canActivateChild: [AQRouteGuard]
  },
  {
    path: "agenciiq", component: DashboardMasterComponent, canActivate: [AQRouteGuard], children: [
      { path: '', component: CoreDashboardComponent },
      { path: 'changepassword', component: ChangePasswordComponent, canActivate: [AQRouteGuard] },
      {
        path: 'workbook',
        loadChildren: () => import('../modules/quotes/quotes.module').then(m => m.QuotesModule),
        data: { roles: [Roles.Agent.roleCode, Roles.Manager.roleCode, Roles.Supervisor.roleCode] },
        canActivateChild: [AQRouteGuard]
      },
      {
        path: 'agencies',
        loadChildren: () => import('../modules/agency/agency-admin.module').then(m => m.AgencyAdminModule),
        data: { roles: [Roles.MGAAdmin.roleCode, Roles.AgencyAdmin.roleCode] },
        canActivateChild: [AQRouteGuard, AQRoleGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('../modules/agents/agents.module').then(m => m.AgentsModule),
        data: { roles: [Roles.AgencyAdmin.roleCode, Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] },
        canActivateChild: [AQRouteGuard, AQRoleGuard]
      },
      {
        path: 'accounts',
        loadChildren: () => import('../modules/accounts/accounts.module').then(m => m.AccountsModule),
        data: {
          roles: [Roles.AgencyAdmin.roleCode, Roles.MGAAdmin.roleCode, Roles.Agent.roleCode,
          Roles.Manager.roleCode, Roles.Supervisor.roleCode, Roles.SystemAdmin.roleCode,
          Roles.Underwriter.roleCode, Roles.UnderwriterAssistant.roleCode, Roles.UWManager.roleCode, Roles.UWSupervisior.roleCode]
        },
        canActivateChild: [AQRouteGuard, AQRoleGuard]
      },
      {
        path: 'businesstransfer',
        loadChildren: () => import('../modules/businesstransfer/business-transfer.module').then(m => m.BusinessTransferModule),
        data: { roles: [Roles.AgencyAdmin.roleCode, Roles.Supervisor.roleCode, Roles.Manager.roleCode] },
        canActivateChild: [AQRouteGuard, AQRoleGuard]
      },
      {
        path: 'mga',
        loadChildren: () => import('../modules/mga/mga.module').then(m => m.MgaModule),
        data: { roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] },
        canActivateChild: [AQRouteGuard, AQRoleGuard]
      },
      {
        path: 'programs',
        loadChildren: () => import('../modules/programs/programs.module').then(m => m.ProgramsModule),
        data: { roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] },
        canActivateChild: [AQRouteGuard, AQRoleGuard]
      },
      {
        path: 'parameters',
        loadChildren: () => import('../modules/parameters/parameters.module').then(m => m.ParametersModule),
        data: { roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] },
        canActivateChild: [AQRouteGuard, AQRoleGuard]
      },
      {
        path: 'alfred-alerts',
        loadChildren: () => import('../modules/alfred-alerts/alfred-alerts.module').then(m => m.AlfredAlertsModule),
        data: { roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] },
        canActivateChild: [AQRouteGuard, AQRoleGuard]
      },
      {
        path: 'aqforms',
        loadChildren: () => import('../modules/aqforms/aqforms.module').then(m => m.AQFormsModule),
        data: { roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] },
        canActivateChild: [AQRouteGuard, AQRoleGuard]
      },
      {
        path: 'insureds-prospects',
        loadChildren: () => import('../modules/insureds-prospects/insureds-prospects.module').then(m => m.InsuredsProspectsModule),
        data: {
          roles: [Roles.Manager.roleCode, Roles.Supervisor.roleCode, Roles.Agent.roleCode,
          Roles.Underwriter.roleCode, Roles.UnderwriterAssistant.roleCode, Roles.UWManager.roleCode,
          Roles.UWSupervisior.roleCode]
        },
        canActivateChild: [AQRouteGuard, AQRoleGuard]
      },
      {
        path: 'other-screens',
        loadChildren: () => import('../modules/other-screens/other-screens.module').then(m => m.OtherScreensModule),
        data: { roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode] },
        canActivateChild: [AQRouteGuard, AQRoleGuard]
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
