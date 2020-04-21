import { Token } from "@app/auth";

/**
 * Returns mocked Token object
 * @function
 * @returns {Token}
 */
export const mockToken = (): Token => {
  return {
    pk: "id",
    sk: "id",
    userId: "id",
  };
};
