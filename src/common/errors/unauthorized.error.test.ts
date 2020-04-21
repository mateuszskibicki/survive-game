import { UnauthorizedError } from "./unauthorized.error";

describe("Error - UnauthorizedError", () => {
  it("should be defined and instance of Error", () => {
    expect(UnauthorizedError).toBeDefined();
    expect(new UnauthorizedError() instanceof Error).toBeTruthy();
  });

  it("should thrown name === Error.name", () => {
    const thrownError = new UnauthorizedError();

    expect(thrownError.constructor.name).toEqual(UnauthorizedError.name);
  });
});
