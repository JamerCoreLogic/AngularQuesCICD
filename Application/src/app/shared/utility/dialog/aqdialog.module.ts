import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AQDialogComponent } from './aqdialog.component';

@NgModule({
  declarations: [AQDialogComponent],
  imports: [
    CommonModule    
  ],
  exports : [
    AQDialogComponent
  ]
})
export class AQDialogModule { }
