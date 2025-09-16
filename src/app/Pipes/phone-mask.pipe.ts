import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneMask'
})
export class PhoneMaskPipe implements PipeTransform {
  transform(value: string): string {
    // Assuming the phone number format is "1234567890"
    if (value === null || value === '' || value.length !== 10 || !/^\d+$/.test(value)) {
      return ''; // Return an empty string if the input is null, empty, or doesn't meet the expected format
    }

    const maskedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    return maskedValue;
  }
}
