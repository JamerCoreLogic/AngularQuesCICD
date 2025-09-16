import { TestBed } from '@angular/core/testing';
import { HelperService } from './helper.service';

describe('HelperService', () => {
  let service: HelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HelperService]
    });
    service = TestBed.inject(HelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getName', () => {
    it('should return name from data', () => {
      const data = { name: 'test.pdf' };
      expect(service.getName(data)).toBe('test.pdf');
    });

    it('should handle undefined data', () => {
      expect(service.getName(undefined)).toBeUndefined();
    });

    it('should handle null data', () => {
      expect(service.getName(null)).toBeUndefined();
    });

    it('should handle missing name property', () => {
      expect(service.getName({})).toBeUndefined();
    });
  });

  describe('getFileType', () => {
    it('should return fileType from data', () => {
      const data = { fileType: 'pdf' };
      expect(service.getFileType(data)).toBe('pdf');
    });

    it('should handle undefined data', () => {
      expect(service.getFileType(undefined)).toBeUndefined();
    });

    it('should handle null data', () => {
      expect(service.getFileType(null)).toBeUndefined();
    });

    it('should handle missing fileType property', () => {
      expect(service.getFileType({})).toBeUndefined();
    });
  });

  describe('getLastModified', () => {
    it('should return createdOn from data', () => {
      const date = '2024-02-28';
      const data = { createdOn: date };
      expect(service.getLastModified(data)).toBe(date);
    });

    it('should handle undefined data', () => {
      expect(service.getLastModified(undefined)).toBeUndefined();
    });

    it('should handle null data', () => {
      expect(service.getLastModified(null)).toBeUndefined();
    });

    it('should handle missing createdOn property', () => {
      expect(service.getLastModified({})).toBeUndefined();
    });
  });

  describe('getSize', () => {
    it('should return "0" for undefined size', () => {
      expect(service.getSize({})).toBe('0');
    });

    it('should format size using formatSize for defined size', () => {
      const data = { size: 1024 };
      expect(service.getSize(data)).toBe('1.00 KB');
    });

    it('should handle undefined data', () => {
      expect(service.getSize(undefined)).toBe('0');
    });

    it('should handle null data', () => {
      expect(service.getSize(null)).toBe('0');
    });

    it('should handle zero size', () => {
      expect(service.getSize({ size: 0 })).toBe('0 bytes');
    });
  });

  describe('getContent', () => {
    it('should return content from data', () => {
      const data = { content: 'test content' };
      expect(service.getContent(data)).toBe('test content');
    });

    it('should handle undefined data', () => {
      expect(service.getContent(undefined)).toBeUndefined();
    });

    it('should handle null data', () => {
      expect(service.getContent(null)).toBeUndefined();
    });

    it('should handle missing content property', () => {
      expect(service.getContent({})).toBeUndefined();
    });
  });

  describe('formatSize', () => {
    it('should format bytes', () => {
      expect(service.formatSize(500)).toBe('500 bytes');
    });

    it('should format kilobytes', () => {
      expect(service.formatSize(1024)).toBe('1.00 KB');
      expect(service.formatSize(2048)).toBe('2.00 KB');
    });

    it('should format megabytes', () => {
      const oneMB = 1024 * 1024;
      expect(service.formatSize(oneMB)).toBe('1.00 MB');
      expect(service.formatSize(2 * oneMB)).toBe('2.00 MB');
    });

    it('should format gigabytes', () => {
      const oneGB = 1024 * 1024 * 1024;
      expect(service.formatSize(oneGB)).toBe('1.00 GB');
      expect(service.formatSize(2 * oneGB)).toBe('2.00 GB');
    });

    it('should format terabytes', () => {
      const oneTB = 1024 * 1024 * 1024 * 1024;
      expect(service.formatSize(oneTB)).toBe('1.00 TB');
      expect(service.formatSize(2 * oneTB)).toBe('2.00 TB');
    });

    it('should handle zero size', () => {
      expect(service.formatSize(0)).toBe('0 bytes');
    });

 
  });
}); 