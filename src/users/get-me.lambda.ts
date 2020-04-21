import { lambda } from "@app/core";
import { response, LambdaResponse, EntityTypes } from "@app/common";
import { APIGatewayEvent } from "aws-lambda";
import { User } from "./interfaces";
import { PartialGame } from "@app/games";
import { queryItems } from "@app/database";
import { PartialGroup } from "@app/groups";

/**
 * Endpoint that fetches information about logged in user
 * @method GET
 * @param {APIGatewayEvent} event
 * @return {LambdaResponse}
 */

export const getMeHandler = lambda(
  {
    name: "Get Me Lambda",
    protected: true,
  },
  async (_event: APIGatewayEvent, user: User): Promise<LambdaResponse> => {
    // Get groups assigned to user
    const groups: PartialGroup[] = await queryItems(user.pk, EntityTypes.group);

    // Get games assigned to user
    const games: PartialGame[] = await queryItems(user.pk, EntityTypes.game);

    return response({ user, groups, games }, 200);
  }
);
