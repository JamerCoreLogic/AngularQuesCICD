import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateFormate } from '../contraints/date.format';

@Pipe({
    name: 'aqDateFormat',
    standalone: false
})

export class AQDateFormatPipe extends DatePipe implements PipeTransform {

  
  transform(value: any, format: string = DateFormate.DATE_FMT): any {
    return super.transform(value, format);
  }

}
