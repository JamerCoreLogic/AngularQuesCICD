import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestUserRoutingModule } from './guest-user-routing.module';
import { GuestuserComponent } from './component/guestuser/guestuser.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AQComponentsModule, AQDataViewModule, AqMultiselectModule, AQTodoModule } from '@agenciiq/components';
import { QuotesModule } from '../quotes/quotes.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GuestuserMasterComponent } from './component/guestuser-master/guestuser-master.component';


@NgModule({
  declarations: [GuestuserComponent, GuestuserMasterComponent],
  imports: [
    CommonModule,
    GuestUserRoutingModule,
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
    GuestuserMasterComponent,
    GuestuserComponent
  ]
})
export class GuestUserModule { }
