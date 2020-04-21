import { ErrorStatuses, ErrorTypes, ErrorMessages } from "@app/common";
import { getGroupPartialHandler } from "./get-group-partial.lambda";
import { mockUser, mockGroup } from "@app/mock";

describe("getGroupPartialHandler", () => {
  const group = mockGroup();
  const user = mockUser();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "getItem").mockImplementation();
  });

  it("should be defined and a function", () => {
    expect(getGroupPartialHandler).toBeDefined();
    expect(typeof getGroupPartialHandler === "function").toBe(true);
  });

  describe("getItem", () => {
    it("should be called with provided id", async () => {
      const spy = jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group);
      await getGroupPartialHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(spy).toHaveBeenCalledTimes(1);
      // First call - get group
      expect(spy).toHaveBeenCalledWith("id", "id");
    });
  });

  describe("error handling", () => {
    it("should return 404 when not_found", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(undefined);
      const res = await getGroupPartialHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(res.statusCode).toBe(ErrorStatuses.not_found);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toEqual({
        error: ErrorTypes.not_found,
        error_description: ErrorMessages.not_found,
      });
    });
  });

  describe("success", () => {
    it("should return 200 with group when success", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group);
      const res = await getGroupPartialHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({
        group,
      });
    });
  });
});
