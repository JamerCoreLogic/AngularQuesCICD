import { TestBed } from '@angular/core/testing';

import { AQRightsInfo } from './rights-info.service';

describe('RightsInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQRightsInfo = TestBed.get(AQRightsInfo);
    expect(service).toBeTruthy();
  });
});
