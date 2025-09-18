import { TestBed } from '@angular/core/testing';

import { ParameterKeysListService } from './parameter-keys-list.service';

describe('ParameterKeysListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParameterKeysListService = TestBed.get(ParameterKeysListService);
    expect(service).toBeTruthy();
  });
});
