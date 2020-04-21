import { publishSnsMessage } from "@app/database";
import { APIGatewayEvent } from "aws-lambda";
import { lambda } from "@app/core";
import {
  response,
  LambdaResponse,
  NotFoundError,
  ForbiddenError,
} from "@app/common";
import { Group } from "./interfaces";
import { getItem, deleteItem } from "@app/database";
import { User } from "@app/users";
import { LeaveGroupSnsMessageBody } from "./interfaces/leave-group-sns-message-body.interface";

/**
 * Endpoint to sign to group
 * @method POST
 * @param {APIGatewayEvent} event
 * @param {User} user
 * @throws {NotFoundError}
 * @throws {ForbiddenError}
 * @return {LambdaResponse}
 */

export const leaveGroupHandler = lambda(
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

    // Get PartialUser assigned to group, check if user is part of this group
    if (!(await getItem(group.pk, user.pk))) throw new ForbiddenError();

    // Remove partial group assigned to user and user assigned to group
    await deleteItem(user.pk, group.pk);

    // SNS Message Payload
    const messagePayload: LeaveGroupSnsMessageBody = {
      groupPk: group.pk,
      userPk: user.pk,
    };

    // Publish sns message
    await publishSnsMessage(
      process.env.SNS_TOPIC_LEAVE_GROUP,
      JSON.stringify(messagePayload)
    );

    // Return success response with group
    return response({}, 204);
  }
);
