import { TestBed } from '@angular/core/testing';

import { AQAgentListService } from './aqagent-list.service';

describe('AQAgentListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQAgentListService = TestBed.get(AQAgentListService);
    expect(service).toBeTruthy();
  });
});
