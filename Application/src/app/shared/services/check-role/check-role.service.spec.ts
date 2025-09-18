import { TestBed } from '@angular/core/testing';

import { CheckRoleService } from './check-role.service';

describe('CheckRoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckRoleService = TestBed.get(CheckRoleService);
    expect(service).toBeTruthy();
  });
});
