import { TestBed } from '@angular/core/testing';

import { SetDateService } from './set-date.service';

describe('SetDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetDateService = TestBed.get(SetDateService);
    expect(service).toBeTruthy();
  });
});
