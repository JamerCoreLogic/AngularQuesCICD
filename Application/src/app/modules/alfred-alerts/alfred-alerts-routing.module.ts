import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlfredAlertsMasterComponent } from './components/alfred-alerts-master/alfred-alerts-master.component';


const routes: Routes = [
  { path: '', component: AlfredAlertsMasterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlfredAlertsRoutingModule { }
