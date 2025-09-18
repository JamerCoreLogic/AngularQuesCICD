import { PhoneValidationService } from './phone-validation.service';
import { FormControl } from '@angular/forms';

describe('PhoneValidationService', () => {
    let service: PhoneValidationService;

    beforeEach(() => {
        service = new PhoneValidationService();
    });

    it('should return null for valid phone number', () => {
        const control = new FormControl('(123) 456-7890');
        const result = service.validatePhone(control);
        expect(result).toBeNull();
    });

    it('should return error for phone number without parentheses', () => {
        const control = new FormControl('123-456-7890');
        const result = service.validatePhone(control);
        expect(result).toEqual({ 'atleast 10 digits': true });
    });

    it('should return error for phone number starting with 0', () => {
        const control = new FormControl('(012) 456-7890');
        const result = service.validatePhone(control);
        expect(result).toEqual({ 'atleast 10 digits': true });
    });

    it('should return error for phone number with less than 10 digits', () => {
        const control = new FormControl('(123) 456-789');
        const result = service.validatePhone(control);
        expect(result).toEqual({ 'atleast 10 digits': true });
    });

    it('should return error for empty phone number', () => {
        const control = new FormControl('');
        const result = service.validatePhone(control);
        expect(result).toEqual({ 'atleast 10 digits': true });
    });
});
