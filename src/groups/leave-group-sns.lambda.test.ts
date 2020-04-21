import { leaveGroupSnsHandler } from "./leave-group-sns.lambda";
import { mockGroup /*mockGame*/ } from "@app/mock";
import { EntityTypes } from "@app/common";

describe("leaveGroupSnsHandler", () => {
  const group = mockGroup();
  // const game = mockGame();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(require("@app/database"), "getItem").mockImplementation();
    jest.spyOn(require("@app/database"), "deleteItem").mockImplementation();
    jest.spyOn(require("@app/database"), "storeItem").mockImplementation();
    jest.spyOn(require("@app/database"), "queryItems").mockResolvedValue([]);
    jest
      .spyOn(require("@app/database"), "cleanUsersGamesRelations")
      .mockImplementation();
  });

  it("should be defined and a function", () => {
    expect(leaveGroupSnsHandler).toBeDefined();
    expect(typeof leaveGroupSnsHandler === "function").toBe(true);
  });

  describe("getItem", () => {
    it("should be called with provided groupId", async () => {
      const spy = jest
        .spyOn(require("@app/database"), "getItem")
        .mockResolvedValue(group);

      await leaveGroupSnsHandler({
        Records: [
          {
            Sns: {
              Message: JSON.stringify({ groupPk: "groupPk", userPk: "userPk" }),
            },
          },
        ],
      } as any);

      expect(spy).toHaveBeenCalledTimes(1);
      // First call - get group
      expect(spy).toHaveBeenCalledWith("groupPk", "groupPk");
    });
  });

  describe("deleteItem", () => {
    it("should be called with correct args", async () => {
      jest.spyOn(require("@app/database"), "getItem").mockResolvedValue(group);
      const spy = jest.spyOn(require("@app/database"), "deleteItem");

      await leaveGroupSnsHandler({
        Records: [
          {
            Sns: {
              Message: JSON.stringify({ groupPk: "groupPk", userPk: "userPk" }),
            },
          },
        ],
      } as any);

      expect(spy).toHaveBeenCalledTimes(2);
      // First call removes partialUser assigned to group
      expect(spy).toHaveBeenCalledWith(group.pk, "userPk");
      // First call removes partialGroup assigned to user
      expect(spy).toHaveBeenCalledWith("userPk", group.pk);
    });
  });

  describe("queryItems", () => {
    it("should be called with correct args", async () => {
      jest.spyOn(require("@app/database"), "getItem").mockResolvedValue(group);
      const spy = jest.spyOn(require("@app/database"), "queryItems");

      await leaveGroupSnsHandler({
        Records: [
          {
            Sns: {
              Message: JSON.stringify({ groupPk: "groupPk", userPk: "userPk" }),
            },
          },
        ],
      } as any);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(group.pk, EntityTypes.game);
    });
  });

  describe("cleanUsersGamesRelations", () => {
    it("should be called with correct args", async () => {
      jest.spyOn(require("@app/database"), "getItem").mockResolvedValue(group);
      const spy = jest.spyOn(
        require("@app/database"),
        "cleanUsersGamesRelations"
      );

      await leaveGroupSnsHandler({
        Records: [
          {
            Sns: {
              Message: JSON.stringify({ groupPk: "groupPk", userPk: "userPk" }),
            },
          },
        ],
      } as any);

      expect(spy).toHaveBeenCalledTimes(1);
      // Empty array because queryItems is mocked to return it
      expect(spy).toHaveBeenCalledWith(["userPk"], []);
    });
  });

  describe("storeItem", () => {
    it("should be called with correct args (updated group)", async () => {
      jest.spyOn(require("@app/database"), "getItem").mockResolvedValue(group);
      const spy = jest.spyOn(require("@app/database"), "storeItem");

      await leaveGroupSnsHandler({
        Records: [
          {
            Sns: {
              Message: JSON.stringify({ groupPk: "groupPk", userPk: "userPk" }),
            },
          },
        ],
      } as any);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        ...group,
        usersCount: group.usersCount - 1,
      });
    });
  });

  it("should return void", async () => {
    jest.spyOn(require("@app/database"), "getItem").mockResolvedValue(group);

    const res = await leaveGroupSnsHandler({
      Records: [
        {
          Sns: {
            Message: JSON.stringify({ groupPk: "groupPk", userPk: "userPk" }),
          },
        },
      ],
    } as any);

    expect(res).toBe(undefined);
  });
});
