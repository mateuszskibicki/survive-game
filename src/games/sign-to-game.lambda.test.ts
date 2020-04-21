import { ErrorStatuses, ErrorTypes, ErrorMessages } from "@app/common";
import { signToGameHandler } from "./sign-to-game-lambda";
import {
  mockUser,
  mockPartialUser,
  mockGroup,
  mockGame,
  mockPartialGame,
} from "@app/mock";

describe("signToGameHandler", () => {
  const group = mockGroup();
  const game = mockGame();
  const user = mockUser();
  const partialUser = mockPartialUser();
  const partialGame = mockPartialGame();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "getItem").mockImplementation();
    jest.spyOn(require("@app/database"), "storeItem").mockImplementation();
  });

  it("should be defined and a function", () => {
    expect(signToGameHandler).toBeDefined();
    expect(typeof signToGameHandler === "function").toBe(true);
  });

  describe("getItem", () => {
    it("should be called with correct args", async () => {
      const spy = jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(game)
        .mockResolvedValueOnce(partialUser)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(partialGame);

      await signToGameHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );

      expect(spy).toHaveBeenCalledTimes(4);
      // First call - get game
      expect(spy).toHaveBeenCalledWith("id", "id");
      // Second call - get user againt group
      expect(spy).toHaveBeenCalledWith(game.groupId, user.pk);
      // Third call - get user againt game
      expect(spy).toHaveBeenCalledWith(game.pk, user.pk);
      // Fourth call - get game againt group
      expect(spy).toHaveBeenCalledWith(game.groupId, game.pk);
    });
  });

  describe("storeItem", () => {
    it("should be called with correct args", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(game)
        .mockResolvedValueOnce(partialUser)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(partialGame);
      const spy = jest.spyOn(require("@app/database"), "storeItem");

      await signToGameHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );

      expect(spy).toHaveBeenCalledTimes(4);
      // First call - store partial user against game
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          pk: game.pk,
          sk: user.pk,
          name: user.name,
          profilePhoto: user.profilePhoto,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
      // Second call - store partial game against user
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          pk: user.pk,
          sk: game.pk,
          playersLimit: game.playersLimit,
          groupId: game.groupId,
          gameType: game.gameType,
          gameTypeId: game.gameTypeId,
          gameTime: game.gameType,
          status: game.status,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
      // Third call - update playersCount on game
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          ...game,
          assignedUsers: [...game.assignedUsers, user.pk],
          playersCount: game.playersCount + 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
      // Fourth call - update playersCount on partialGame assigned to group
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          ...partialGame,
          playersCount: partialGame.playersCount + 1,
        })
      );
    });
  });

  describe("error handling", () => {
    it("should return 404 when game not_found", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(undefined);
      const res = await signToGameHandler(
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
    it("should return 401 when user is not a part of group and unauthorized", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(undefined);
      const res = await signToGameHandler(
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

    it("should return 403 when game found but is already full", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce({ ...game, playersCount: 16, playersLimit: 16 })
        .mockResolvedValueOnce(partialUser);
      const res = await signToGameHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(res.statusCode).toBe(ErrorStatuses.forbidden);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toEqual({
        error: ErrorTypes.forbidden,
        error_description: ErrorMessages.forbidden,
      });
    });

    it("should return 403 when user is already assigned to game", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(game)
        .mockResolvedValueOnce(partialUser)
        .mockResolvedValueOnce(partialUser);
      const res = await signToGameHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(res.statusCode).toBe(ErrorStatuses.forbidden);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toEqual({
        error: ErrorTypes.forbidden,
        error_description: ErrorMessages.forbidden,
      });
    });
  });

  describe("success", () => {
    it("should return 200 with group when success", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(game)
        .mockResolvedValueOnce(partialUser)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(partialGame);
      const res = await signToGameHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({
        game: {
          ...game,
          assignedUsers: [...game.assignedUsers, user.pk],
          playersCount: game.playersCount + 1,
          updatedAt: expect.any(String),
        },
      });
    });
  });
});
