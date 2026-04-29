import { create } from "./create";
import { deleteOrganization } from "./delete";
import { Summary } from "./summary";
import { update } from "./update";

export const OrganizationService = {
  create,
  Summary,
  update,
  deleteOrganization
}