import { TestBed } from '@angular/core/testing';

import { AqkpiService } from './aqkpi.service';

describe('AqkpiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AqkpiService = TestBed.get(AqkpiService);
    expect(service).toBeTruthy();
  });
});
