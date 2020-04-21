import { Game, PartialGame } from "@app/games";
import { User, PartialUser } from "@app/users";
import { Group, PartialGroup } from "@app/groups";
import { Token } from "@app/auth";
import { Stats } from "@app/stats";

/**
 * Type represents model in DynamoDB
 * @type
 */
export type Model =
  | User
  | PartialUser
  | Game
  | PartialGame
  | Group
  | PartialGroup
  | Token
  | Stats;
