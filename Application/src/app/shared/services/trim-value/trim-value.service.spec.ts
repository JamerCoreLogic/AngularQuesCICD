import { TestBed } from '@angular/core/testing';

import { TrimValueService } from './trim-value.service';

describe('TrimValueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrimValueService = TestBed.get(TrimValueService);
    expect(service).toBeTruthy();
  });
});
