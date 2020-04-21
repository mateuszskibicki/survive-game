import { GameStatus } from "../enum";

/**
 * Interface for PartialGame model
 * @interface
 * @property {string} pk
 * @property {string} sk
 * @property {number} playersLimit
 * @property {?number} playersCount used only on group records to keep track of players in game, not on single users record
 * @property {string} groupId
 * @property {string} gameType
 * @property {string} gameTypeId
 * @property {string} gameTime - ISO 8601
 * @property {GameStatus} status
 * @property {string} createdAt - ISO 8601
 * @property {string} updatedAt - ISO 8601
 */
export interface PartialGame {
  pk: string;
  sk: string;
  playersLimit: number;
  playersCount?: number;
  groupId: string;
  gameType: string;
  gameTypeId: string;
  gameTime: string;
  status: GameStatus;
  createdAt: string;
  updatedAt: string;
}
