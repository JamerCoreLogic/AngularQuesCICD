import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the same string if it has fewer words than limit', () => {
    const input = 'This is a short string';
    const result = pipe.transform(input, 10);
    expect(result).toBe(input);
  });

  it('should truncate the string if it has more words than limit', () => {
    const input = 'This is a longer string that should be truncated';
    const result = pipe.transform(input, 5);
    expect(result).toBe('This is a longer string...');
  });

  it('should handle empty string', () => {
    const input = '';
    const result = pipe.transform(input, 5);
    expect(result).toBe('');
  });

  it('should handle undefined input', () => {
    const result = pipe.transform(undefined as any, 5);
    expect(result).toBeUndefined();
  });

  it('should truncate exactly at word limit', () => {
    const input = 'One two three four five six';
    const result = pipe.transform(input, 3);
    expect(result).toBe('One two three...');
  });

  it('should handle single word', () => {
    const input = 'Supercalifragilisticexpialidocious';
    const result = pipe.transform(input, 1);
    expect(result).toBe(input);
  });
}); 