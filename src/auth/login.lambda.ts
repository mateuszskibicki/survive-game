import { lambda } from "@app/core";
import { response, LambdaResponse } from "@app/common";
import { APIGatewayEvent } from "aws-lambda";
import { loginClient, generateJWT } from "./functions";
import { User } from "@app/users";

/**
 * Endpoint that fetches user by id
 * @method POST
 * @param {APIGatewayEvent} event
 * @return {LambdaResponse}
 */
export const loginHandler = lambda(
  {
    name: "Login Lambda",
  },
  async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    const accessToken = event.headers["Authorization"];

    const user: User = await loginClient(accessToken.split("Bearer ")[1]);

    const token = generateJWT(user);

    return response({ token }, 200);
  }
);
