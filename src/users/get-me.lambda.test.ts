import { mockUser, mockPartialGame, mockPartialGroup } from "@app/mock";
import { EntityTypes } from "@app/common";
import { getMeHandler } from "./get-me.lambda";

describe("getMeHandler", () => {
  const user = mockUser();
  const partialGroup = mockPartialGroup();
  const partialGame = mockPartialGame();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "queryItems").mockResolvedValue([]);
  });

  it("should be defined and a function", () => {
    expect(getMeHandler).toBeDefined();
    expect(typeof getMeHandler === "function").toBe(true);
  });

  describe("queryItems", () => {
    it("should be called with correct args", async () => {
      const spy = jest.spyOn(require("@app/database"), "queryItems");
      await getMeHandler({} as any, user);
      expect(spy).toHaveBeenCalledTimes(2);
      // First call for groups
      expect(spy).toHaveBeenCalledWith(user.pk, EntityTypes.group);
      // First call for games
      expect(spy).toHaveBeenCalledWith(user.pk, EntityTypes.game);
    });
  });

  describe("success", () => {
    it("should return 200 with user when success", async () => {
      const res = await getMeHandler({} as any, user);
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({
        user,
        groups: [],
        games: [],
      });
    });

    it("should return users and games with 200", async () => {
      jest
        .spyOn(require("@app/database"), "queryItems")
        .mockResolvedValueOnce([partialGroup])
        .mockResolvedValueOnce([partialGame]);
      const res = await getMeHandler({} as any, user);
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({
        user,
        groups: expect.arrayContaining([partialGroup]),
        games: expect.arrayContaining([partialGame]),
      });
    });
  });
});
