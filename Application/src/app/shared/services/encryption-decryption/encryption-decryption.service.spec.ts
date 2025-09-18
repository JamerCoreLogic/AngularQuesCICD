import { TestBed } from '@angular/core/testing';

import { EncryptionDecryptionService } from './encryption-decryption.service';

describe('EncryptionDecryptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncryptionDecryptionService = TestBed.get(EncryptionDecryptionService);
    expect(service).toBeTruthy();
  });
});
