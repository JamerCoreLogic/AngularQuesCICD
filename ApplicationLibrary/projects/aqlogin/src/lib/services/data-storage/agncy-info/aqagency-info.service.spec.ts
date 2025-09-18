import { TestBed } from '@angular/core/testing';

import { AQAgencyInfo } from './aqagency-info.service';

describe('AQAgencyInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQAgencyInfo = TestBed.get(AQAgencyInfo);
    expect(service).toBeTruthy();
  });
});
