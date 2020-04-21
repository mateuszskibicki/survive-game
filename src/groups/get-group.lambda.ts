import { APIGatewayEvent } from "aws-lambda";
import { lambda } from "@app/core";
import {
  response,
  LambdaResponse,
  NotFoundError,
  UnauthorizedError,
  EntityTypes,
} from "@app/common";
import { Group } from "./interfaces";
import { getItem, queryItems } from "@app/database";
import { User, PartialUser } from "@app/users";
import { PartialGame } from "@app/games";

/**
 * Endpoint that fetches group by id
 * @method GET
 * @param {APIGatewayEvent} event
 * @param {User} user
 * @throws {NotFoundError}
 * @throws {UnauthorizedError}
 * @return {LambdaResponse}
 */

export const getGroupHandler = lambda(
  {
    name: "Get Group By Id Lambda",
    protected: true,
  },
  async (event: APIGatewayEvent, user: User): Promise<LambdaResponse> => {
    // Get id from pathParameters
    const id: string = event.pathParameters.id;

    // Get group by id
    const group: Group = await getItem(id, id);

    if (!group) throw new NotFoundError();

    // Get PartialUser assigned to group, check if user is part of this group
    if (!(await getItem(group.pk, user.pk))) throw new UnauthorizedError();

    // Get users assigned to group
    const users: PartialUser[] = await queryItems(group.pk, EntityTypes.user);

    // Get games assigned to group
    const games: PartialGame[] = await queryItems(group.pk, EntityTypes.game);

    // Return success response with group
    return response({ group, users, games }, 200);
  }
);
