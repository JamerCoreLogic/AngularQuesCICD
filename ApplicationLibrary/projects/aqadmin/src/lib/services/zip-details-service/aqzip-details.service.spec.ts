import { TestBed } from '@angular/core/testing';

import { AQZipDetailsService } from './aqzip-details.service';

describe('AQZipDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQZipDetailsService = TestBed.get(AQZipDetailsService);
    expect(service).toBeTruthy();
  });
});
