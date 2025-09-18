import { TestBed } from '@angular/core/testing';

import { AQFormsService } from './aqforms.service';

describe('AQFormsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQFormsService = TestBed.get(AQFormsService);
    expect(service).toBeTruthy();
  });
});
