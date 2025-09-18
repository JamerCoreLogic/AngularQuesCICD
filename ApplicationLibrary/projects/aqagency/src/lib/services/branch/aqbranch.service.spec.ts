import { TestBed } from '@angular/core/testing';

import { AQBranchService } from './aqbranch.service';

describe('AQBranchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQBranchService = TestBed.get(AQBranchService);
    expect(service).toBeTruthy();
  });
});
