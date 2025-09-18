import { AbstractControl } from '@angular/forms';

export class PhoneValidationService{


    validatePhone(control: AbstractControl): { [key: string]: boolean } | null {

        let pattern = /^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/;
    
        if (!pattern.test(control.value)) {
          return { 'atleast 10 digits': true };
        }
    
    
        return null;
      }

}