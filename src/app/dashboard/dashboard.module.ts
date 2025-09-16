import { DashboardComponent } from './dashboard.component';
import { SharedMaterialModule } from './../shared-material/shared-material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { DescriptionComponent } from './description/description.component';
import {ChartModule} from 'primeng/chart';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { GraphComponent } from './graph/graph.component';
import { SharedPipesModule } from '../shared-material/shared-pipes.module';
import { ViewRequestComponent } from './view-request/view-request.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';





@NgModule({
  declarations: [
    DescriptionComponent,
    DashboardComponent,
    GraphComponent,
    ViewRequestComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedMaterialModule,
    ChartModule,
    ChartsModule,
    SharedPipesModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class DashboardModule { }
