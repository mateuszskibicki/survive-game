import { struct } from "@app/validation";
import { UpdateGroupPayload } from "../interfaces";

const validate = struct({
  name: "nonemptystring",
});

/**
 * Parses the given params
 * @param {any} payload
 * @throws {StructError}
 * @return {UpdateGroupPayload}
 */
export const parsePayloadUpdateGroup = (payload: any): UpdateGroupPayload => {
  validate(payload);
  return {
    name: payload.name,
  };
};
