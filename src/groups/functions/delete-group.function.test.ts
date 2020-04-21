import { dynamoDb } from "@app/aws";
import { deleteGroup } from "./delete-group.function";

describe("deleteGroup", () => {
  beforeEach(() => {
    jest
      .spyOn(dynamoDb(), "delete")
      .mockImplementation(
        () => ({ promise: async (): Promise<void> => {} } as any)
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined and a function", () => {
    expect(deleteGroup).toBeDefined();
    expect(typeof deleteGroup === "function").toBe(true);
  });

  it("should call dynamoDb.put with correct params", async () => {
    const spy = jest.spyOn(dynamoDb(), "delete");

    await deleteGroup("id");

    expect(spy).toHaveBeenCalledWith({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: "id",
        sk: "id",
      },
    });
  });

  it("should return void", async () => {
    const res = await deleteGroup("id");
    expect(res).toEqual(undefined);
  });
});
