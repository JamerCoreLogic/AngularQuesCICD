import { TestBed } from '@angular/core/testing';

import { AQParameterService } from './aqparameter.service';

describe('AQParameterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQParameterService = TestBed.get(AQParameterService);
    expect(service).toBeTruthy();
  });
});
