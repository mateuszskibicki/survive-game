/**
 * Interface for PartialUser stored against group and game
 * @interface
 * @property {string} pk
 * @property {string} sk
 * @property {string} name
 * @property {string} profilePhoto
 * @property {string} createdAt - ISO 8601
 * @property {string} updatedAt - ISO 8601
 */
export interface PartialUser {
  pk: string;
  sk: string;
  name: string;
  profilePhoto: string;
  createdAt: string;
  updatedAt: string;
}
