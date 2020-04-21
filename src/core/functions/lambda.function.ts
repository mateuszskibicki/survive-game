import { APIGatewayEvent } from "aws-lambda";
import { LambdaOptions } from "../interfaces";
import { verifyJWT } from "@app/auth/functions/verify-jwt.function";
import { FacebookApiException } from "fb";
import "source-map-support/register";
import { StructError } from "superstruct";
import { JsonWebTokenError } from "jsonwebtoken";
import {
  LambdaResponse,
  response,
  NotFoundError,
  ErrorMessages,
  ErrorStatuses,
  ErrorTypes,
  UnauthorizedError,
} from "@app/common";
import { Lambda } from "../interfaces";
import { User } from "@app/users";
import { ForbiddenError } from "@app/common/errors/forbidden.error";

/**
 * Common functionality and error handling for all lambda handlers
 * @param {Lambda} fn
 * @return {LambdaResponse}
 */
export function lambda(
  options: LambdaOptions,
  fn: Lambda<APIGatewayEvent, LambdaResponse>
): Lambda<APIGatewayEvent, LambdaResponse> {
  return async (
    event?: APIGatewayEvent,
    user?: User
    // ctx?: Context
  ): Promise<LambdaResponse> => {
    try {
      // Check if protected and token is provided
      if (process.env.NODE_ENV !== "test" && options.protected) {
        const token = event?.headers?.Authorization?.split("Bearer ")[1];
        if (!token) throw new JsonWebTokenError();
        const user = await verifyJWT(token);
        return await fn(event, user);
      }
      // For jest testing if User is provided
      if (process.env.NODE_ENV === "test" && options.protected) {
        return await fn(event, user);
      }
      //Run lambda
      return await fn(event);
    } catch (err) {
      console.log(err);

      switch (err.constructor) {
        case JsonWebTokenError:
          return response(
            {
              error: ErrorTypes.unauthorized,
              error_description: ErrorMessages.unauthorized,
            },
            ErrorStatuses.unauthorized
          );

        case FacebookApiException:
          return response(
            {
              error: ErrorTypes.unauthorized,
              error_description: ErrorMessages.unauthorized,
            },
            ErrorStatuses.unauthorized
          );

        case UnauthorizedError:
          return response(
            {
              error: ErrorTypes.unauthorized,
              error_description: ErrorMessages.unauthorized,
            },
            ErrorStatuses.unauthorized
          );

        case ForbiddenError:
          return response(
            {
              error: ErrorTypes.forbidden,
              error_description: ErrorMessages.forbidden,
            },
            ErrorStatuses.forbidden
          );

        case StructError:
          return response(
            {
              error: ErrorTypes.invalid_request,
              error_description: ErrorMessages.invalid_request,
            },
            ErrorStatuses.invalid_request
          );

        case NotFoundError:
          return response(
            {
              error: ErrorTypes.not_found,
              error_description: ErrorMessages.not_found,
            },
            ErrorStatuses.not_found
          );

        default: {
          return response(
            {
              error: ErrorTypes.unexpected_error,
              error_description: ErrorMessages.unexpected_error,
            },
            ErrorStatuses.unexpected_error
          );
        }
      }
    }
  };
}
