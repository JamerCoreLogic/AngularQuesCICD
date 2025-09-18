import { TestBed } from '@angular/core/testing';

import { CheckManagerSupervisorService } from './check-manager-supervisor.service';

describe('CheckManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckManagerSupervisorService = TestBed.get(CheckManagerSupervisorService);
    expect(service).toBeTruthy();
  });
});
