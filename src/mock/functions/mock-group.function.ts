import { Group } from "@app/groups";

/**
 * Returns mocked Group object
 * @returns {Group}
 */
export const mockGroup = (): Group => {
  // ISO 8601
  const time: string = new Date().toISOString();
  return {
    pk: "id",
    sk: "id",
    adminId: "adminId",
    gamesPlayed: 1,
    upcomingGames: 2,
    usersLimit: 50,
    usersCount: 4,
    name: "name",
    createdAt: time,
    updatedAt: time,
  };
};
