import { NgModule } from '@angular/core';
import { PhoneMaskPipe } from '../Pipes/phone-mask.pipe';
import { TruncatePipe } from '../Pipes/truncate.pipe';
import { PhoneMaskDirective } from '../directives/phone-mask.directive';

@NgModule({
  declarations: [PhoneMaskPipe,
    TruncatePipe,
    PhoneMaskDirective],
  exports: [PhoneMaskPipe,
    TruncatePipe,
    PhoneMaskDirective]
})
export class SharedPipesModule { }
