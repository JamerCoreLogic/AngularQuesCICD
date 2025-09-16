import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export function dateFormatValidator(control: AbstractControl): ValidationErrors | null {
  const date: string = control.value;
  const isValid: boolean = moment(date, 'MM/DD/YYYY', true).isValid();
  return isValid ? null : { 'invalidDateFormat': 'The date format is invalid. Should be MM/DD/YYYY' };
}

export function pastDateValidator(control: AbstractControl): ValidationErrors | null {
  const date = moment(control.value, 'MM/DD/YYYY', true);
  const today = moment();
  return date.isBefore(today) ? null : { 'futureDate': 'The date should be in the past' };
}
export function futurDateValidator(control: AbstractControl): ValidationErrors | null {
  const date = moment(control.value, 'MM-DD-YYYY', true);
  const today = moment().startOf('day'); // Set to start of today to ignore time
  return date.isAfter(today) ? null : { 'futureDate': 'The date must be a future date!' };
}

export function dateRangeValidator(minDate: Date, maxDate: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlDate: Date = new Date(control.value);
    if (controlDate < minDate || controlDate > maxDate) {
      return { 'dateRange': `The date should be between ${minDate} and ${maxDate}` };
    }
    return null;
  };
}
// export function futureDateValidator(): ValidatorFn {
//   return (control: AbstractControl): {[key: string]: any} | null => {
//     const inputDate = new Date(control.value);
//     const today = new Date();
//     // Remove time parts for comparison
//     today.setHours(0, 0, 0, 0);
//     return inputDate <= today ? { 'futureDate': { value: control.value } } : null;
//   };
// }
