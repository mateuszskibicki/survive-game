import { PartialUser } from "@app/users";

/**
 * Returns mocked PartialUser object
 * @function
 * @returns {PartialUser}
 */
export const mockPartialUser = (): PartialUser => {
  // ISO 8601
  const time: string = new Date().toISOString();
  return {
    pk: "id",
    sk: "id",
    name: "name",
    createdAt: time,
    updatedAt: time,
    profilePhoto: "some-url.com",
  };
};
