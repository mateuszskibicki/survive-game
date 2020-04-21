import * as SNS from "aws-sdk/clients/sns";

let client: SNS;

/**
 * Returns new aws-sdk SNS object
 * @return {SNS}
 */
export function sns(): SNS {
  if (!client) {
    client = new SNS({ region: "eu-west-2" });
  }
  return client;
}
