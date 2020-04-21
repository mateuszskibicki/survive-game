import {
  ErrorStatuses,
  ErrorTypes,
  ErrorMessages,
  EntityTypes,
} from "@app/common";
import { getGroupHandler } from "./get-group.lambda";
import {
  mockUser,
  mockPartialUser,
  mockGroup,
  mockPartialGame,
} from "@app/mock";

describe("getGroupHandler", () => {
  const group = mockGroup();
  const user = mockUser();
  const partialUser = mockPartialUser();
  const partialGame = mockPartialGame();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "getItem").mockImplementation();
    jest.spyOn(require("@app/database"), "queryItems").mockResolvedValue([]);
  });

  it("should be defined and a function", () => {
    expect(getGroupHandler).toBeDefined();
    expect(typeof getGroupHandler === "function").toBe(true);
  });

  describe("getItem", () => {
    it("should be called with provided id", async () => {
      const spy = jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(partialUser);
      await getGroupHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(spy).toHaveBeenCalledTimes(2);
      // First call - get group
      expect(spy).toHaveBeenCalledWith("id", "id");
      // Second call - get user
      expect(spy).toHaveBeenCalledWith(group.pk, user.pk);
    });
  });

  describe("queryItems", () => {
    it("should be called with correct args", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(partialUser);
      const spy = jest.spyOn(require("@app/database"), "queryItems");
      await getGroupHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(spy).toHaveBeenCalledTimes(2);
      // First call - get users assigned to group
      expect(spy).toHaveBeenCalledWith(group.pk, EntityTypes.user);
      // Second call - get games assigned to group
      expect(spy).toHaveBeenCalledWith(group.pk, EntityTypes.game);
    });
  });

  describe("error handling", () => {
    it("should return 404 when not_found", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(undefined);
      const res = await getGroupHandler(
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
    it("should return 401 when group found but user is not assigned to it", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(undefined);
      const res = await getGroupHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(res.statusCode).toBe(ErrorStatuses.unauthorized);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toEqual({
        error: ErrorTypes.unauthorized,
        error_description: ErrorMessages.unauthorized,
      });
    });
  });

  describe("success", () => {
    it("should return 200 with group when success", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(partialUser);
      const res = await getGroupHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({
        group,
        users: [],
        games: [],
      });
    });

    it("should return users and games with 200", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(partialUser);
      jest
        .spyOn(require("@app/database"), "queryItems")
        .mockResolvedValueOnce([partialUser])
        .mockResolvedValueOnce([partialGame]);
      const res = await getGroupHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({
        group,
        users: expect.arrayContaining([partialUser]),
        games: expect.arrayContaining([partialGame]),
      });
    });
  });
});
