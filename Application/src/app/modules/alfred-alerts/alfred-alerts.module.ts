import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlfredAlertsRoutingModule } from './alfred-alerts-routing.module';
import { AlfredAlertsMasterComponent } from './components/alfred-alerts-master/alfred-alerts-master.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AlfredAlertsMasterComponent],
  imports: [
    CommonModule,
    SharedModule,
    AlfredAlertsRoutingModule
  ]
})
export class AlfredAlertsModule { }
