import { TestBed } from '@angular/core/testing';

import { InsuredsProspectsService } from './insureds-prospects.service';

describe('InsuredsProspectsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InsuredsProspectsService = TestBed.get(InsuredsProspectsService);
    expect(service).toBeTruthy();
  });
});
