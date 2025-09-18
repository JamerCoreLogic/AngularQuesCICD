import { TestBed } from '@angular/core/testing';

import { AQDialogService } from './aqdialog.service';

describe('AQDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AQDialogService = TestBed.get(AQDialogService);
    expect(service).toBeTruthy();
  });
});
