import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AqMultiselectComponent } from './aq-multiselect.component';

@NgModule({
  declarations: [AqMultiselectComponent],
  imports: [
    CommonModule
  ],
  exports:[AqMultiselectComponent]
})
export class AqMultiselectModule { }
