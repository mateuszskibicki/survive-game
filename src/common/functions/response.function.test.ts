import { LambdaResponse, ResponseOptions } from "../interfaces";
import { LambdaResponseHeaders } from "../types/lambda-response-headers.type";
import { response } from "./response.function";

describe("response", () => {
  it("should be defined and a function", () => {
    expect(response).toBeDefined();
    expect(typeof response === "function").toBeDefined();
  });

  it("should create an valid amazon gateway response", () => {
    const data = { a: 1, b: 2 };

    const code = 200;

    const options: ResponseOptions = {
      headers: {
        "random-header": "random-value",
        "second-header": "second-value",
      } as LambdaResponseHeaders,
    };

    const res: LambdaResponse = response(data, code, options);

    expect(res.body).toEqual(JSON.stringify(data));
    expect(res.statusCode).toBe(code);
    expect(res.headers["random-header"]).toBe("random-value");
    expect(res.headers["second-header"]).toBe("second-value");
  });
});
