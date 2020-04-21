import { EntityTypes } from "@app/common";
import { Stats } from "@app/stats";

/**
 * Returns mocked Stats object
 * @returns {Stats}
 */
export const mockStats = (): Stats => {
  return {
    pk: EntityTypes.stats,
    sk: EntityTypes.stats,
    users: 10,
    groups: 3,
    games: 50,
  };
};
