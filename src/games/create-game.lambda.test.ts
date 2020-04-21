import { ErrorStatuses, ErrorTypes, ErrorMessages } from "@app/common";
import { StructError } from "superstruct";
import { APIGatewayEvent } from "aws-lambda";
import { createGameHandler } from "./create-game.lambda";
import { mockUser, mockGroup } from "@app/mock";
import { GameStatus } from "./enum";

describe("createGameHandler", () => {
  const user = mockUser();
  const group = mockGroup();
  const requestBody = JSON.stringify({
    name: "Some name",
    groupId: group.pk,
    gameType: "1",
    gameTypeId: "1",
    playersLimit: 16,
    gameTime: "2021-04-15T13:27:53.268Z",
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "storeItem").mockImplementation();
    jest
      .spyOn(require("@app/database"), "getItem")
      .mockResolvedValue({ ...group, adminId: user.pk });
    jest
      .spyOn(require("@app/stats"), "updateGeneralStats")
      .mockImplementation();
  });

  it("should be defined and a function", () => {
    expect(createGameHandler).toBeDefined();
    expect(typeof createGameHandler === "function").toBe(true);
  });

  describe("parsePayloadCreateGame", () => {
    it("validates/parses the request", async () => {
      const spy = jest.spyOn(require("./functions"), "parsePayloadCreateGame");
      await createGameHandler(
        {
          body: requestBody,
        } as APIGatewayEvent,
        user
      );
      expect(spy).toHaveBeenCalledWith(JSON.parse(requestBody));
      expect(spy).toHaveReturnedWith({
        name: "Some name",
        groupId: group.pk,
        gameType: "1",
        gameTypeId: "1",
        playersLimit: 16,
        gameTime: "2021-04-15T13:27:53.268Z",
      });
    });

    it("throws the error when request body is invalid", async () => {
      const spy = jest.spyOn(require("./functions"), "parsePayloadCreateGame");
      await createGameHandler(
        {
          body: JSON.stringify({ groupId: "groupId" }),
        } as APIGatewayEvent,
        user
      );
      expect(spy).toHaveBeenCalledWith({ groupId: "groupId" });
      expect(spy).toThrow(StructError);
    });
  });

  describe("getItem", () => {
    it("should be called with valid params", async () => {
      const spy = jest.spyOn(require("@app/database"), "getItem");
      await createGameHandler(
        {
          body: requestBody,
        } as APIGatewayEvent,
        user
      );
      expect(spy).toHaveBeenCalledWith(
        JSON.parse(requestBody).groupId,
        JSON.parse(requestBody).groupId
      );
    });
  });

  describe("storeItem", () => {
    it("should be called with valid payload", async () => {
      const spy = jest.spyOn(require("@app/database"), "storeItem");
      await createGameHandler(
        {
          body: requestBody,
        } as APIGatewayEvent,
        user
      );
      expect(spy).toHaveBeenCalledTimes(3);
      // First call, stores game
      expect(spy).toHaveBeenCalledWith({
        pk: expect.any(String),
        sk: expect.any(String),
        gameType: JSON.parse(requestBody).gameType,
        gameTypeId: JSON.parse(requestBody).gameTypeId,
        playersLimit: JSON.parse(requestBody).playersLimit,
        playersCount: 0,
        assignedUsers: null,
        status: GameStatus.awaiting,
        adminId: user.pk,
        groupId: JSON.parse(requestBody).groupId,
        gameTime: JSON.parse(requestBody).gameTime,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      // Second call create partialGame assigned to group
      expect(spy).toHaveBeenCalledWith({
        pk: group.pk,
        sk: expect.any(String),
        groupId: group.pk,
        gameType: JSON.parse(requestBody).gameType,
        gameTypeId: JSON.parse(requestBody).gameTypeId,
        playersLimit: JSON.parse(requestBody).playersLimit,
        playersCount: 0,
        gameTime: JSON.parse(requestBody).gameTime,
        status: GameStatus.awaiting,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      // Third call, updates group upcomingGames
      expect(spy).toHaveBeenCalledWith({
        ...group,
        adminId: user.pk,
        upcomingGames: group.upcomingGames + 1,
      });
    });
  });

  describe("updateGeneralStats", () => {
    it("should be called once with correct arg", async () => {
      const spy = jest.spyOn(require("@app/stats"), "updateGeneralStats");
      await createGameHandler(
        {
          body: requestBody,
        } as APIGatewayEvent,
        user
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ games: true });
    });
  });

  describe("error handling", () => {
    it("should return 400 when request_invalid", async () => {
      const res = await createGameHandler(
        {
          body: JSON.stringify({ name: "" }),
        } as APIGatewayEvent,
        user
      );
      expect(res.statusCode).toBe(ErrorStatuses.invalid_request);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toEqual({
        error: ErrorTypes.invalid_request,
        error_description: ErrorMessages.invalid_request,
      });
    });
    it("should return 404 when not_found", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValue(undefined);
      const res = await createGameHandler(
        {
          body: requestBody,
        } as APIGatewayEvent,
        user
      );
      expect(res.statusCode).toBe(ErrorStatuses.not_found);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toEqual({
        error: ErrorTypes.not_found,
        error_description: ErrorMessages.not_found,
      });
    });
    it("should return 401 when unauthorized", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValue({ ...group, adminId: "somewrongid123" });
      const res = await createGameHandler(
        {
          body: requestBody,
        } as APIGatewayEvent,
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
    it("should return 201 with game when success", async () => {
      const res = await createGameHandler(
        {
          body: requestBody,
        } as APIGatewayEvent,
        user
      );
      expect(res.statusCode).toBe(201);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({
        game: {
          pk: expect.any(String),
          sk: expect.any(String),
          gameType: JSON.parse(requestBody).gameType,
          gameTypeId: JSON.parse(requestBody).gameTypeId,
          playersLimit: JSON.parse(requestBody).playersLimit,
          playersCount: 0,
          assignedUsers: null,
          status: GameStatus.awaiting,
          adminId: user.pk,
          groupId: JSON.parse(requestBody).groupId,
          gameTime: JSON.parse(requestBody).gameTime,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });
  });
});
