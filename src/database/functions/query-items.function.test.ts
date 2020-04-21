import { queryItems } from "./query-items.function";
import { dynamoDb } from "@app/aws";
import { EntityTypes } from "@app/common";

describe("queryItems", () => {
  beforeEach(() => {
    jest.spyOn(dynamoDb(), "query").mockImplementation(
      () =>
        ({
          promise: async (): Promise<any> => ({
            Items: [{ pk: "pk" }],
          }),
        } as any)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined and a function", () => {
    expect(queryItems).toBeDefined();
    expect(typeof queryItems === "function").toBe(true);
  });

  it("should call dynamoDb.query with correct params", async () => {
    const spy = jest.spyOn(dynamoDb(), "query");

    await queryItems("pk", EntityTypes.game);

    expect(spy).toHaveBeenCalledWith({
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression: "pk = :PK and begins_with(sk,:SK)",
      ExpressionAttributeValues: {
        ":PK": "pk",
        ":SK": EntityTypes.game,
      },
    });
  });

  it("should return correct data", async () => {
    const res = await queryItems("pk", EntityTypes.game);

    expect(res).toEqual(expect.objectContaining([{ pk: "pk" }]));
  });
});
