import { TestBed } from '@angular/core/testing';

import { AQAgentInfo } from './aqagent-info.service';

describe('AQAgentInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQAgentInfo = TestBed.get(AQAgentInfo);
    expect(service).toBeTruthy();
  });
});
