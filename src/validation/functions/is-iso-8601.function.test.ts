import { isIso8601 } from "./is-iso-8601.function";

describe("isIso8601", () => {
  it("should be defined and a function", () => {
    expect(isIso8601).toBeDefined();
    expect(typeof isIso8601 === "function").toBe(true);
  });
  it("should return true for a valid param", () => {
    expect(isIso8601("2020-04-14T16:41:32.407Z")).toBe(true);
  });
  it("should return true for a valid param (without timezone)", () => {
    expect(isIso8601("2019-10-02T01:20:00")).toBe(true);
  });
  it("should return false for all invalid", () => {
    const invalid = [
      "1",
      "",
      "2019-10-02",
      "02-10-2019 10:20",
      "arbitrary text",
    ];
    for (const val of invalid) expect(isIso8601(val)).toBe(false);
  });
});
