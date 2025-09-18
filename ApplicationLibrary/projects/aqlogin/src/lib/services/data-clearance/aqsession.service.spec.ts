import { TestBed } from '@angular/core/testing';

import { AQSessionService } from './aqsession.service';

describe('AQSessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQSessionService = TestBed.get(AQSessionService);
    expect(service).toBeTruthy();
  });
});
