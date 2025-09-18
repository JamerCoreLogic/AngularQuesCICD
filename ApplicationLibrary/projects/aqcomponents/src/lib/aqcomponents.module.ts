import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AQStateAutoCompleteComponent } from './aqstate-auto-complete/aqstate-auto-complete.component';


@NgModule({
  declarations: [AQStateAutoCompleteComponent],
  imports: [ 
    CommonModule
  ],
  exports: []
})
export class AQComponentsModule { }
