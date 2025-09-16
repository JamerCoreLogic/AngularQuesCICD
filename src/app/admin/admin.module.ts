import { SharedMaterialModule } from './../shared-material/shared-material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoneMaskPipe } from '../Pipes/phone-mask.pipe';
import { ViewClientsComponent } from './Client/view-clients/view-clients.component';
import { AddClientsComponent } from './Client/add-clients/add-clients.component';
import { ViewAssignmentComponent } from './Assignment/view-assignment/view-assignment.component';
import { AddAssignmentComponent } from './Assignment/add-assignment/add-assignment.component';
import { ChangeAndResetPasswordComponent } from './change-and-reset-password/change-and-reset-password.component';
import { SharedPipesModule } from '../shared-material/shared-pipes.module';
import { AddUserTabsComponent } from './add-user-tabs/add-user-tabs.component';
import { BasicInfoComponent } from './add-user-tabs/basic-info/basic-info.component';
import { AdditionalInfoComponent } from './add-user-tabs/additional-info/additional-info.component';
import { InternalInfoComponent } from './add-user-tabs/internal-info/internal-info.component';
import { LiencesAndCertificationComponent } from './add-user-tabs/liences-and-certification/liences-and-certification.component';
import { FilterModule } from '@progress/kendo-angular-filter';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FiltersComponent } from './filters/filters.component';
import { DateInputsModule, DatePickerComponent, DatePickerModule, DateRangeModule } from '@progress/kendo-angular-dateinputs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FileTracInfoComponent } from './add-user-tabs/file-trac-info/file-trac-info.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { DeploymentInfoComponent } from './add-user-tabs/deployment-info/deployment-info.component';
import { CoreValuesComponent } from './add-user-tabs/core-values/core-values.component';
import { PreviewResponseComponent } from './add-user-tabs/preview-response/preview-response.component';
import { AuditTrailInfoComponent } from './add-user-tabs/audit-trail-info/audit-trail-info.component';
import { TasksComponent } from './Tasks/tasks/tasks.component';
import { TaskfilterComponent } from './taskFilter/taskfilter/taskfilter.component';
import { AttachmentsComponent } from './add-user-tabs/attachments/attachments.component';

// import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    AdminComponent,
    ViewClientsComponent,
    AddClientsComponent,
    ViewAssignmentComponent,
    AddAssignmentComponent,
    ChangeAndResetPasswordComponent,
    AddUserTabsComponent,
    BasicInfoComponent,
    AdditionalInfoComponent,
    InternalInfoComponent,
    LiencesAndCertificationComponent,
    FiltersComponent,
    FileTracInfoComponent,
    DeploymentInfoComponent,
    CoreValuesComponent,
    PreviewResponseComponent,
    AuditTrailInfoComponent,
    TasksComponent,
    TaskfilterComponent,
    AttachmentsComponent,
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    SharedPipesModule,
    FormsModule,
    FilterModule,
    DropDownsModule,
    DatePickerModule,
    DateRangeModule,
    FloatingLabelModule,
    ReactiveFormsModule,
    DragDropModule,
    ChartsModule,
    InputsModule,
    DateInputsModule,


  ],
  exports:[
    FiltersComponent,
  ],
  providers: [PhoneMaskPipe]
})
export class AdminModule { }