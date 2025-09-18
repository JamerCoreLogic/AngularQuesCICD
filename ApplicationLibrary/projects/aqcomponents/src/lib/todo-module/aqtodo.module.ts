import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AQTodoListComponent } from './aqtodo-list.component';



@NgModule({
  declarations: [AQTodoListComponent],
  imports: [
    CommonModule
  ],
  exports: [
    AQTodoListComponent
  ]
})

export class AQTodoModule { }
