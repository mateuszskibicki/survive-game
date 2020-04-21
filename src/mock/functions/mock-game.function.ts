import { GameStatus } from "@app/games";
import { Game } from "@app/games";

/**
 * Returns mocked Game object
 * @returns {Game}
 */
export const mockGame = (): Game => {
  // ISO 8601
  const time: string = new Date().toISOString();
  return {
    pk: "id",
    sk: "id",
    groupId: "groupId",
    gameTime: "2020-04-16T08:15:25.347Z",
    gameType: "1",
    gameTypeId: "2",
    playersLimit: 16,
    playersCount: 2,
    assignedUsers: ["someId", "someId2"],
    status: GameStatus.awaiting,
    adminId: "adminId",
    createdAt: time,
    updatedAt: time,
  };
};
