import { TestBed } from '@angular/core/testing';

import { AQRememberPassword } from './aqremember-password.service';

describe('AQRememberPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQRememberPassword = TestBed.get(AQRememberPassword);
    expect(service).toBeTruthy();
  });
});
