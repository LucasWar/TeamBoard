import { addMember } from "./addMember";
import { create } from "./create";
import { deleteOrganization } from "./delete";
import { listMembers } from "./listMembers";
import { Summary } from "./summary";
import { update } from "./update";

export const OrganizationService = {
  create,
  Summary,
  update,
  deleteOrganization,
  listMembers,
  addMember
}