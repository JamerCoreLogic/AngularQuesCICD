import { TestBed } from '@angular/core/testing';

import { AQSavePolicyService } from './aq-save-policy.service';

describe('AQSavePolicyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQSavePolicyService = TestBed.get(AQSavePolicyService);
    expect(service).toBeTruthy();
  });
});
