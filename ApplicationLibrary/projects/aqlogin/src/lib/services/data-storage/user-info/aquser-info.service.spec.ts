import { TestBed } from '@angular/core/testing';

import { AQUserInfo } from './aquser-info.service';

describe('AQUserInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQUserInfo = TestBed.get(AQUserInfo);
    expect(service).toBeTruthy();
  });
});
