/**
 * Interface for User model
 * @interface
 * @property {string} pk
 * @property {string} sk
 * @property {string} name
 * @property {string} profilePhoto
 * @property {number} gamesPlayed
 * @property {number} wonGames
 * @property {number} lostGames
 * @property {number} diedTimes
 * @property {number} survivedTimes
 * @property {?string} email
 * @property {string} createdAt - ISO 8601
 * @property {string} updatedAt - ISO 8601
 */
export interface User {
  pk: string;
  sk: string;
  name: string;
  profilePhoto: string;
  gamesPlayed: number;
  wonGames: number;
  lostGames: number;
  diedTimes: number;
  survivedTimes: number;
  email?: string;
  createdAt: string;
  updatedAt: string;
}
