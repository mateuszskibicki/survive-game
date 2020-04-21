import { EntityTypes } from "@app/common";
import { User } from "@app/users";
import { FBAuthResponse, Token } from "../interfaces";
import { getFacebookCredentials } from "./get-facebook-credentials.function";
import { storeItem, getItem } from "@app/database";
import { updateGeneralStats } from "@app/stats";

/**
 * This is login function, get accessToken from fb, check if exists in db,
 * add user or receive user from db,
 * and pass back user info when needed
 * FB accessToken is stored in dynamoDB against user_id
 * @param {string} accessToken
 * @return {User}
 */
export const loginClient = async (accessToken: string): Promise<User> => {
  // Get token
  const tokenResponse: Token = await getItem(
    `${EntityTypes.token}_${accessToken}`,
    `${EntityTypes.token}_${accessToken}`
  );

  // If there is no token (can be refresh new access token) or id, get from FB auth
  if (!tokenResponse) {
    // This is checking if credentials are valid and getting them from facebook
    const fbCreds: FBAuthResponse = await getFacebookCredentials(accessToken);

    // Fetch user with user_fbId
    const userRes: User = await getItem(
      `${EntityTypes.user}_${fbCreds.id}`,
      `${EntityTypes.user}_${fbCreds.id}`
    );

    // New token
    const token: Token = {
      pk: `${EntityTypes.token}_${accessToken}`,
      sk: `${EntityTypes.token}_${accessToken}`,
      userId: `${EntityTypes.user}_${fbCreds.id}`,
    };

    // If exists, save new tokens and return User
    if (userRes) {
      // Save access token to DynamoDB
      await storeItem(token);
      // Return user credentials
      return userRes;
    }

    // If user does not exist, store new user
    const timestamp = new Date().toISOString();
    const newUser: User = {
      pk: `${EntityTypes.user}_${fbCreds.id}`,
      sk: `${EntityTypes.user}_${fbCreds.id}`,
      name: fbCreds.name,
      profilePhoto: fbCreds.picture.data.url,
      gamesPlayed: 0,
      lostGames: 0,
      wonGames: 0,
      diedTimes: 0,
      survivedTimes: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Save user to DynamoDB
    await storeItem(newUser);

    // Save access token to DynamoDB
    await storeItem(token);

    // Update users count on general stats
    await updateGeneralStats({ users: true });

    // Return new user
    return newUser;
  }

  // If user exists, get one by id and return
  const userRes: User = await getItem(
    tokenResponse.userId,
    tokenResponse.userId
  );

  return userRes;
};
