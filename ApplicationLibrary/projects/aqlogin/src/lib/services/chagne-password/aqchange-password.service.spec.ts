import { TestBed } from '@angular/core/testing';

import { AQChangePasswordService  } from './aqchange-password.service';

describe('AQChangePasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQChangePasswordService = TestBed.get(AQChangePasswordService);
    expect(service).toBeTruthy();
  });
});
