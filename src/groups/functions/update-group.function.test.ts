import { dynamoDb } from "@app/aws";
import { updateGroup } from "./update-group.function";
import * as mockdate from "mockdate";
import { Group } from "../interfaces";
import { mockGroup } from "@app/mock/functions/mock-group.function";

describe("updateGroup", () => {
  const group: Group = mockGroup();

  beforeEach(() => {
    jest.spyOn(dynamoDb(), "update").mockImplementation(
      () =>
        ({
          promise: async (): Promise<any> => ({
            Attributes: group,
          }),
        } as any)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockdate.reset();
  });

  it("should be defined and a function", () => {
    expect(updateGroup).toBeDefined();
    expect(typeof updateGroup === "function").toBe(true);
  });

  it("should call dynamoDb.put with correct params", async () => {
    const spy = jest.spyOn(dynamoDb(), "update");
    mockdate.set("2020-05-06T12:00:00+0100");
    const timestamp = new Date("2020-05-06T12:00:00+0100").toISOString();

    await updateGroup("id", { name: "new name" });

    expect(spy).toHaveBeenCalledWith({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { pk: "id", sk: "id" },
      ExpressionAttributeNames: {
        "#NAME": "name",
        "#UPDATEDAT": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":name": "new name",
        ":updatedAt": timestamp,
      },
      UpdateExpression: expect.any(String),
      ReturnValues: "ALL_NEW",
    });

    mockdate.reset();
  });

  it("should return correct data", async () => {
    const res = await updateGroup("id", { name: "name" });

    expect(res).toEqual(expect.objectContaining(group));
  });
});
