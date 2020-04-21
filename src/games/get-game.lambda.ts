import { APIGatewayEvent } from "aws-lambda";
import { lambda } from "@app/core";
import {
  response,
  LambdaResponse,
  NotFoundError,
  UnauthorizedError,
  EntityTypes,
} from "@app/common";
import { Game } from "./interfaces";
import { getItem, queryItems } from "@app/database";
import { User, PartialUser } from "@app/users";

/**
 * Endpoint that fetches game by id
 * @method GET
 * @param {APIGatewayEvent} event
 * @param {User} user
 * @throws {NotFoundError}
 * @throws {UnauthorizedError}
 * @return {LambdaResponse}
 */

export const getGameHandler = lambda(
  {
    name: "Get Game By Id Lambda",
    protected: true,
  },
  async (event: APIGatewayEvent, user: User): Promise<LambdaResponse> => {
    // Get id from pathParameters
    const id: string = event.pathParameters.id;

    // Get game by id
    const game: Game = await getItem(id, id);

    if (!game) throw new NotFoundError();

    // Get PartialUser assigned to group, check if user is part of group where this game exists
    if (!(await getItem(game.groupId, user.pk))) throw new UnauthorizedError();

    // Get users assigned to game
    const users: PartialUser[] = await queryItems(game.pk, EntityTypes.user);

    // Return success response with game
    return response({ game, users }, 200);
  }
);
