import { TestBed } from '@angular/core/testing';

import { AqchatboardService } from './aqchatboard.service';

describe('AqchatboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AqchatboardService = TestBed.get(AqchatboardService);
    expect(service).toBeTruthy();
  });
});
