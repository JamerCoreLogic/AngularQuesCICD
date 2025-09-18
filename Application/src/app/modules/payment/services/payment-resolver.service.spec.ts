import { TestBed } from '@angular/core/testing';

import { PaymentResolverService } from './payment-resolver.service';

describe('PaymentResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentResolverService = TestBed.get(PaymentResolverService);
    expect(service).toBeTruthy();
  });
});
