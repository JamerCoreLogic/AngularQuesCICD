import { TestBed } from '@angular/core/testing';

import { AQLogoutService } from './aqlogout.service';

describe('AQLogoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQLogoutService = TestBed.get(AQLogoutService);
    expect(service).toBeTruthy();
  });
});
