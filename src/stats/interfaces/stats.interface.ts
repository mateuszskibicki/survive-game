import { EntityTypes } from "@app/common";
/**
 * Interface for general Stats
 * @interface
 * @property {EntityTypes.stats} pk
 * @property {EntityTypes.stats} sk
 * @property {number} games
 * @property {number} groups
 * @property {number} users
 */
export interface Stats {
  pk: EntityTypes.stats;
  sk: EntityTypes.stats;
  games: number;
  groups: number;
  users: number;
}
