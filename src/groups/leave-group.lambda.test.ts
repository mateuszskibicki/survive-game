import { ErrorStatuses, ErrorTypes, ErrorMessages } from "@app/common";
import { Group } from "./interfaces";
import { leaveGroupHandler } from "./leave-group.lambda";
import { mockUser, mockPartialUser, mockGroup } from "@app/mock";
import { LeaveGroupSnsMessageBody } from "./interfaces/leave-group-sns-message-body.interface";

describe("leaveGroupHandler", () => {
  const group: Group = mockGroup();
  const user = mockUser();
  const partialUser = mockPartialUser();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "getItem").mockImplementation();
    jest.spyOn(require("@app/database"), "deleteItem").mockImplementation();
    jest
      .spyOn(require("@app/database"), "publishSnsMessage")
      .mockImplementation();
  });

  it("should be defined and a function", () => {
    expect(leaveGroupHandler).toBeDefined();
    expect(typeof leaveGroupHandler === "function").toBe(true);
  });

  describe("getItem", () => {
    it("should be called with provided id", async () => {
      const spy = jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(partialUser);

      await leaveGroupHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );

      expect(spy).toHaveBeenCalledTimes(2);
      // First call - get group
      expect(spy).toHaveBeenCalledWith("id", "id");
      // Second call - get partialUser
      expect(spy).toHaveBeenCalledWith(group.pk, user.pk);
    });
  });

  describe("deleteItem", () => {
    it("should be called with correct args", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(partialUser);
      const spy = jest.spyOn(require("@app/database"), "deleteItem");

      await leaveGroupHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(user.pk, group.pk);
    });
  });

  describe("publishSnsMessage", () => {
    it("should be called with correct args", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(partialUser);
      const spy = jest.spyOn(require("@app/database"), "publishSnsMessage");
      const messagePayload: LeaveGroupSnsMessageBody = {
        groupPk: group.pk,
        userPk: user.pk,
      };

      await leaveGroupHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        process.env.SNS_TOPIC_LEAVE_GROUP,
        JSON.stringify(messagePayload)
      );
    });
  });

  describe("error handling", () => {
    it("should return 404 when not_found", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(undefined);
      const res = await leaveGroupHandler(
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
    it("should return 403 when group found but user is not assigned to it", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(undefined);
      const res = await leaveGroupHandler(
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
    it("should return 204 with empty object", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(partialUser);
      const res = await leaveGroupHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(res.statusCode).toBe(204);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({});
    });
  });
});
