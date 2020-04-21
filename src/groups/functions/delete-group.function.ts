import { dynamoDb } from "@app/aws";

/**
 * Delete group by id
 * @param {string} id
 * @return {void}
 */
export const deleteGroup = async (id: string): Promise<void> => {
  // Remove group
  await dynamoDb()
    .delete({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: id,
        sk: id,
      },
    })
    .promise();
};
