import { ErrorStatuses, ErrorTypes, ErrorMessages } from "@app/common";
import { StructError } from "superstruct";
import { Group } from "./interfaces";
import { updateGroupHandler } from "./update-group.lambda";
import { mockGroup } from "@app/mock";

describe("updateGroupHandler", () => {
  const group: Group = mockGroup();
  const requestBody = JSON.stringify({ name: "Some name" });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("./functions"), "updateGroup").mockResolvedValue(group);
    jest.spyOn(require("@app/database"), "getItem").mockResolvedValue(group);
  });

  it("should be defined and a function", () => {
    expect(updateGroupHandler).toBeDefined();
    expect(typeof updateGroupHandler === "function").toBe(true);
  });

  describe("parsePayloadUpdateGroup", () => {
    it("validates/parses the request", async () => {
      const spy = jest.spyOn(require("./functions"), "parsePayloadUpdateGroup");
      await updateGroupHandler({
        body: requestBody,
        pathParameters: { id: "id" },
      } as any);
      expect(spy).toHaveBeenCalledWith({ name: "Some name" });
      expect(spy).toHaveReturnedWith({ name: "Some name" });
    });

    it("throws the error when request body is invalid", async () => {
      const spy = jest.spyOn(require("./functions"), "parsePayloadUpdateGroup");
      await updateGroupHandler({
        body: JSON.stringify({ name: "" }),
        pathParameters: { id: "id" },
      } as any);
      expect(spy).toHaveBeenCalledWith({ name: "" });
      expect(spy).toThrow(StructError);
    });
  });

  describe("updateGroup", () => {
    it("should be called with valid payload", async () => {
      const spy = jest.spyOn(require("./functions"), "updateGroup");
      await updateGroupHandler({
        body: requestBody,
        pathParameters: { id: "id" },
      } as any);
      expect(spy).toHaveBeenCalledWith("id", { name: "Some name" });
    });
  });

  describe("getItem", () => {
    it("should be called with passed id", async () => {
      const spy = jest.spyOn(require("@app/database"), "getItem");
      await updateGroupHandler({
        body: requestBody,
        pathParameters: { id: "id123" },
      } as any);
      expect(spy).toHaveBeenCalledWith("id123", "id123");
    });
  });

  describe("error handling", () => {
    it("should return 400 when request_invalid", async () => {
      const res = await updateGroupHandler({
        body: JSON.stringify({ name: "" }),
        pathParameters: { id: "id" },
      } as any);
      expect(res.statusCode).toBe(ErrorStatuses.invalid_request);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toEqual({
        error: ErrorTypes.invalid_request,
        error_description: ErrorMessages.invalid_request,
      });
    });

    it("should return 404 when group if not found", async () => {
      jest.spyOn(require("@app/database"), "getItem").mockReturnValue(false);
      const res = await updateGroupHandler({
        body: JSON.stringify({ name: "name" }),
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
    it("should return 200 with group when success", async () => {
      const res = await updateGroupHandler({
        body: requestBody,
        pathParameters: { id: "id" },
      } as any);
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({ group });
    });
  });
});
