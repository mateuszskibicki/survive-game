import { struct } from "@app/validation";
import { CreateGamePayload } from "../interfaces";

const validate = struct({
  name: "nonemptystring",
  groupId: "nonemptystring",
  gameType: "nonemptystring",
  gameTypeId: "nonemptystring",
  playersLimit: "number",
  gameTime: "iso8601",
});

/**
 * Parses the given params
 * @param {any} payload
 * @throws {StructError}
 * @return {CreateGamePayload}
 */
export const parsePayloadCreateGame = (payload: any): CreateGamePayload => {
  validate(payload);
  return {
    name: payload.name,
    groupId: payload.groupId,
    gameType: payload.gameType,
    gameTypeId: payload.gameTypeId,
    playersLimit: payload.playersLimit,
    gameTime: payload.gameTime,
  };
};
