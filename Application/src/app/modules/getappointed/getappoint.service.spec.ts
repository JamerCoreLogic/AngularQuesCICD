import { TestBed } from '@angular/core/testing';

import { GetappointService } from './getappoint.service';

describe('GetappointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetappointService = TestBed.get(GetappointService);
    expect(service).toBeTruthy();
  });
});
