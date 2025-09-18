import { TestBed } from '@angular/core/testing';

import { QuotesDetails } from './quotes-details.service';

describe('QuotesDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuotesDetails = TestBed.get(QuotesDetails);
    expect(service).toBeTruthy();
  });
});
