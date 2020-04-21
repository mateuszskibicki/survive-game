import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { User } from "@app/users";
import { getItem } from "@app/database";

/**
 * Function verifies JWT token,
 * Fetches user data and returns it if exists
 * @param {string} token
 * @throws {JsonWebTokenError}
 * @return {string}
 */
export const verifyJWT = async (token: string): Promise<User> => {
  const publicKey: string = process.env.PUBLIC_AUTH_KEY;

  const verifyOptions = {
    issuer: "App name here",
    expiresIn: "1y",
    algorithm: ["RS256"],
  };

  const jwtDecoded = jwt.verify(token, publicKey, verifyOptions);

  const user: User = await getItem(jwtDecoded.pk, jwtDecoded.sk);

  if (!user) throw new JsonWebTokenError();

  return user;
};
