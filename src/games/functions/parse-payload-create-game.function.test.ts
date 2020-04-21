import { StructError } from "superstruct";
import { parsePayloadCreateGame } from "./parse-payload-create-game.function";

describe("parsePayloadCreateGame", () => {
  it("should be defined and a function", () => {
    expect(parsePayloadCreateGame).toBeDefined();
    expect(typeof parsePayloadCreateGame === "function").toBe(true);
  });

  it("throws a struct error if the request is invalid", () => {
    const badValues = [
      {
        name: "",
        groupId: "abc",
        gameTime: "123",
        gameType: "1",
        gameTypeId: "2",
        playersLimit: 16,
      },
      {
        name: "abc",
        groupId: "",
        gameTime: "123",
        gameType: "1",
        gameTypeId: "2",
        playersLimit: 16,
      },
      {
        name: "abc",
        groupId: "abc",
        gameTime: "2019/10/06",
        gameType: "1",
        gameTypeId: "2",
        playersLimit: 16,
      },
      {
        name: "some name",
        groupId: "some id",
        gameTime: "2020-04-14T16:41:32.407Z",
        gameType: "1",
        gameTypeId: "2",
        playersLimit: "16",
      },
    ];

    badValues.forEach((value: any) => {
      expect(() => parsePayloadCreateGame(value)).toThrow(StructError);
    });
  });

  it("parses the request params", () => {
    expect(
      parsePayloadCreateGame({
        name: "some name",
        groupId: "some id",
        gameTime: "2020-04-14T16:41:32.407Z",
        gameType: "1",
        gameTypeId: "2",
        playersLimit: 16,
      })
    ).toEqual({
      name: "some name",
      groupId: "some id",
      gameTime: "2020-04-14T16:41:32.407Z",
      gameType: "1",
      gameTypeId: "2",
      playersLimit: 16,
    });
  });
});
