import { GameStatus } from "./../../games/enum/game-status.enum";
import { PartialGame } from "@app/games";

/**
 * Returns mocked PartialGame object
 * @returns {PartialGame}
 */
export const mockPartialGame = (): PartialGame => {
  // ISO 8601
  const time: string = new Date().toISOString();
  return {
    pk: "id",
    sk: "id",
    groupId: "groupId",
    gameTime: "2020-04-16T08:15:25.347Z",
    gameType: "1",
    gameTypeId: "2",
    playersCount: 4,
    playersLimit: 16,
    status: GameStatus.awaiting,
    createdAt: time,
    updatedAt: time,
  };
};
