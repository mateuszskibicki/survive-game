import { dynamoDb } from "@app/aws";
import { Model } from "@app/common";

/**
 * Saves single item
 * @param {Model} item
 * @return {void}
 */
export const storeItem = async (item: Model): Promise<void> => {
  await dynamoDb()
    .put({
      TableName: process.env.DYNAMODB_TABLE,
      Item: item,
    })
    .promise();
};
