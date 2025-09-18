import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewComponent } from './data-view.component';
import { PaginationComponent } from './pagination.component';

import { FilterComponent } from './filter.component';
import { RowCountComponent } from './row-count.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuoteListViewComponent } from './quote-list-view.component';





@NgModule({
  declarations: [DataViewComponent, QuoteListViewComponent, PaginationComponent, FilterComponent, RowCountComponent],
  imports: [
    CommonModule,
    FormsModule   
  ],
  exports: [DataViewComponent]
})
export class AQDataViewModule { }
