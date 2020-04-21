import { sns } from "@app/aws";
import { publishSnsMessage } from "./publish-sns-message";

describe("publishSnsMessage", () => {
  beforeEach(() => {
    jest.spyOn(sns(), "publish").mockImplementation(
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
    expect(publishSnsMessage).toBeDefined();
    expect(typeof publishSnsMessage === "function").toBe(true);
  });

  it("should call sns.publish with correct params", async () => {
    const spy = jest.spyOn(sns(), "publish");

    await publishSnsMessage("topic", "message");

    expect(spy).toHaveBeenCalledWith({ TopicArn: "topic", Message: "message" });
  });

  it("should return void", async () => {
    const res = await publishSnsMessage("topic", "message");

    expect(res).toEqual(undefined);
  });
});
