import { TestBed, async, inject } from '@angular/core/testing';

import { AQRouteGuard } from './aqroute.guard';

describe('AQRouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AQRouteGuard]
    });
  });

  it('should ...', inject([AQRouteGuard], (guard: AQRouteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
