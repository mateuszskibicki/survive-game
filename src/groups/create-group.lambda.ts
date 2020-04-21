import { APIGatewayEvent } from "aws-lambda";
import { lambda } from "@app/core";
import { response, LambdaResponse, EntityTypes } from "@app/common";
import { parsePayloadCreateGroup } from "./functions";
import { CreateGroupPayload, Group, PartialGroup } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import { storeItem } from "@app/database";
import { User, PartialUser } from "@app/users";
import { updateGeneralStats } from "@app/stats";

/**
 * Endpoint that creates new group
 * @method POST
 * @param {APIGatewayEvent} event
 * @return {LambdaResponse}
 */
export const createGroupHandler = lambda(
  {
    name: "Create New Group Lambda",
    protected: true,
  },
  async (event: APIGatewayEvent, user: User): Promise<LambdaResponse> => {
    // Validate request
    const payload: CreateGroupPayload = parsePayloadCreateGroup(
      JSON.parse(event.body)
    );

    // uuidv4 for group
    const uuid: string = uuidv4();
    // ISO 8601
    const time: string = new Date().toISOString();
    // New group object
    const group: Group = {
      pk: `${EntityTypes.group}_${uuid}`,
      sk: `${EntityTypes.group}_${uuid}`,
      adminId: user.pk,
      name: payload.name,
      usersCount: 1,
      upcomingGames: 0,
      gamesPlayed: 0,
      usersLimit: 16,
      createdAt: time,
      updatedAt: time,
    };

    // Store group
    await storeItem(group);

    // New partial user (admin)
    const partialUser: PartialUser = {
      pk: group.pk,
      sk: user.pk,
      name: user.name,
      profilePhoto: user.profilePhoto,
      createdAt: time,
      updatedAt: time,
    };

    // Store partial user(admin) against group
    await storeItem(partialUser);

    // New partial group (admin is a part of group)
    const partialGroup: PartialGroup = {
      pk: user.pk,
      sk: group.pk,
      adminId: user.pk,
      name: group.name,
      createdAt: time,
      updatedAt: time,
    };

    // Store partial group against user
    await storeItem(partialGroup);

    // Update groups count on general stats
    await updateGeneralStats({ groups: true });

    // Return success response
    return response({ group, games: [] }, 201);
  }
);
