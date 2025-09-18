import { TestBed } from '@angular/core/testing';

import { CheckSupervisorService } from './check-supervisor.service';

describe('CheckSupervisorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckSupervisorService = TestBed.get(CheckSupervisorService);
    expect(service).toBeTruthy();
  });
});
