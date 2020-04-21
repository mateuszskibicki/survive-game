import { PartialGroup } from "@app/groups";

/**
 * Returns mocked PartialGroup object
 * @returns {PartialGroup}
 */
export const mockPartialGroup = (): PartialGroup => {
  // ISO 8601
  const time: string = new Date().toISOString();
  return {
    pk: "id",
    sk: "id",
    adminId: "adminId",
    name: "name",
    createdAt: time,
    updatedAt: time,
  };
};
