import { NgModule } from '@angular/core';
import { AqchatboardComponent } from './aqchatboard.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';
import { AutoFocusDirective } from './auto-focus.directive';



@NgModule({
  declarations: [AqchatboardComponent , ScrollToBottomDirective, AutoFocusDirective],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [AqchatboardComponent]
})
export class AqchatboardModule { }
