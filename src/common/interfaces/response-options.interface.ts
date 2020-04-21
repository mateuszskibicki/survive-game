import { LambdaResponseHeaders } from "../types/lambda-response-headers.type";

/**
 * Interface represents an options object (3rd param) in response function
 * @interface
 * @property {?LambdaResponseHeaders} headers
 */
export interface ResponseOptions {
  headers?: LambdaResponseHeaders;
}
