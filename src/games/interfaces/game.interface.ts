import { GameStatus } from "../enum";
/**
 * Interface for Game model
 * @interface
 * @property {string} pk
 * @property {string} sk
 * @property {string} adminId
 * @property {string} groupId
 * @property {string} gameType
 * @property {string} gameTypeId
 * @property {number} playersLimit
 * @property {number} playersCount
 * @property {string[] | null} assignedUsers
 * @property {GameStatus} status
 * @property {string} gameTime - ISO 8601
 * @property {string} createdAt - ISO 8601
 * @property {string} updatedAt - ISO 8601
 */
export interface Game {
  pk: string;
  sk: string;
  adminId: string;
  groupId: string;
  gameTime: string;
  gameType: string;
  gameTypeId: string;
  playersLimit: number;
  playersCount: number;
  assignedUsers: string[] | null;
  status: GameStatus;
  createdAt: string;
  updatedAt: string;
}
