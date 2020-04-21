import { lambda } from "@app/core";
import { response, LambdaResponse, NotFoundError } from "@app/common";
import { APIGatewayEvent } from "aws-lambda";
import { parsePayloadUpdateGroup, updateGroup } from "./functions";
import { UpdateGroupPayload, Group } from "./interfaces";
import { getItem } from "@app/database";

/**
 * Endpoint that updates group
 * @method PUT
 * @param {APIGatewayEvent} event
 * @throws {NotFoundError}
 * @return {LambdaResponse}
 */
export const updateGroupHandler = lambda(
  {
    name: "Update Group Lambda",
    protected: true,
  },
  async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    // Validate request
    const payload: UpdateGroupPayload = parsePayloadUpdateGroup(
      JSON.parse(event.body)
    );

    // Get id from pathParameters
    const id: string = event.pathParameters.id;

    // Check if group exists
    if (!(await getItem(id, id))) throw new NotFoundError();

    // Create group
    const updatedGroup: Group = await updateGroup(id, payload);

    // Return success response
    return response({ group: updatedGroup }, 200);
  }
);
