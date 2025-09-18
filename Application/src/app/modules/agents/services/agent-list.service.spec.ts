import { TestBed } from '@angular/core/testing';

import { AgentListService } from './agent-list.service';

describe('AgentListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgentListService = TestBed.get(AgentListService);
    expect(service).toBeTruthy();
  });
});
