import * as DynamoDB from "aws-sdk/clients/dynamodb";

let client: DynamoDB.DocumentClient;

/**
 * Returns new aws-sdk DynamoDb.DocumentClient object
 * @return {DynamoDb.DocumentClient}
 */
export function dynamoDb(): DynamoDB.DocumentClient {
  if (!client) {
    client = new DynamoDB.DocumentClient({
      region: "eu-west-2",
    });
  }

  return client;
}
