import { EntityTypes } from "@app/common";
import { loginClient } from "./login-client.function";
import { mockUser, mockToken } from "@app/mock";

describe("loginClient", () => {
  const user = mockUser();
  const token = mockToken();

  beforeEach(() => {
    jest
      .spyOn(
        require("./get-facebook-credentials.function"),
        "getFacebookCredentials"
      )
      .mockResolvedValue({
        id: "fb_id",
        name: "name",
        picture: {
          data: {
            height: 1,
            is_silhouette: false,
            url: "url",
            width: 1,
          },
        },
      });
    jest.spyOn(require("@app/database"), "storeItem").mockImplementation();
    jest.spyOn(require("@app/database"), "getItem").mockImplementation();
    jest
      .spyOn(require("@app/stats"), "updateGeneralStats")
      .mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined and a function", () => {
    expect(loginClient).toBeDefined();
    expect(typeof loginClient === "function").toBe(true);
  });

  describe("getFacebookCredentials", () => {
    it("should be called with correct accessToken", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(undefined);
      const spy = jest.spyOn(
        require("./get-facebook-credentials.function"),
        "getFacebookCredentials"
      );
      await loginClient("accessToken123");
      expect(spy).toHaveBeenCalledWith("accessToken123");
    });
  });

  describe("getItem", () => {
    describe("when token does not exist in dynamodb", () => {
      it("should be called with correct EntityTypes and userId", async () => {
        // First call for token, second for user
        jest
          .spyOn(require("@app/database"), "getItem")
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(user);
        // Spy on getItem
        const spy = jest.spyOn(require("@app/database"), "getItem");
        await loginClient("accessToken123");
        // 2 calls
        expect(spy).toHaveBeenCalledTimes(2);
        // Call with token
        expect(spy).toHaveBeenCalledWith(
          `${EntityTypes.token}_${"accessToken123"}`,
          `${EntityTypes.token}_${"accessToken123"}`
        );
        // Call with user
        expect(spy).toHaveBeenCalledWith(
          `${EntityTypes.user}_${"fb_id"}`,
          `${EntityTypes.user}_${"fb_id"}`
        );
      });
    });
    describe("when token exists in dynamodb", () => {
      it("should be called with correct userId", async () => {
        const spy = jest
          .spyOn(require("@app/database"), "getItem")
          .mockReturnValueOnce(token);
        await loginClient("accessToken123");
        expect(spy).toHaveBeenCalledWith(token.userId, token.userId);
      });
    });
  });

  describe("storeItem", () => {
    it("should be called once when token does not exist but user already exists", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(user);
      const spy = jest.spyOn(require("@app/database"), "storeItem");
      await loginClient("accessToken123");
      expect(spy).toHaveBeenCalledTimes(1);
      // Call with token
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          pk: `${EntityTypes.token}_${"accessToken123"}`,
          sk: `${EntityTypes.token}_${"accessToken123"}`,
        })
      );
    });
    it("should be called twice with correct User and Token when token/user does not exist", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValue(undefined);
      const spy = jest.spyOn(require("@app/database"), "storeItem");
      await loginClient("accessToken123");
      expect(spy).toHaveBeenCalledTimes(2);
      // Call with user
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          pk: `${EntityTypes.user}_${"fb_id"}`,
          sk: `${EntityTypes.user}_${"fb_id"}`,
        })
      );
      // Call with token
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          pk: `${EntityTypes.token}_${"accessToken123"}`,
          sk: `${EntityTypes.token}_${"accessToken123"}`,
        })
      );
    });
  });

  describe("updateGeneralStats", () => {
    it("should be called once with correct arg", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);
      const spy = jest.spyOn(require("@app/stats"), "updateGeneralStats");
      await loginClient("accessToken123");
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ users: true });
    });
  });

  describe("response", () => {
    it("should return user when token already exists", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(token)
        .mockResolvedValueOnce(user);
      const res = await loginClient("accessToken123");
      expect(res).toBe(user);
    });
    it("should return user when token does not exists but user does", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(user);

      const res = await loginClient("accessToken123");
      expect(res).toBe(user);
    });
    it("should return user when token does not exist and user does not exist", async () => {
      jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);
      const res = await loginClient("accessToken123");
      expect(res.pk).toBe(`${EntityTypes.user}_${"fb_id"}`);
      expect(res.sk).toBe(`${EntityTypes.user}_${"fb_id"}`);
    });
  });
});
