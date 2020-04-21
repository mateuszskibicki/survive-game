import { ErrorStatuses, ErrorMessages, ErrorTypes } from "@app/common";
import axios from "axios";
import { helpers } from "../helpers";

// GET BY ID
describe("users lambdas", () => {
  describe("GET - user/{id} - get user by id lambda", () => {
    it("sould return unauthorized whwn token is not provided", async () => {
      try {
        await axios.get(`${helpers.url}/dev/user/123`);
      } catch (err) {
        expect(err.response.status).toBe(ErrorStatuses.unauthorized);
        expect(err.response.data.error).toBe(ErrorTypes.unauthorized);
        expect(err.response.data.error_description).toBe(
          ErrorMessages.unauthorized
        );
      }
    });
    it("sould throw NotFoundError when user does not exist", async () => {
      try {
        await axios.get(`${helpers.url}/dev/user/1234abc`, {
          headers: {
            Authorization: helpers.jwtToken,
          },
        });
      } catch (err) {
        expect(err.response.status).toBe(ErrorStatuses.not_found);
        expect(err.response.data.error).toBe(ErrorTypes.not_found);
        expect(err.response.data.error_description).toBe(
          ErrorMessages.not_found
        );
      }
    });
  });
});

// describe("users lambdas", () => {
//   describe("GET - user/{id} - get user by id lambda", () => {
//     it("sould throw JsonWebTokenError when token is not provided", async () => {
//       await expect(axios.get(`${helpers.url}/dev/user/123`)).toThrow(
//         JsonWebTokenError
//       );
//     });
//   });
// });
