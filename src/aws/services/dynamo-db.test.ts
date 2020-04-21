import * as DynamoDB from "aws-sdk/clients/dynamodb";
import { dynamoDb } from "./dynamo-db";

describe("dynamoDb", () => {
  it("shoud be defined and a function", () => {
    expect(dynamoDb).toBeDefined();
    expect(typeof dynamoDb === "function").toBeTruthy();
  });

  it("should return instance of DynamoDB", () => {
    expect(dynamoDb()).toBeInstanceOf(DynamoDB.DocumentClient);
  });
});
