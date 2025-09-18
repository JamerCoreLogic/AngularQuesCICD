import { TestBed } from '@angular/core/testing';

import { DialogSaveParameterService } from './dialog-save-parameter.service';

describe('DialogSaveParameterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialogSaveParameterService = TestBed.get(DialogSaveParameterService);
    expect(service).toBeTruthy();
  });
});
