import { dynamoDb } from "@app/aws";

/**
 * Get single item by pk/sk
 * Can find User|Game|Group|Token
 * @param {string} pk
 * @param {string} sk
 * @return {any}
 */
export const getItem = async (pk: string, sk: string): Promise<any> => {
  // Get item
  const { Item } = await dynamoDb()
    .get({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk,
        sk,
      },
    })
    .promise();

  return Item;
};
