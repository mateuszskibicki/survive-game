import { PartialGame, Game } from "@app/games";
import { getItem } from "./get-item.function";
import { deleteItem } from "./delete-item.function";
import { storeItem } from "./store-item.function";

/**
 * Async loop to process cleaning partialUser info against incoming games
 * Can be used when leaving the group/ removing group/ removing user/ removing game
 * @function
 * @async
 * @param {string[]} usersPks
 * @param {PartialGame[]} partialGames
 * @return {Promise<void>}
 */
export const cleanUsersGamesRelations = async (
  usersPks: string[],
  partialGames: PartialGame[]
): Promise<void> => {
  // Loop each game
  for (const singlePartialGame of partialGames) {
    // Get full Game object
    const game: Game = await getItem(
      singlePartialGame.sk,
      singlePartialGame.sk
    );

    // Loop each userPk to check if part of incoming game
    for (const userPk of usersPks) {
      if (game.assignedUsers && game.assignedUsers.includes(userPk)) {
        // Updates game with smaller playersCount and removes user id from assignedUser (if only one -> null)
        const filteredAssignedUsers: string[] = game.assignedUsers.filter(
          (assignedUser) => assignedUser !== userPk
        );

        // Deletes partialUser assigned to game
        await deleteItem(game.pk, userPk);
        // Deletes partialGame assigned to user
        await deleteItem(userPk, game.pk);
        // Removes userPk from assignedUsers on game
        await storeItem({
          ...game,
          playersCount: game.playersCount - 1,
          assignedUsers:
            filteredAssignedUsers.length === 0 ? null : filteredAssignedUsers, // (if nothing left -> null)
        });
        // Get partialGame assigned to group and change playersCount
        const partialGameAssignedToGroup: PartialGame = await getItem(
          game.groupId,
          game.pk
        );
        await storeItem({
          ...partialGameAssignedToGroup,
          playersCount: partialGameAssignedToGroup.playersCount - 1,
        });
      }
    }
  }
};
