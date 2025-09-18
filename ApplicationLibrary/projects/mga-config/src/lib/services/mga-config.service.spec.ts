import { TestBed } from '@angular/core/testing';

import { MgaConfigService } from './mga-config.service';

describe('MgaConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MgaConfigService = TestBed.get(MgaConfigService);
    expect(service).toBeTruthy();
  });
});
