import { APIGatewayEvent } from "aws-lambda";
import { lambda } from "@app/core";
import {
  response,
  LambdaResponse,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} from "@app/common";
import { Game, PartialGame } from "./interfaces";
import { getItem, storeItem } from "@app/database";
import { PartialUser, User } from "@app/users";

/**
 * Endpoint to sign to game
 * @method POST
 * @param {APIGatewayEvent} event
 * @param {User} user
 * @throws {NotFoundError}
 * @throws {UnauthorizedError}
 * @throws {ForbiddenError}
 * @return {LambdaResponse}
 */

export const signToGameHandler = lambda(
  {
    name: "Sign To Game Lambda",
    protected: true,
  },
  async (event: APIGatewayEvent, user: User): Promise<LambdaResponse> => {
    // Get id from pathParameters
    const id: string = event.pathParameters.id;

    // Get game by id
    const game: Game = await getItem(id, id);

    if (!game) throw new NotFoundError();

    // Check if user is part of the group where game exists
    if (!(await getItem(game.groupId, user.pk))) throw new UnauthorizedError();

    // Check if game is already full
    if (game.playersCount >= game.playersLimit) throw new ForbiddenError();

    // Check if user is already signed to game
    if (await getItem(game.pk, user.pk)) throw new ForbiddenError();

    // New partial user
    // ISO 8601
    const time: string = new Date().toISOString();
    const partialUser: PartialUser = {
      pk: game.pk,
      sk: user.pk,
      name: user.name,
      profilePhoto: user.profilePhoto,
      createdAt: time,
      updatedAt: time,
    };

    // Store partial user against game
    await storeItem(partialUser);

    // New partial game assigned to user id
    const partialGame: PartialGame = {
      pk: user.pk,
      sk: game.pk,
      playersLimit: game.playersLimit,
      groupId: game.groupId,
      gameType: game.gameType,
      gameTypeId: game.gameTypeId,
      gameTime: game.gameType,
      status: game.status,
      createdAt: time,
      updatedAt: time,
    };
    // Store partial game against user
    await storeItem(partialGame);

    // Update playersCount on game
    const updatedGame: Game = {
      ...game,
      assignedUsers: game.assignedUsers
        ? [...game.assignedUsers, user.pk]
        : [user.pk],
      playersCount: game.playersCount + 1,
      updatedAt: time,
    };
    await storeItem(updatedGame);

    // Update playersCount on partialGame assigned to group
    const partialGameAssignedToGroup: PartialGame = await getItem(
      game.groupId,
      game.pk
    );
    await storeItem({
      ...partialGameAssignedToGroup,
      playersCount: partialGameAssignedToGroup.playersCount + 1,
    });

    // Return success response with game
    return response({ game: updatedGame }, 200);
  }
);
