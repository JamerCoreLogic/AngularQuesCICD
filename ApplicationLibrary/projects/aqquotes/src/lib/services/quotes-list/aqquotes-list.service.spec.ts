import { TestBed } from '@angular/core/testing';

import { AQQuotesListService } from './aqquotes-list.service';

describe('AQQuotesListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQQuotesListService = TestBed.get(AQQuotesListService);
    expect(service).toBeTruthy();
  });
});
