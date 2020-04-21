import { EntityTypes } from "@app/common";
import { mockStats } from "@app/mock";
import { updateGeneralStats } from "./update-general-stats.function";

describe("updateGeneralStats", () => {
  const stats = mockStats();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "getItem").mockResolvedValue(stats);
    jest.spyOn(require("@app/database"), "storeItem").mockImplementation();
  });

  it("should be defined and a function", () => {
    expect(updateGeneralStats).toBeDefined();
    expect(typeof updateGeneralStats === "function").toBe(true);
  });

  describe("getItem", () => {
    it("should be called with correct args", async () => {
      const spy = jest.spyOn(require("@app/database"), "getItem");
      await updateGeneralStats({
        users: true,
      });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(EntityTypes.stats, EntityTypes.stats);
    });
  });

  describe("storeItem", () => {
    it("should be called with passed with correct args", async () => {
      const spy = jest.spyOn(require("@app/database"), "storeItem");
      await updateGeneralStats({
        users: true,
        games: true,
      });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        pk: EntityTypes.stats,
        sk: EntityTypes.stats,
        users: stats.users + 1,
        games: stats.games + 1,
        groups: stats.groups,
      });
    });
  });

  describe("success", () => {
    it("should return void", async () => {
      const res = await updateGeneralStats({
        users: true,
      });
      expect(res).toBeUndefined();
    });
  });
});
