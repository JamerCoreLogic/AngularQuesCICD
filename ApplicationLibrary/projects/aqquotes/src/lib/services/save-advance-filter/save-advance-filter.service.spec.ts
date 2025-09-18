import { TestBed } from '@angular/core/testing';

import { AQSaveAdvanceFilterService } from './save-advance-filter.service';

describe('SaveAdvanceFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQSaveAdvanceFilterService = TestBed.get(AQSaveAdvanceFilterService);
    expect(service).toBeTruthy();
  });
});
