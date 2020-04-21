/**
 * Validates if the given string is a fully qualified
 * ISO8601 string time
 * @param {string} time
 * @return {boolean}
 */
export const isIso8601 = (time: string): any => {
  const regEx = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
  return regEx.test(time);
};
