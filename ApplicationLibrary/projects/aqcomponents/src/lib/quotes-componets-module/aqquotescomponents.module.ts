import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotesListComponent } from './quotes-list.component';
import { AQDataViewModule } from '../data-view-module/data-view.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TextFocusDirective } from './text-focus.directive';



@NgModule({
  declarations: [QuotesListComponent , TextFocusDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    AQDataViewModule
  ],
  exports : [QuotesListComponent]
})
export class AQQuotesComponentModule { }
