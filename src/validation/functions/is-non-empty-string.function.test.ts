import { isNonEmptyString } from './is-non-empty-string.function';

describe('isNonEmptyString', () => {
  it('should be defined and a function', () => {
    expect(isNonEmptyString).toBeDefined();
    expect(typeof isNonEmptyString === 'function').toBeDefined();
  });

  it('should return false when provided value is incorrect', () => {
    const incorrectValues = ['', 1, [], {}];

    incorrectValues.forEach(value => {
      expect(isNonEmptyString(value)).toBeFalsy();
    });
  });

  it('should return true when provided value is correct', () => {
    const correctValues = [' ', 'abc', '123', 'Long string.'];

    correctValues.forEach(value => {
      expect(isNonEmptyString(value)).toBeTruthy();
    });
  });
});
