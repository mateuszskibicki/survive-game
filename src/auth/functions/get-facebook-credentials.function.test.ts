import { getFacebookCredentials } from "./get-facebook-credentials.function";

describe("getFacebookCredentials", () => {
  it("should be defined and a function", () => {
    expect(getFacebookCredentials).toBeDefined();
    expect(typeof getFacebookCredentials === "function").toBe(true);
  });
});
