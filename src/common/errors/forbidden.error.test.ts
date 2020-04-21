import { ForbiddenError } from "./forbidden.error";

describe("Error - ForbiddenError", () => {
  it("should be defined and instance of Error", () => {
    expect(ForbiddenError).toBeDefined();
    expect(new ForbiddenError() instanceof Error).toBeTruthy();
  });

  it("should thrown name === Error.name", () => {
    const thrownError = new ForbiddenError();

    expect(thrownError.constructor.name).toEqual(ForbiddenError.name);
  });
});
