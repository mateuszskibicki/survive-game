import { APIGatewayEvent } from "aws-lambda";
import { lambda } from "@app/core";
import { response, LambdaResponse, EntityTypes } from "@app/common";
import { Stats } from "./interfaces";
import { getItem } from "@app/database";

/**
 * Endpoint that fetches general stats
 * @method GET
 * @param {APIGatewayEvent} event
 * @return {LambdaResponse}
 */

export const getStatsHandler = lambda(
  {
    name: "Get Stats By Id Lambda",
    protected: true,
  },
  async (_event: APIGatewayEvent): Promise<LambdaResponse> => {
    // Get stats
    const stats: Stats = await getItem(EntityTypes.stats, EntityTypes.stats);

    // Return success response with stats
    return response({ stats }, 200);
  }
);
