import { TestBed } from '@angular/core/testing';

import { ConvertQuoteResponseService } from './convert-quote-response.service';

describe('ConvertQuoteResponseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConvertQuoteResponseService = TestBed.get(ConvertQuoteResponseService);
    expect(service).toBeTruthy();
  });
});
