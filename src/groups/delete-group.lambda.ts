import { lambda } from "@app/core";
import { response, LambdaResponse } from "@app/common";
import { APIGatewayEvent } from "aws-lambda";
import { deleteGroup } from "./functions";

/**
 * Endpoint that delete group and all records kept against the group
 * @method DELETE
 * @param {APIGatewayEvent} event
 * @return {LambdaResponse}
 */
export const deleteGroupHandler = lambda(
  {
    name: "Delete Group Lambda",
    protected: true,
  },
  async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    // Get id from pathParameters
    const id: string = event.pathParameters.id;

    // Delete group
    await deleteGroup(id);

    // ON HOLD

    // removes all games assigned to group
    // removes all partial games assigned to group
    // revmoes all partial users assigned to group

    // removes all partial users assigned to removed games
    // removes all partial users assigned to removed games

    // Return success response
    return response({}, 204);
  }
);
