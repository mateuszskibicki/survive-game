import { APIGatewayEvent } from "aws-lambda";
import { lambda } from "@app/core";
import {
  response,
  LambdaResponse,
  NotFoundError,
  ForbiddenError,
} from "@app/common";
import { Group, PartialGroup } from "./interfaces";
import { getItem, storeItem } from "@app/database";
import { PartialUser, User } from "@app/users";

/**
 * Endpoint to sign to group
 * @method POST
 * @param {APIGatewayEvent} event
 * @param {User} user
 * @throws {NotFoundError}
 * @throws {ForbiddenError}
 * @return {LambdaResponse}
 */

export const signToGroupHandler = lambda(
  {
    name: "Sign To Group Lambda",
    protected: true,
  },
  async (event: APIGatewayEvent, user: User): Promise<LambdaResponse> => {
    // Get id from pathParameters
    const id: string = event.pathParameters.id;

    // Get group by id
    const group: Group = await getItem(id, id);

    if (!group) throw new NotFoundError();

    // Check if game is already full
    if (group.usersCount >= group.usersLimit) throw new ForbiddenError();

    // Get PartialUser assigned to group, check if user is part of this group already
    if (await getItem(group.pk, user.pk)) throw new ForbiddenError();

    // New partial user
    // ISO 8601
    const time: string = new Date().toISOString();
    const partialUser: PartialUser = {
      pk: group.pk,
      sk: user.pk,
      name: user.name,
      profilePhoto: user.profilePhoto,
      createdAt: time,
      updatedAt: time,
    };

    // Store partial user against group
    await storeItem(partialUser);

    // New partial group
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

    // Update usersCount on group
    const updatedGroup: Group = {
      ...group,
      usersCount: group.usersCount + 1,
      updatedAt: time,
    };
    await storeItem(updatedGroup);

    // Return success response with group
    return response({ group: updatedGroup }, 200);
  }
);
