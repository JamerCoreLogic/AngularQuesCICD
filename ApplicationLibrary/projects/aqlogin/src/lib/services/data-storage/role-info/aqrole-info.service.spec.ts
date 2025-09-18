import { TestBed } from '@angular/core/testing';

import { AQRoleInfo } from './aqrole-info.service';

describe('AQRoleInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQRoleInfo = TestBed.get(AQRoleInfo);
    expect(service).toBeTruthy();
  });
});
