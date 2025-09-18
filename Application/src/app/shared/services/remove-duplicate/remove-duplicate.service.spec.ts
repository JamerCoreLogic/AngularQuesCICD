import { TestBed } from '@angular/core/testing';
import { RemoveDuplicateService } from './remove-duplicate.service';

describe('RemoveDuplicateService', () => {
  let service: RemoveDuplicateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveDuplicateService);
  });

  it('should be created', () => {
    const service: RemoveDuplicateService = TestBed.get(RemoveDuplicateService);
    expect(service).toBeTruthy();
  });

  it('should remove duplicates based on the provided key', () => {
    const inputArray = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice' },
      { id: 3, name: 'Charlie' },
      { id: 2, name: 'Bob Updated' }
    ];

    const expectedOutput = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob Updated' },
      { id: 3, name: 'Charlie' }
    ];

    const result = service.removeDuplicates('id', inputArray);
    expect(result).toEqual(expectedOutput);
  });

  it('should return empty array if input is empty', () => {
    const result = service.removeDuplicates('id', []);
    expect(result).toEqual([]);
  });

  it('should handle missing keys gracefully', () => {
    const inputArray = [
      { id: 1, name: 'Alice' },
      { name: 'Bob' }
    ];
    const result = service.removeDuplicates('id', inputArray);
    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { name: 'Bob' }
    ]);
  });
});

