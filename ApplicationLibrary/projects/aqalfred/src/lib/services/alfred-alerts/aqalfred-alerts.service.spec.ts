import { TestBed } from '@angular/core/testing';

import { AQAlfredAlertsService } from './aqalfred-alerts.service';

describe('AQAlfredAlertsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQAlfredAlertsService = TestBed.get(AQAlfredAlertsService);
    expect(service).toBeTruthy();
  });
});
