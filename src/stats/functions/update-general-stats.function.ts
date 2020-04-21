import { EntityTypes } from "@app/common";
import { getItem, storeItem } from "@app/database";
import { Stats, UpdateGeneralStatsParams } from "../interfaces";

/**
 * Function to update all general stats (existing or new)
 * @param {UpdateGeneralStatsParams} statsToUpdate
 * @return {Promise<void>}
 */
export const updateGeneralStats = async (
  statsToUpdate: UpdateGeneralStatsParams
): Promise<void> => {
  // Get general stats
  const generalStats: Stats = await getItem(
    EntityTypes.stats,
    EntityTypes.stats
  );

  if (!generalStats) {
    // I assume the first general stats should be created when user is created but who knows what will happen so it will try to get all possible data
    const newGeneralStats: Stats = {
      pk: EntityTypes.stats,
      sk: EntityTypes.stats,
      users: statsToUpdate.users ? 1 : 0,
      groups: statsToUpdate.groups ? 1 : 0,
      games: statsToUpdate.games ? 1 : 0,
    };

    // Store new stats, only once
    await storeItem(newGeneralStats);
  }

  // Update existing stats
  await storeItem({
    pk: EntityTypes.stats,
    sk: EntityTypes.stats,
    users: statsToUpdate.users ? generalStats.users + 1 : generalStats.users,
    groups: statsToUpdate.groups
      ? generalStats.groups + 1
      : generalStats.groups,
    games: statsToUpdate.games ? generalStats.games + 1 : generalStats.games,
  });
};
