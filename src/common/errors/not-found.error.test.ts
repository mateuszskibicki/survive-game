import { NotFoundError } from "./not-found.error";

describe("Error - NotFoundError", () => {
  it("should be defined and instance of Error", () => {
    expect(NotFoundError).toBeDefined();
    expect(new NotFoundError() instanceof Error).toBeTruthy();
  });

  it("should thrown name === Error.name", () => {
    const thrownError = new NotFoundError();

    expect(thrownError.constructor.name).toEqual(NotFoundError.name);
  });
});
