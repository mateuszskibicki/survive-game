/**
 * Enum for error messages
 * @enum
 */
export enum ErrorMessages {
  invalid_request = "Parsing error, may be a wrong body request - StructError.",
  unexpected_error = "An unexpected error occurred.",
  forbidden = "Forbidden - action not allowed.",
  not_found = "Not found error - NotFound.",
  unauthorized = "Unauthorized.",
}
