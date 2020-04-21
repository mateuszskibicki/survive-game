/**
 * Interface for create-game lambda payload
 * @interface
 * @property {string} name
 * @property {string} groupId
 * @property {string} gameType
 * @property {string} gameTypeId
 * @property {number} playersLimit
 * @property {string} gameTime - ISO 8601
 */
export interface CreateGamePayload {
  name: string;
  groupId: string;
  gameType: string;
  gameTypeId: string;
  playersLimit: number;
  gameTime: string;
}
