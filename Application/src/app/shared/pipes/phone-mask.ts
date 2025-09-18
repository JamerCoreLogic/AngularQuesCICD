import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'PhoneMask',
    standalone: false
})

export class AQPhoneMaskPipe  implements PipeTransform {
  
  transform(value: any): any {
    if(value){
      return value.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    }
   
  }

}
