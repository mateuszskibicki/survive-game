import { dynamoDb } from "@app/aws";
import { storeItem } from "./store-item.function";
import { mockUser } from "@app/mock";

describe("storeItem", () => {
  const user = mockUser();

  beforeEach(() => {
    jest
      .spyOn(dynamoDb(), "put")
      .mockImplementation(
        () => ({ promise: async (): Promise<void> => {} } as any)
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined and a function", () => {
    expect(storeItem).toBeDefined();
    expect(typeof storeItem === "function").toBe(true);
  });

  it("should call dynamoDb.put with correct params", async () => {
    const spy = jest.spyOn(dynamoDb(), "put");

    await storeItem(user);

    expect(spy).toHaveBeenCalledWith({
      TableName: process.env.DYNAMODB_TABLE,
      Item: user,
    });
  });

  it("should return void", async () => {
    const res = await storeItem(user);

    expect(res).toEqual(undefined);
  });
});
