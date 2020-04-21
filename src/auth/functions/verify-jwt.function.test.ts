import { verifyJWT } from "./verify-jwt.function";

describe("verifyJWT", () => {
  it("should be defined and a function", () => {
    expect(verifyJWT).toBeDefined();
    expect(typeof verifyJWT === "function").toBe(true);
  });
});
