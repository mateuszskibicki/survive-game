import { User } from "@app/users";

/**
 * Returns mocked User object
 * @function
 * @returns {User}
 */
export const mockUser = (): User => {
  // ISO 8601
  const time: string = new Date().toISOString();
  return {
    pk: "id",
    sk: "id",
    name: "name",
    createdAt: time,
    updatedAt: time,
    profilePhoto: "some-url.com",
    wonGames: 1,
    lostGames: 5,
    gamesPlayed: 6,
    diedTimes: 5,
    survivedTimes: 1,
  };
};
