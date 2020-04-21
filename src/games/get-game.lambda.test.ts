import {
  ErrorStatuses,
  ErrorTypes,
  ErrorMessages,
  EntityTypes,
} from "@app/common";
import { Game } from "./interfaces";
import { getGameHandler } from "./get-game.lambda";
import { mockUser, mockPartialUser, mockGame } from "@app/mock";

describe("getGameHandler", () => {
  const game: Game = mockGame();
  const user = mockUser();
  const partialUser = mockPartialUser();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "queryItems").mockResolvedValue([]);
  });

  it("should be defined and a function", () => {
    expect(getGameHandler).toBeDefined();
    expect(typeof getGameHandler === "function").toBe(true);
  });

  describe("getItem", () => {
    it("should be called with provided id", async () => {
      const spy = jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(game)
        .mockResolvedValueOnce(partialUser);

      await getGameHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(spy).toHaveBeenCalledTimes(2);
      // First call - get game
      expect(spy).toHaveBeenCalledWith("id", "id");
      // Second call - get user assigned to group
      expect(spy).toHaveBeenCalledWith(game.groupId, user.pk);
    });
  });

  describe("queryItems", () => {
    it("should be called with provided id", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(game)
        .mockResolvedValueOnce(partialUser);
      const spy = jest.spyOn(require("@app/database"), "queryItems");

      await getGameHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(game.pk, EntityTypes.user);
    });
  });

  describe("error handling", () => {
    it("should return 404 when not_found", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(undefined);
      const res = await getGameHandler(
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
    it("should return 401 when game found but user is not assigned to group", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(game)
        .mockResolvedValueOnce(undefined);
      const res = await getGameHandler(
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
    it("should return 200 with game when success", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(game)
        .mockResolvedValueOnce(partialUser);
      const res = await getGameHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({ game, users: [] });
    });

    it("should return users and games with 200", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(game)
        .mockResolvedValueOnce(partialUser);
      jest
        .spyOn(require("@app/database"), "queryItems")
        .mockResolvedValueOnce([partialUser]);
      const res = await getGameHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({
        game,
        users: expect.arrayContaining([partialUser]),
      });
    });
  });
});
