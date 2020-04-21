import { LambdaResponseHeaders } from "../types";

/**
 * Interface represents a response
 * @interface
 * @property {body} string
 * @property {number} statusCode
 * @property {LambdaResponseHeaders} object
 */
export interface LambdaResponse {
  body: string;
  statusCode: number;
  headers: LambdaResponseHeaders;
}
