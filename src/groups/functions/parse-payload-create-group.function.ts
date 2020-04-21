import { struct } from "@app/validation";
import { CreateGroupPayload } from "../interfaces";

const validate = struct({
  name: "nonemptystring",
});

/**
 * Parses the given params
 * @param {any} payload
 * @throws {StructError}
 * @return {CreateGroupPayload}
 */
export const parsePayloadCreateGroup = (payload: any): CreateGroupPayload => {
  validate(payload);
  return {
    name: payload.name,
  };
};
