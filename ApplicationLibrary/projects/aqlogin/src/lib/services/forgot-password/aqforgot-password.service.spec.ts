import { TestBed } from '@angular/core/testing';

import { AQForgotPasswordService } from './aqforgot-password.service';

describe('AQForgotPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQForgotPasswordService = TestBed.get(AQForgotPasswordService);
    expect(service).toBeTruthy();
  });
});
