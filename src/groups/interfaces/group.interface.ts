/**
 * Interface for Group model
 * @interface
 * @property {string} pk
 * @property {string} sk
 * @property {string} adminId
 * @property {string} name
 * @property {number} upcomingGames
 * @property {number} gamesPlayed
 * @property {number} usersCount
 * @property {number} usersLimit
 * @property {string} createdAt - ISO 8601
 * @property {string} updatedAt - ISO 8601
 */
export interface Group {
  pk: string;
  sk: string;
  adminId: string;
  name: string;
  upcomingGames: number;
  gamesPlayed: number;
  usersCount: number;
  usersLimit: number;
  createdAt: string;
  updatedAt: string;
}
