import { User } from "@app/users";

/**
 * Interface for lambda event <T> and return value <U>
 * @function
 * @template T
 * @template U
 * @property {T} event - lambda name
 * @property {?User} user - is protected, checks for JWT
 * @returns {Promise<U>} - Promise<U>
 */
export interface Lambda<T, U> {
  (event?: T, user?: User): Promise<U>;
}
