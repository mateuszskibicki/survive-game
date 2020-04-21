/**
 * Interface for updateGeneralStats function params
 * @interface
 * @property {number} games
 * @property {number} groups
 * @property {number} users
 */
export interface UpdateGeneralStatsParams {
  users?: boolean;
  groups?: boolean;
  games?: boolean;
}
