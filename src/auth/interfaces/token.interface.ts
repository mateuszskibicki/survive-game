/**
 * Interface for access token stored in DynamoDB against userId
 * @interface
 * @property {string} pk
 * @property {string} sk
 * @property {string} userId
 */
export interface Token {
  pk: string;
  sk: string;
  userId: string;
}
