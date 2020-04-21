import { lambda } from "@app/core";
import { response, LambdaResponse, NotFoundError } from "@app/common";
import { APIGatewayEvent } from "aws-lambda";
import { getItem } from "@app/database";

/**
 * Endpoint that fetches user by id
 * @method GET
 * @param {APIGatewayEvent} event
 * @throws {NotFoundError}
 * @return {LambdaResponse}
 */

export const getUserByIdHandler = lambda(
  {
    name: "Get User By Id Lambda",
    protected: true,
  },
  async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    // Get id from pathParameters
    const id: string = event.pathParameters.id;

    const user = await getItem(id, id);

    if (!user) throw new NotFoundError();

    return response({ user }, 200);
  }
);
