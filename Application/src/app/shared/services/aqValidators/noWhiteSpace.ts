import { UntypedFormControl } from '@angular/forms';

export function NoWhiteSpace(control: UntypedFormControl) {    
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };   
  }
 