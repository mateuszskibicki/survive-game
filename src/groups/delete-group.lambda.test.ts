import { deleteGroupHandler } from "./delete-group.lambda";

describe("deleteGroupHandler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest
      .spyOn(require("./functions"), "deleteGroup")
      .mockImplementation((): void => {});
  });

  it("should be defined and a function", () => {
    expect(deleteGroupHandler).toBeDefined();
    expect(typeof deleteGroupHandler === "function").toBe(true);
  });

  describe("deleteGroup", () => {
    it("should be called with valid payload", async () => {
      const spy = jest.spyOn(require("./functions"), "deleteGroup");
      await deleteGroupHandler({
        pathParameters: { id: "id" },
      } as any);
      expect(spy).toHaveBeenCalledWith("id");
    });
  });

  describe("success", () => {
    it("should return 204 when success", async () => {
      const res = await deleteGroupHandler({
        pathParameters: { id: "id" },
      } as any);
      expect(res.statusCode).toBe(204);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({});
    });
  });
});
