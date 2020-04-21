import { loginHandler } from "./login.lambda";
import { mockUser } from "@app/mock";

describe("loginHandler", () => {
  const user = mockUser();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("./functions"), "loginClient").mockResolvedValue(user);
    jest
      .spyOn(require("./functions"), "generateJWT")
      .mockReturnValue("jwt-token");
  });

  it("should be defined and a function", () => {
    expect(loginHandler).toBeDefined();
    expect(typeof loginHandler === "function").toBe(true);
  });

  describe("loginClient", () => {
    it("should be called with provided token", async () => {
      const spy = jest.spyOn(require("./functions"), "loginClient");
      await loginHandler({
        headers: { Authorization: "Bearer token123" },
      } as any);
      expect(spy).toHaveBeenCalledWith("token123");
    });
  });

  describe("generateJWT", () => {
    it("should be called with user", async () => {
      const spy = jest.spyOn(require("./functions"), "generateJWT");
      await loginHandler({
        headers: { Authorization: "Bearer token123" },
      } as any);
      expect(spy).toHaveBeenCalledWith(user);
    });
  });

  describe("success", () => {
    it("should return 200 with token when success", async () => {
      const res = await loginHandler({
        headers: { Authorization: "Bearer token123" },
      } as any);
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({ token: "jwt-token" });
    });
  });
});
