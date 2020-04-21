import { generateJWT } from "./generate-jwt.function";

describe("generateJWT", () => {
  it("should be defined and a function", () => {
    expect(generateJWT).toBeDefined();
    expect(typeof generateJWT === "function").toBe(true);
  });
});
