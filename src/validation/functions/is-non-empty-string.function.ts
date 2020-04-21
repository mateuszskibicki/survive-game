/**
 * Checks if the value is a string that is 1 or more characters long
 * @param {unknown} val
 * @return {boolean}
 */
export function isNonEmptyString(val: unknown): boolean {
  return !!val
    && typeof val === 'string'
    && val.length > 0;
}
