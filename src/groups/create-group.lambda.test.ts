import { ErrorStatuses, ErrorTypes, ErrorMessages } from "@app/common";
import { StructError } from "superstruct";
import { APIGatewayEvent } from "aws-lambda";
import { createGroupHandler } from "./create-group.lambda";
import { mockUser } from "@app/mock";

describe("createGroupHandler", () => {
  const requestBody = JSON.stringify({
    name: "Some name",
  });
  const user = mockUser();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "storeItem").mockImplementation();
    jest
      .spyOn(require("@app/stats"), "updateGeneralStats")
      .mockImplementation();
  });

  it("should be defined and a function", () => {
    expect(createGroupHandler).toBeDefined();
    expect(typeof createGroupHandler === "function").toBe(true);
  });

  describe("parsePayloadCreateGroup", () => {
    it("validates/parses the request", async () => {
      const spy = jest.spyOn(require("./functions"), "parsePayloadCreateGroup");
      await createGroupHandler(
        {
          body: requestBody,
        } as APIGatewayEvent,
        user
      );
      expect(spy).toHaveBeenCalledWith({ name: "Some name" });
      expect(spy).toHaveReturnedWith({ name: "Some name" });
    });

    it("throws the error when request body is invalid", async () => {
      const spy = jest.spyOn(require("./functions"), "parsePayloadCreateGroup");
      await createGroupHandler(
        {
          body: JSON.stringify({ name: "" }),
        } as APIGatewayEvent,
        user
      );
      expect(spy).toHaveBeenCalledWith({ name: "" });
      expect(spy).toThrow(StructError);
    });
  });

  describe("storeItem", () => {
    it("should be called with valid payload", async () => {
      const spy = jest.spyOn(require("@app/database"), "storeItem");
      await createGroupHandler(
        {
          body: requestBody,
        } as APIGatewayEvent,
        user
      );
      // First call (store group)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          pk: expect.any(String),
          sk: expect.any(String),
          adminId: user.pk,
          name: JSON.parse(requestBody).name,
          usersCount: 1,
          upcomingGames: 0,
          gamesPlayed: 0,
          usersLimit: 16,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
      // Second call (store user-admin against group)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          pk: expect.any(String),
          sk: expect.any(String),
          name: user.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          profilePhoto: user.profilePhoto,
        })
      );
      // Third call (store group against user)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          pk: expect.any(String),
          sk: expect.any(String),
          name: JSON.parse(requestBody).name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          adminId: user.pk,
        })
      );
    });
  });

  describe("updateGeneralStats", () => {
    it("should be called once with correct arg", async () => {
      const spy = jest.spyOn(require("@app/stats"), "updateGeneralStats");
      await createGroupHandler(
        {
          body: requestBody,
        } as APIGatewayEvent,
        user
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ groups: true });
    });
  });

  describe("error handling", () => {
    it("should return 400 when request_invalid", async () => {
      const res = await createGroupHandler(
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
  });

  describe("success", () => {
    it("should return 201 with group when success", async () => {
      const res = await createGroupHandler(
        {
          body: requestBody,
        } as APIGatewayEvent,
        user
      );
      expect(res.statusCode).toBe(201);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({
        group: expect.objectContaining({
          pk: expect.any(String),
          sk: expect.any(String),
          adminId: user.pk,
          name: JSON.parse(requestBody).name,
          usersCount: 1,
          gamesPlayed: 0,
          usersLimit: 16,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
        games: [],
      });
    });
  });
});
