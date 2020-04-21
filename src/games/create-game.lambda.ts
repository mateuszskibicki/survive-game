import { APIGatewayEvent } from "aws-lambda";
import { lambda } from "@app/core";
import {
  response,
  LambdaResponse,
  EntityTypes,
  NotFoundError,
  UnauthorizedError,
} from "@app/common";
import { parsePayloadCreateGame } from "./functions";
import { CreateGamePayload, Game, PartialGame } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import { User } from "@app/users";
import { storeItem, getItem } from "@app/database";
import { GameStatus } from "./enum";
import { Group } from "@app/groups";
import { updateGeneralStats } from "@app/stats";
/**
 * Endpoint that creates new group
 * @method POST
 * @param {APIGatewayEvent} event
 * @param {User} user
 * @throws {NotFoundError}
 * @throws {UnauthorizedError}
 * @return {LambdaResponse}
 */
export const createGameHandler = lambda(
  {
    name: "Create New Game Lambda",
    protected: true,
  },
  async (event: APIGatewayEvent, user: User): Promise<LambdaResponse> => {
    // Validate request
    const payload: CreateGamePayload = parsePayloadCreateGame(
      JSON.parse(event.body)
    );

    // Get Group
    const group: Group = await getItem(payload.groupId, payload.groupId);

    if (!group) throw new NotFoundError();

    // Check if user is an admin
    if (group.adminId !== user.pk) throw new UnauthorizedError();

    // uuidv4 for game
    const uuid: string = uuidv4();
    // ISO 8601
    const time: string = new Date().toISOString();
    // New game object
    const game: Game = {
      pk: `${EntityTypes.game}_${uuid}`,
      sk: `${EntityTypes.game}_${uuid}`,
      gameType: payload.gameType,
      gameTypeId: payload.gameTypeId,
      playersLimit: payload.playersLimit,
      playersCount: 0,
      assignedUsers: null,
      status: GameStatus.awaiting,
      adminId: user.pk,
      groupId: payload.groupId,
      gameTime: payload.gameTime,
      createdAt: time,
      updatedAt: time,
    };

    // Store game
    await storeItem(game);

    // Store partial game against group
    const partialGame: PartialGame = {
      pk: group.pk,
      sk: `${EntityTypes.game}_${uuid}`,
      groupId: group.pk,
      gameType: payload.gameType,
      gameTypeId: payload.gameTypeId,
      playersCount: 0,
      playersLimit: payload.playersLimit,
      gameTime: payload.gameTime,
      status: GameStatus.awaiting,
      createdAt: time,
      updatedAt: time,
    };
    await storeItem(partialGame);

    // Update group with more upcoming games
    await storeItem({ ...group, upcomingGames: group.upcomingGames + 1 });

    // Update games count on general stats
    await updateGeneralStats({ games: true });

    // Return success response
    return response({ game }, 201);
  }
);
