import { RegisterTabsModule } from './register-tabs/register-tabs.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { RoleGuardGuard } from './guard/role-guard.guard'
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MaintenanceGuard } from './guard/maintenance.guard';



const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginModule),
  },
  { path: 'forgot-password', loadChildren: () => import('./auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
  { path: 'change-pass', loadChildren: () => import('./auth/confirm-otp/confirm-otp.module').then(m => m.ConfirmOtpModule) },
  { path: 'communication', loadChildren: () => import('./communication-response/communication-response.module').then(m => m.CommunicationResponseModule) },

  {
    path: 'main',
    component: MainLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        // canActivate:[RoleGuardGuard],
        data: { roles: ['Admin', 'Super Admin', 'Standard', 'Adjuster'] }
      },

      {
        path: 'find-adjuster', loadChildren: () => import('./find-adjuster/find-adjuster.module').then(m => m.FindAdjusterModule),
        // canActivate: [RoleGuardGuard],
        data: { roles: ['Admin', 'Super Admin', 'Standard', 'Adjuster'] }
      },

      {
        path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        // canActivate: [RoleGuardGuard],
        data: { roles: ['Admin', 'Super Admin', 'Standard', 'Adjuster'] }
      },


      { path: 'change-password', loadChildren: () => import('./auth/change-password/change-password.module').then(m => m.ChangePasswordModule) },
      
     { path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule) },
          
     { path: 'survey', loadChildren: () => import('./survey-dashboard/survey-dashboard.module').then(m => m.SurveyDashboardModule) },

     { path: 'initiatesurvey', loadChildren: () => import('./initiate-survey/initiate-survey.module').then(m => m.InitiateSurveyModule) },

     { path: 'explorer', loadChildren: () => import('./explorer/explorer.module').then(m => m.ExplorerModule) },

     { path: 'loss-map', loadChildren: () => import('./loss-map/loss-map.module').then(m => m.LossMapModule) },

     { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },


    ]
  },
  { path: 'register', loadChildren: () => import('./register-tabs/register-tabs.module').then(m => m.RegisterTabsModule) },
  
  {path: 'maintenance', component:MaintenanceComponent,
    canActivate: [MaintenanceGuard] 
  },

  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuardService]
})
export class AppRoutingModule { }
