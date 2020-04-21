import { LambdaResponse, ResponseOptions } from "../interfaces";
import { LambdaResponseHeaders } from "../types";

/**
 * Lambda response object
 * @param {object} data
 * @param {number} statusCode
 * @param {ResponseOptions} options
 * @returns {LambdaResponse}
 */
export function response(
  data: object,
  statusCode: number,
  options?: ResponseOptions
): LambdaResponse {
  const res: LambdaResponse = {
    body: JSON.stringify(data),
    statusCode,
    headers: {},
  };

  // Attach headers to response
  if (options && options.headers)
    res.headers = options.headers as LambdaResponseHeaders;

  // Return response
  return res;
}
