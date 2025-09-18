import { TestBed } from '@angular/core/testing';

import { AQLoginService } from './aqlogin.service';

describe('AQLoginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQLoginService = TestBed.get(AQLoginService);
    expect(service).toBeTruthy();
  });
});
