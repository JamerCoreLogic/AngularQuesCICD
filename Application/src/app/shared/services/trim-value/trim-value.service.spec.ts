import { TestBed } from '@angular/core/testing';
import { TrimValueService } from './trim-value.service';

describe('TrimValueService', () => {
  let service: TrimValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrimValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should trim string values in an object', () => {
    const input = {
      name: ' John ',
      age: 30,
      city: ' New York ',
      isActive: true,
      description: '  Software Developer  '
    };

    const expected = {
      name: 'John',
      age: 30,
      city: 'New York',
      isActive: true,
      description: 'Software Developer'
    };

    const result = service.TrimObjectValue({ ...input });
    expect(result).toEqual(expected);
  });

  it('should handle empty object', () => {
    const input = {};
    const result = service.TrimObjectValue(input);
    expect(result).toEqual({});
  });

  it('should not modify non-string values', () => {
    const input = {
      number: 123,
      boolean: false,
      nullValue: null,
      undefinedValue: undefined,
      obj: { nested: ' value ' },
    };

    const result = service.TrimObjectValue({ ...input });
    expect(result).toEqual(input);
  });
});

