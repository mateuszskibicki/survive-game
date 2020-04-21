import { ErrorStatuses, ErrorTypes, ErrorMessages } from "@app/common";
import { Group } from "./interfaces";
import { signToGroupHandler } from "./sign-to-group.lambda";
import { mockUser, mockPartialUser, mockGroup } from "@app/mock";

describe("signToGroupHandler", () => {
  const group: Group = mockGroup();
  const user = mockUser();
  const partialUser = mockPartialUser();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "getItem").mockImplementation();
    jest.spyOn(require("@app/database"), "storeItem").mockImplementation();
  });

  it("should be defined and a function", () => {
    expect(signToGroupHandler).toBeDefined();
    expect(typeof signToGroupHandler === "function").toBe(true);
  });

  describe("getItem", () => {
    it("should be called with provided id", async () => {
      const spy = jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(partialUser);

      await signToGroupHandler(
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

  describe("storeItem", () => {
    it("should be called with correct args", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(undefined);
      const spy = jest.spyOn(require("@app/database"), "storeItem");

      await signToGroupHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );

      expect(spy).toHaveBeenCalledTimes(3);
      // First call - store partial user against group
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          pk: group.pk,
          sk: user.pk,
          name: user.name,
          profilePhoto: user.profilePhoto,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
      // Second call - store partial group against user
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          pk: user.pk,
          sk: group.pk,
          adminId: user.pk,
          name: group.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
      // Third call - update group
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          usersCount: group.usersCount + 1,
        })
      );
    });
  });

  describe("error handling", () => {
    it("should return 404 when not_found", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(undefined);
      const res = await signToGroupHandler(
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
    it("should return 403 when group found but user is already assigned to it", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(partialUser);
      const res = await signToGroupHandler(
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

    it("should return 403 when group found but is already full", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce({ ...group, usersLimit: 50, usersCount: 50 })
        .mockResolvedValueOnce(partialUser);
      const res = await signToGroupHandler(
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
        .mockResolvedValueOnce(group)
        .mockResolvedValueOnce(undefined);
      const res = await signToGroupHandler(
        {
          pathParameters: { id: "id" },
        } as any,
        user
      );
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({
        group: {
          ...group,
          usersCount: group.usersCount + 1,
          updatedAt: expect.any(String),
        },
      });
    });
  });
});
