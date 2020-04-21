/**
 * Interface for PartialGroup stored against game and user
 * @interface
 * @property {string} pk
 * @property {string} sk
 * @property {string} adminId
 * @property {string} name
 * @property {string} createdAt - ISO 8601
 * @property {string} updatedAt - ISO 8601
 */
export interface PartialGroup {
  pk: string;
  sk: string;
  adminId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
