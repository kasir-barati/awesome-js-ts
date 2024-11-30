import { isEmptyString } from './is-empty-string.lib';

describe('isEmptyString', () => {
  it('should return true', () => {
    const result = isEmptyString('        ');

    expect(result).toBeTruthy();
    expect(typeof result).toBe('boolean');
  });

  it('should return false', () => {
    const result = isEmptyString('\t');

    expect(result).toBeTruthy();
    expect(typeof result).toBe('boolean');
  });
});
