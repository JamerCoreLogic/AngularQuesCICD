import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuoteViewComponent } from './quote-view.component';
import { PaginationComponent } from './pagination.component';
import { RowCountComponent } from './row-count.component';


@NgModule({
  declarations: [QuoteViewComponent, PaginationComponent, RowCountComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [QuoteViewComponent]
})
export class QuoteViewModule { }
