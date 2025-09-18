import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { UnauthorizedComponent } from './core/components/unauthorized/unauthorized.component';
import { LoginComponent } from './core/components/login/login.component';
import { MGAConfigResolver } from './core/services/mga-config-resolver.service';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule),
    canActivate: [MsalGuard]
  },
  // {
  //   path: 'app',
  //   loadChildren: () => import('./core/core.module').then(m => m.CoreModule),
  //   canActivate: [MsalGuard] // Protected feature routes
  // },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

//export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' });
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }