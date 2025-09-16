import { PhoneMaskDirective } from './phone-mask.directive';
import { NgControl } from '@angular/forms';

describe('PhoneMaskDirective', () => {
  let mockNgControl: Partial<NgControl>;
  let directive: PhoneMaskDirective;

  beforeEach(() => {
    mockNgControl = {
      valueAccessor: {
        writeValue: jasmine.createSpy('writeValue'),
        registerOnChange: jasmine.createSpy('registerOnChange'),
        registerOnTouched: jasmine.createSpy('registerOnTouched'),
      },
    };
    directive = new PhoneMaskDirective(mockNgControl as NgControl);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('onModelChange', () => {
    it('should call onInputChange with correct parameters', () => {
      spyOn(directive, 'onInputChange');
      directive.onModelChange('1234567890');
      expect(directive.onInputChange).toHaveBeenCalledWith('1234567890', false);
    });
  });

  describe('keydownBackspace', () => {
    it('should call onInputChange with correct parameters', () => {
      spyOn(directive, 'onInputChange');
      const event = { target: { value: '1234567890' } };
      directive.keydownBackspace(event);
      expect(directive.onInputChange).toHaveBeenCalledWith('1234567890', true);
    });
  });

  describe('onInputChange', () => {
    it('should handle empty input', () => {
     
    });

    it('should handle null input', () => {
      directive.onInputChange(null as any, false);
      expect(mockNgControl.valueAccessor!.writeValue).not.toHaveBeenCalled();
    });

    it('should format input with 1-3 digits', () => {
      directive.onInputChange('123', false);
      expect(mockNgControl.valueAccessor!.writeValue).toHaveBeenCalledWith('(123)');
    });

    it('should format input with 4-6 digits', () => {
      directive.onInputChange('123456', false);
      expect(mockNgControl.valueAccessor!.writeValue).toHaveBeenCalledWith('(123) 456');
    });

    it('should format input with 7-10 digits', () => {
      directive.onInputChange('1234567890', false);
      expect(mockNgControl.valueAccessor!.writeValue).toHaveBeenCalledWith('(123) 456-7890');
    });

    it('should truncate input longer than 10 digits', () => {
      directive.onInputChange('12345678901', false);
      expect(mockNgControl.valueAccessor!.writeValue).toHaveBeenCalledWith('(123) 456-7890');
    });

    it('should remove non-digit characters', () => {
      directive.onInputChange('abc123def456ghi7890', false);
      expect(mockNgControl.valueAccessor!.writeValue).toHaveBeenCalledWith('(123) 456-7890');
    });

    describe('backspace handling', () => {
      it('should remove last digit when length <= 6', () => {
        directive.onInputChange('123456', true);
        expect(mockNgControl.valueAccessor!.writeValue).toHaveBeenCalledWith('(123) 45');
      });

      it('should not remove digit when length > 6', () => {
        directive.onInputChange('1234567', true);
        expect(mockNgControl.valueAccessor!.writeValue).toHaveBeenCalledWith('(123) 456-7');
      });
    });

    it('should handle null valueAccessor', () => {
      mockNgControl.valueAccessor = null;
      directive.onInputChange('1234567890', false);
      // Should not throw error
      expect().nothing();
    });
  });
});
