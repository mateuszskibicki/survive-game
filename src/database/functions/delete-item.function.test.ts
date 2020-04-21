import { deleteItem } from "./delete-item.function";
import { dynamoDb } from "@app/aws";

describe("deleteItem", () => {
  beforeEach(() => {
    jest.spyOn(dynamoDb(), "delete").mockImplementation(
      () =>
        ({
          promise: async (): Promise<any> => ({}),
        } as any)
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined and a function", () => {
    expect(deleteItem).toBeDefined();
    expect(typeof deleteItem === "function").toBe(true);
  });

  it("should call dynamoDb.query with correct params", async () => {
    const spy = jest.spyOn(dynamoDb(), "delete");
    await deleteItem("pk", "sk");
    expect(spy).toHaveBeenCalledWith({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { pk: "pk", sk: "sk" },
    });
  });

  it("should return void", async () => {
    const res = await deleteItem("pk", "sk");
    expect(res).toEqual(undefined);
  });
});
