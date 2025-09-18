import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GetAppointedRoutingModule } from './get-appointed-routing.module';
import { GetappointedComponent } from './component/getappointed/getappointed.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AQComponentsModule, AQDataViewModule, AqMultiselectModule, AQTodoModule } from '@agenciiq/components';
import { QuotesModule } from '../quotes/quotes.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [GetappointedComponent],
  imports: [
    CommonModule,
    GetAppointedRoutingModule,
    SharedModule,
    AQComponentsModule, 
    AqMultiselectModule,  
    AQDataViewModule,  
    AQTodoModule,  
    QuotesModule,        
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    GetappointedComponent
  ]
})
export class GetAppointedModule { }
