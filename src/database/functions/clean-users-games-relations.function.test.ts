import { cleanUsersGamesRelations } from "./clean-users-games-relations.function";
import { mockGame, mockPartialGame } from "@app/mock";
// import { EntityTypes } from "@app/common";

describe("cleanUsersGamesRelations", () => {
  const game = mockGame();
  const partialGame = mockPartialGame();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest
      .spyOn(require("./get-item.function"), "getItem")
      .mockResolvedValue(game);
    jest
      .spyOn(require("./delete-item.function"), "deleteItem")
      .mockImplementation();
    jest
      .spyOn(require("./store-item.function"), "storeItem")
      .mockImplementation();
  });

  it("should be defined and a function", () => {
    expect(cleanUsersGamesRelations).toBeDefined();
    expect(typeof cleanUsersGamesRelations === "function").toBe(true);
  });

  describe("getItem", () => {
    it("should be called with provided partialGame.sk", async () => {
      const spy = jest.spyOn(require("./get-item.function"), "getItem");

      await cleanUsersGamesRelations(["userPk"], [partialGame]);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(partialGame.sk, partialGame.sk);
    });
    it("should be called twice when 2 partialGame provided", async () => {
      const spy = jest.spyOn(require("./get-item.function"), "getItem");
      const partialGame2 = { ...partialGame, sk: "secondSk" };

      await cleanUsersGamesRelations(["userPk"], [partialGame, partialGame2]);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(partialGame.sk, partialGame.sk);
      expect(spy).toHaveBeenCalledWith("secondSk", "secondSk");
    });
    it("should be called 2 times when 1 partialGame provided and user is part of the game (should call for partial user)", async () => {
      const spy = jest
        .spyOn(require("./get-item.function"), "getItem")
        .mockResolvedValueOnce({ ...game, assignedUsers: ["userPk"] })
        .mockResolvedValueOnce(partialGame);

      await cleanUsersGamesRelations(["userPk"], [partialGame]);

      expect(spy).toHaveBeenCalledTimes(2);
      // get game
      expect(spy).toHaveBeenCalledWith(partialGame.sk, partialGame.sk);
      // get partial game assigned to group
      expect(spy).toHaveBeenCalledWith(game.groupId, game.pk);
    });
  });

  describe("deleteItem", () => {
    it("should be called with correct args and twice", async () => {
      jest
        .spyOn(require("./get-item.function"), "getItem")
        .mockResolvedValueOnce({ ...game, assignedUsers: ["userPk"] })
        .mockResolvedValueOnce(partialGame);
      const spy = jest.spyOn(require("./delete-item.function"), "deleteItem");

      await cleanUsersGamesRelations(["userPk"], [partialGame]);

      expect(spy).toHaveBeenCalledTimes(2);
      // First call removes partialUser assigned to game
      expect(spy).toHaveBeenCalledWith(game.pk, "userPk");
      // First call removes partialGame assigned to user
      expect(spy).toHaveBeenCalledWith("userPk", game.pk);
    });
  });

  describe("storeItem", () => {
    it("should be called with correct args once and assignedUsers = null", async () => {
      jest
        .spyOn(require("./get-item.function"), "getItem")
        .mockResolvedValueOnce({ ...game, assignedUsers: ["userPk"] })
        .mockResolvedValueOnce(partialGame);
      const spy = jest.spyOn(require("./store-item.function"), "storeItem");

      await cleanUsersGamesRelations(["userPk"], [partialGame]);

      expect(spy).toHaveBeenCalledTimes(2);
      // first call updates game with playersCount - 1
      expect(spy).toHaveBeenCalledWith({
        ...game,
        playersCount: game.playersCount - 1,
        assignedUsers: null,
      });
      // second call updates partialGame assigned to group with playersCount - 1
      expect(spy).toHaveBeenCalledWith({
        ...partialGame,
        playersCount: partialGame.playersCount - 1,
      });
    });
    it("should be called with correct args twice and assignedUsers = ['secondUserPk']", async () => {
      jest
        .spyOn(require("./get-item.function"), "getItem")
        .mockResolvedValueOnce({
          ...game,
          assignedUsers: ["userPk", "secondUserPk"],
        })
        .mockResolvedValueOnce(partialGame);
      const spy = jest.spyOn(require("./store-item.function"), "storeItem");

      await cleanUsersGamesRelations(["userPk"], [partialGame]);

      expect(spy).toHaveBeenCalledTimes(2);
      // first call updates game with playersCount - 1
      expect(spy).toHaveBeenCalledWith({
        ...game,
        playersCount: game.playersCount - 1,
        assignedUsers: ["secondUserPk"],
      });
      // second call updates partialGame assigned to group with playersCount - 1
      expect(spy).toHaveBeenCalledWith({
        ...partialGame,
        playersCount: partialGame.playersCount - 1,
      });
    });
  });

  it("should return void", async () => {
    jest
      .spyOn(require("./get-item.function"), "getItem")
      .mockResolvedValue({ ...game, assignedUsers: ["userPk"] })
      .mockResolvedValueOnce(partialGame);

    const res = await cleanUsersGamesRelations(["userPk"], [partialGame]);

    expect(res).toBe(undefined);
  });
});
