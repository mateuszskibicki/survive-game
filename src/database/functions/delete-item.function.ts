import { dynamoDb } from "@app/aws";

/**
 * Delete single item by pk/sk
 * @param {string} pk
 * @param {string} sk
 * @return {void}
 */
export const deleteItem = async (pk: string, sk: string): Promise<void> => {
  // Delete item
  await dynamoDb()
    .delete({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk,
        sk,
      },
    })
    .promise();
};
