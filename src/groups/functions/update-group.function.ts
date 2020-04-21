import { dynamoDb } from "@app/aws";
import { UpdateGroupPayload, Group } from "../interfaces";

/**
 * Create single group
 * @param {string} id
 * @param {UpdateGroupPayload} payload
 * @return {Group}
 */

export const updateGroup = async (
  id: string,
  payload: UpdateGroupPayload
): Promise<Group> => {
  // ISO 8601 date timestamp
  const timestamp: string = new Date().toISOString();

  // Save group
  const { Attributes } = await dynamoDb()
    .update({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { pk: id, sk: id },
      ExpressionAttributeNames: {
        "#NAME": "name",
        "#UPDATEDAT": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":name": payload.name,
        ":updatedAt": timestamp,
      },
      UpdateExpression: `
      set #NAME = :name,
      #UPDATEDAT = :updatedAt`,
      ReturnValues: "ALL_NEW",
    })
    .promise();

  // Return new group
  return Attributes as Group;
};
