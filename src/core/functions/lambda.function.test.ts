import { JsonWebTokenError } from "jsonwebtoken";
import { FacebookApiException } from "fb";
import { StructError } from "superstruct";
import {
  response,
  NotFoundError,
  ErrorStatuses,
  ErrorTypes,
  ErrorMessages,
  UnauthorizedError,
} from "@app/common";
import { lambda } from "./lambda.function";
import { ForbiddenError } from "@app/common/errors/forbidden.error";

describe("lambda wrapper function", () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("main functionality", () => {
    it("should be defined and a function", () => {
      expect(lambda).toBeDefined();
      expect(typeof lambda === "function").toBeDefined();
    });

    it("should return an async function", async () => {
      const res = lambda({ name: "Lambda name" }, () =>
        Promise.resolve(response({ key: "value" }, 200))
      );

      expect(typeof res === "function").toBeTruthy();
    });
  });

  describe("protected", () => {
    it("should throw error if proteced and no JWT is provided", async () => {
      process.env.NODE_ENV = "production";
      const res = lambda({ name: "Lambda name", protected: true }, () =>
        Promise.resolve(response({ key: "value" }, 200))
      );

      expect(await res()).toEqual(
        expect.objectContaining({
          statusCode: ErrorStatuses.unauthorized,
        })
      );
      process.env.NODE_ENV = "test";
    });
  });

  describe("success response", () => {
    it("should return response with status 200 if resolved response", async () => {
      const res = lambda({ name: "Lambda name" }, () =>
        Promise.resolve(response({ key: "value" }, 200))
      );

      expect(await res()).toEqual(
        expect.objectContaining({
          statusCode: 200,
          body: expect.any(String),
          headers: {},
        })
      );
    });
  });

  describe("error handling", () => {
    describe("StructError", () => {
      const structError = new StructError([
        {
          path: ["a"],
          branch: ["a"],
          type: "test",
          value: 5,
        },
      ]);

      it("should return 400 invalid_request", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(structError)
        );

        expect(await res()).toEqual(
          expect.objectContaining({
            statusCode: ErrorStatuses.invalid_request,
          })
        );
      });

      it("body should contain error invalid_request", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(structError)
        );

        const lambdaResponse = await res();

        expect(JSON.parse(lambdaResponse.body)).toEqual(
          expect.objectContaining({
            error: ErrorTypes.invalid_request,
            error_description: ErrorMessages.invalid_request,
          })
        );
      });
    });

    describe("NotFoundError", () => {
      it("should return response with status 404", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(new NotFoundError())
        );

        expect(await res()).toEqual(
          expect.objectContaining({
            statusCode: ErrorStatuses.not_found,
          })
        );
      });

      it("body should contain error not_found", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(new NotFoundError())
        );

        const lambdaResponse = await res();

        expect(JSON.parse(lambdaResponse.body)).toEqual(
          expect.objectContaining({
            error: ErrorTypes.not_found,
            error_description: ErrorMessages.not_found,
          })
        );
      });
    });

    describe("FacebookApiException", () => {
      it("should return response with status 401", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(new FacebookApiException())
        );

        expect(await res()).toEqual(
          expect.objectContaining({
            statusCode: ErrorStatuses.unauthorized,
          })
        );
      });

      it("body should contain error unauthorized", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(new FacebookApiException())
        );

        const lambdaResponse = await res();

        expect(JSON.parse(lambdaResponse.body)).toEqual(
          expect.objectContaining({
            error: ErrorTypes.unauthorized,
            error_description: ErrorMessages.unauthorized,
          })
        );
      });
    });

    describe("JsonWebTokenError", () => {
      it("should return response with status 401", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(new JsonWebTokenError())
        );

        expect(await res()).toEqual(
          expect.objectContaining({
            statusCode: ErrorStatuses.unauthorized,
          })
        );
      });

      it("body should contain error unauthorized", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(new JsonWebTokenError())
        );

        const lambdaResponse = await res();

        expect(JSON.parse(lambdaResponse.body)).toEqual(
          expect.objectContaining({
            error: ErrorTypes.unauthorized,
            error_description: ErrorMessages.unauthorized,
          })
        );
      });
    });

    describe("UnauthorizedError", () => {
      it("should return response with status 401", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(new UnauthorizedError())
        );

        expect(await res()).toEqual(
          expect.objectContaining({
            statusCode: ErrorStatuses.unauthorized,
          })
        );
      });

      it("body should contain error unauthorized", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(new UnauthorizedError())
        );

        const lambdaResponse = await res();

        expect(JSON.parse(lambdaResponse.body)).toEqual(
          expect.objectContaining({
            error: ErrorTypes.unauthorized,
            error_description: ErrorMessages.unauthorized,
          })
        );
      });
    });

    describe("ForbiddenError", () => {
      it("should return response with status 403", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(new ForbiddenError())
        );

        expect(await res()).toEqual(
          expect.objectContaining({
            statusCode: ErrorStatuses.forbidden,
          })
        );
      });

      it("body should contain error forbidden", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(new ForbiddenError())
        );

        const lambdaResponse = await res();

        expect(JSON.parse(lambdaResponse.body)).toEqual(
          expect.objectContaining({
            error: ErrorTypes.forbidden,
            error_description: ErrorMessages.forbidden,
          })
        );
      });
    });

    describe("when an unexpected error occurs", () => {
      it("should return response with status 500", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(new Error())
        );

        expect(await res()).toEqual(
          expect.objectContaining({
            statusCode: ErrorStatuses.unexpected_error,
          })
        );
      });

      it("body should contain error not_found", async () => {
        const res = lambda({ name: "Lambda name" }, () =>
          Promise.reject(new Error())
        );

        const lambdaResponse = await res();

        expect(JSON.parse(lambdaResponse.body)).toEqual(
          expect.objectContaining({
            error: ErrorTypes.unexpected_error,
            error_description: ErrorMessages.unexpected_error,
          })
        );
      });
    });
  });
});
