import { EntityTypes } from "@app/common";
import { mockStats } from "@app/mock";
import { getStatsHandler } from "./get-stats.lambda";

describe("getStatsHandler", () => {
  const stats = mockStats();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "getItem").mockResolvedValue(stats);
  });

  it("should be defined and a function", () => {
    expect(getStatsHandler).toBeDefined();
    expect(typeof getStatsHandler === "function").toBe(true);
  });

  describe("getItem", () => {
    it("should be called once with EntityTypes.stats", async () => {
      const spy = jest.spyOn(require("@app/database"), "getItem");
      await getStatsHandler({} as any);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(EntityTypes.stats, EntityTypes.stats);
    });
  });

  describe("success", () => {
    it("should return 200 with group when success", async () => {
      const res = await getStatsHandler({} as any);
      expect(res.statusCode).toBe(200);
      expect(res.headers).toStrictEqual({});
      expect(JSON.parse(res.body)).toStrictEqual({
        stats,
      });
    });
  });
});
