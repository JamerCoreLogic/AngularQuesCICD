import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SurveyDashboardRoutingModule } from './survey-dashboard-routing.module';
import { SurveyDashboardComponent } from './survey-dashboard.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { ChartModule, ChartsModule } from '@progress/kendo-angular-charts';
import { SharedPipesModule } from '../shared-material/shared-pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphComponent } from './graph/graph.component';
import { DescriptionComponent } from './description/description.component';
import { PreviewResponcComponent } from './preview-responc/preview-responc.component';
import { SurveySentListComponent } from './survey-sent-list/survey-sent-list.component';
import { SurveyResponceGridComponent } from './survey-responce-grid/survey-responce-grid.component';
import { FilterModule } from '@progress/kendo-angular-filter';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule, DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InputsModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { ExcelModule, GridModule } from '@progress/kendo-angular-grid';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomViewDialogComponent } from './custom-view-dialog/custom-view-dialog.component';
import { DragDropModule as AngularCdkDragDropModule } from '@angular/cdk/drag-drop';
import { GridEdgeAutoScrollDirective } from './directives/grid-edge-auto-scroll.directive';



@NgModule({
  declarations: [
    SurveyDashboardComponent,
    GraphComponent,
    DescriptionComponent,
    PreviewResponcComponent,
    SurveyResponceGridComponent,
    CustomViewDialogComponent,
    SurveySentListComponent,
    GridEdgeAutoScrollDirective,
  ],
  imports: [
    CommonModule,
    SurveyDashboardRoutingModule,
    SharedMaterialModule,
    ChartModule,
    ChartsModule,
    SharedPipesModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    FilterModule,
    DropDownsModule,
    DatePickerModule,
    DragDropModule,
    InputsModule,
    TextBoxModule,
    DateInputsModule,
    FloatingLabelModule,
    ExcelModule,
    MatDialogModule,
    AngularCdkDragDropModule,
],
   providers:[DatePipe]
})
export class SurveyDashboardModule { }
