import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AQFormsMasterComponent } from './component/aqforms-master/aqforms-master.component';

import { AQFormRoutingModule } from './aqforms-routing.modules';
import { AQFormsListComponent } from './component/aqformlist/aqformslist.component';
import { AQDataViewModule } from '@agenciiq/components';
import { AQManageFormsComponent } from './component/manage-forms/manage-forms.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AqformtypeComponent } from './component/aqformtype/aqformtype.component';




@NgModule({
  declarations: [AQFormsListComponent, AQFormsMasterComponent, AQManageFormsComponent, AqformtypeComponent],
  imports: [
    CommonModule,
    SharedModule,
    AccordionModule.forRoot(),
    FormsModule,
    AQFormRoutingModule,
    AQDataViewModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
           
  ]  
  
})
export class AQFormsModule { }
