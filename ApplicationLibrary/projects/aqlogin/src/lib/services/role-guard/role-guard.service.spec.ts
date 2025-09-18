import { TestBed } from '@angular/core/testing';

import { AQRoleGuard } from './role-guard.service';

describe('AQRoleGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQRoleGuard = TestBed.get(AQRoleGuard);
    expect(service).toBeTruthy();
  });
});
