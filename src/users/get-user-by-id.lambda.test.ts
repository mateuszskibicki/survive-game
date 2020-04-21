import { mockUser } from "@app/mock";
import { ErrorStatuses, ErrorTypes, ErrorMessages } from "@app/common";
import { User } from "./interfaces";
import { getUserByIdHandler } from "./get-user-by-id.lambda";

describe("getUserByIdHandler", () => {
  const user: User = mockUser();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "getItem").mockResolvedValue(user);
  });

  it("should be defined and a function", () => {
    expect(getUserByIdHandler).toBeDefined();
    expect(typeof getUserByIdHandler === "function").toBe(true);
  });

  describe("getItem", () => {
    it("should be called with provided id", async () => {
      const spy = jest.spyOn(require("@app/database"), "getItem");
      await getUserByIdHandler({
        pathParameters: { id: "id" },
      } as any);
      expect(spy).toHaveBeenCalledWith("id", "id");
    });
  });

  describe("error handling", () => {
    it("should return 404 when not_found", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(undefined);
      const res = await getUserByIdHandler({
        pathParameters: { id: "id" },
      } as any);
      expect(res.statusCode).toBe(ErrorStatuses.not_found);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toEqual({
        error: ErrorTypes.not_found,
        error_description: ErrorMessages.not_found,
      });
    });
  });

  describe("success", () => {
    it("should return 200 with user when success", async () => {
      const res = await getUserByIdHandler({
        pathParameters: { id: "id" },
      } as any);
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({ user });
    });
  });
});
