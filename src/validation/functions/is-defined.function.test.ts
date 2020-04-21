import { isDefined } from "./is-defined.function";

describe("isDefined", () => {
  it("should be defined and a function", () => {
    expect(isDefined).toBeDefined();
    expect(typeof isDefined === "function").toBe(true);
  });

  it("should return true when provided value is defined", () => {
    const validValues = ["", 1, false, true, "abc", "null", null, {}, []];

    validValues.forEach((value) => {
      expect(isDefined(value)).toBeTruthy();
    });
  });

  it("should return false when provided value is undefined", () => {
    expect(isDefined(undefined)).toBeFalsy();
  });
});
