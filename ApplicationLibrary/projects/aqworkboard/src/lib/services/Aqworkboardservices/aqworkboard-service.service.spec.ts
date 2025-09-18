import { TestBed } from '@angular/core/testing';

import { AqworkboardServiceService } from './aqworkboard-service.service';

describe('AqworkboardServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AqworkboardServiceService = TestBed.get(AqworkboardServiceService);
    expect(service).toBeTruthy();
  });
});
