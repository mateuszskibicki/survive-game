import { User } from "@app/users";
import jwt from "jsonwebtoken";
/**
 * Function generates JWT
 * @param {User} user
 * @return {string}
 */
export const generateJWT = (user: User): string => {
  // SIGNING OPTIONS
  /**
   * @todo - change issuer name
   */
  const signOptions = {
    issuer: "survive-game",
    expiresIn: "1y",
    algorithm: "RS256",
  };

  const token: string = jwt.sign(
    {
      pk: user.pk,
      sk: user.sk,
      name: user.name,
      profilePhoto: user.profilePhoto,
    },
    process.env.PRIVATE_AUTH_KEY,
    signOptions
  );

  return token;
};
