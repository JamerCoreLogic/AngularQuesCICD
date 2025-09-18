import { TestBed } from '@angular/core/testing';
import { EncryptionDecryptionService } from './encryption-decryption.service';

describe('EncryptionDecryptionService', () => {
  let service: EncryptionDecryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryptionDecryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should encrypt and decrypt a string correctly', () => {
    const originalText = 'HelloWorld123!';
    const encryptedText = service.Encrypt(originalText);
    const decryptedText = service.Decrypt(encryptedText);

    expect(encryptedText).not.toEqual(originalText);
    expect(decryptedText).toEqual(originalText);
  });

  it('should return different encrypted value for different input', () => {
    const text1 = 'TextOne';
    const text2 = 'TextTwo';
    const encrypted1 = service.Encrypt(text1);
    const encrypted2 = service.Encrypt(text2);

    expect(encrypted1).not.toEqual(encrypted2);
  });

  it('should consistently encrypt the same input to the same output', () => {
    const text = 'ConsistentInput';
    const encrypted1 = service.Encrypt(text);
    const encrypted2 = service.Encrypt(text);

    expect(encrypted1).toEqual(encrypted2);
  });
});
