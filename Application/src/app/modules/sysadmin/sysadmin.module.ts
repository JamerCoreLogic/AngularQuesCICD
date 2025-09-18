import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SysadminRoutingModule } from './sysadmin-routing.module';
import { SysdashboardComponent } from './component/sysdashboard/sysdashboard.component';


@NgModule({
  declarations: [SysdashboardComponent],
  imports: [
    CommonModule,
    SysadminRoutingModule
  ]
})
export class SysadminModule { }
