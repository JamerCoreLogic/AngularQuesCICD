import { TestBed } from '@angular/core/testing';

import { AQHttpInterceptorService } from './aqhttp-interceptor.service';

describe('AQHttpInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQHttpInterceptorService = TestBed.get(AQHttpInterceptorService);
    expect(service).toBeTruthy();
  });
});
