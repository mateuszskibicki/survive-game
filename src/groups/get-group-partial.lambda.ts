import { APIGatewayEvent } from "aws-lambda";
import { lambda } from "@app/core";
import { response, LambdaResponse, NotFoundError } from "@app/common";
import { Group } from "./interfaces";
import { getItem } from "@app/database";
import { User } from "@app/users";

/**
 * Endpoint that fetches group by id
 * @method GET
 * @param {APIGatewayEvent} event
 * @param {User} user
 * @throws {NotFoundError}
 * @throws {UnauthorizedError}
 * @return {LambdaResponse}
 */

export const getGroupPartialHandler = lambda(
  {
    name: "Get Group Partial By Id Lambda",
    protected: false,
  },
  async (event: APIGatewayEvent, _user: User): Promise<LambdaResponse> => {
    // Get id from pathParameters
    const id: string = event.pathParameters.id;

    // Get group by id
    const group: Group = await getItem(id, id);

    if (!group) throw new NotFoundError();

    // Return success response with group
    return response({ group }, 200);
  }
);
