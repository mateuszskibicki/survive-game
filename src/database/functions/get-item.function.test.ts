import { getItem } from "./get-item.function";
import { dynamoDb } from "@app/aws";

describe("getItem", () => {
  beforeEach(() => {
    jest.spyOn(dynamoDb(), "get").mockImplementation(
      () =>
        ({
          promise: async (): Promise<any> => ({
            Item: { pk: "pk" },
          }),
        } as any)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined and a function", () => {
    expect(getItem).toBeDefined();
    expect(typeof getItem === "function").toBe(true);
  });

  it("should call dynamoDb.query with correct params", async () => {
    const spy = jest.spyOn(dynamoDb(), "get");

    await getItem("pk", "sk");

    expect(spy).toHaveBeenCalledWith({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { pk: "pk", sk: "sk" },
    });
  });

  it("should return correct data", async () => {
    const res = await getItem("pk", "sk");

    expect(res).toEqual(expect.objectContaining({ pk: "pk" }));
  });
});
