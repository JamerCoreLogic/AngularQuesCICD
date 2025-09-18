import { TestBed } from '@angular/core/testing';

import { AQResetPasswordService } from './aqreset-password.service';

describe('AQResetPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQResetPasswordService = TestBed.get(AQResetPasswordService);
    expect(service).toBeTruthy();
  });
});
