import { EntityTypes } from "@app/common";
import { dynamoDb } from "@app/aws";

/**
 * Get many items by pk and BEGINS_WITH
 * Can find Model
 * @param {string} pk
 * @param {EntityTypes} beginsWith
 * @return {any}
 */
export const queryItems = async (
  pk: string,
  beginsWith: EntityTypes
): Promise<any> => {
  // Get item
  const { Items } = await dynamoDb()
    .query({
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression: "pk = :PK and begins_with(sk,:SK)",
      ExpressionAttributeValues: {
        ":PK": pk,
        ":SK": beginsWith,
      },
    })
    .promise();

  return Items;
};
