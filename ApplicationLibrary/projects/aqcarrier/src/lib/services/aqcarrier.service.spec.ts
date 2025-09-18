import { TestBed } from '@angular/core/testing';

import { AQCarrierService } from './aqcarrier.service';

describe('AQCarrierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQCarrierService = TestBed.get(AQCarrierService);
    expect(service).toBeTruthy();
  });
});
