import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPipesModule } from '../shared-material/shared-pipes.module';
import { FilterModule } from '@progress/kendo-angular-filter';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule, DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { FiltersComponent } from './filters/filters.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InputsModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { CustomViewComponent } from './custom-view/custom-view.component';
import { ViewEditorComponent } from './view-editor/view-editor.component';

@NgModule({
  declarations: [
    ReportComponent,
    FiltersComponent,
    CustomViewComponent,
    ViewEditorComponent,
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    SharedPipesModule,
    FormsModule,
    FilterModule,
    DropDownsModule,
    DatePickerModule,
    DragDropModule,
    InputsModule,
    TextBoxModule,
    DateInputsModule,
    FloatingLabelModule,

  ],
  providers:[DatePipe]
})
export class ReportModule { }
