import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule)
  },
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