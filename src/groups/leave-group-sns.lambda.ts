import { SNSEvent } from "aws-lambda";
import { EntityTypes } from "@app/common";
import { Group, LeaveGroupSnsMessageBody } from "./interfaces";
import {
  getItem,
  storeItem,
  deleteItem,
  queryItems,
  cleanUsersGamesRelations,
} from "@app/database";
import { PartialGame } from "@app/games";

/**
 * Lambda to be triggered by SNS - leave group
 * Cleans up all user records, user to group and user to game
 * @method SNS
 * @param {SNSEvent} event
 * @return {void}
 */
export const leaveGroupSnsHandler = async (event: SNSEvent): Promise<void> => {
  const { groupPk, userPk }: LeaveGroupSnsMessageBody = JSON.parse(
    event.Records[0].Sns.Message
  );

  // Get group by id
  const group: Group = await getItem(groupPk, groupPk);

  // Remove partialUser assigned to group
  await deleteItem(group.pk, userPk);
  // Remove partialGroup assigned to user
  await deleteItem(userPk, group.pk);

  // Grab all incoming games and check if user is part of it
  const incomingGames: PartialGame[] = await queryItems(
    group.pk,
    EntityTypes.game
  );

  // Map games and remove any records when user is part of an incoming game
  await cleanUsersGamesRelations([userPk], incomingGames);

  // Updates group with usersCount
  await storeItem({ ...group, usersCount: group.usersCount - 1 });
};
