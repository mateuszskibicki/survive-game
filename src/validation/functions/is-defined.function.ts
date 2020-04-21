/**
 * Validates if the given value exists (can be null, string, number, false etc.)
 * Should return false only when undefined
 * @param {any} value
 * @return {boolean}
 */
export const isDefined = (value: any): boolean => typeof value !== 'undefined';
