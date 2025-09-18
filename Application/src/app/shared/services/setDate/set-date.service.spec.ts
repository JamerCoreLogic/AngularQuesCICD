import { TestBed } from '@angular/core/testing';
import { SetDateService } from './set-date.service';

describe('SetDateService', () => {
  let service: SetDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct UTC date ignoring time zone', () => {
    const inputDate = '2023-06-01T10:30:00Z';
    const result = service.setDate(inputDate);
    const expected = new Date(Date.UTC(2023, 5, 1));

    expect(result.getUTCFullYear()).toBe(expected.getUTCFullYear());
    expect(result.getUTCMonth()).toBe(expected.getUTCMonth());
    expect(result.getUTCDate()).toBe(expected.getUTCDate());
  });

  it('should handle invalid date input gracefully', () => {
    const invalidInput = 'invalid-date';
    const result = service.setDate(invalidInput);
    expect(result instanceof Date).toBeTrue();
    expect(isNaN(result.getTime())).toBeTrue();
  });
});
