import FB from "fb";
import { FBAuthResponse } from "../interfaces";

/**
 * Get Facebook credentials based on accessToken
 * @param {string} accessToken
 * @return {FBAuthResponse}
 */
export const getFacebookCredentials = async (
  accessToken: string
): Promise<FBAuthResponse> => {
  const fbApp = FB.extend({
    appId: process.env.FB_APP_ID,
    appSecret: process.env.FB_APP_SECRET,
  });

  fbApp.options({
    accessToken,
  });

  const fbResponse: FBAuthResponse = await fbApp.api("/me", {
    fields: "id,name,picture.type(large)",
  });

  // Return fb response
  return fbResponse;
};
