import { TestBed } from '@angular/core/testing';

import { RemoveDuplicateService } from './remove-duplicate.service';

describe('RemoveDuplicateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemoveDuplicateService = TestBed.get(RemoveDuplicateService);
    expect(service).toBeTruthy();
  });
});
