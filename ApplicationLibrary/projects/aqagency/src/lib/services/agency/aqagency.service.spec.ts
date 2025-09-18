import { TestBed } from '@angular/core/testing';

import { AQAgencyService } from './aqagency.service';

describe('AQAgencyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQAgencyService = TestBed.get(AQAgencyService);
    expect(service).toBeTruthy();
  });
});
