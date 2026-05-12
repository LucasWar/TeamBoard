import type { EnumRoles } from "../enums/roles";
import type { GerMyOrganizationsResponse } from "../../services/userServices/myOrganizations";

export function createRoleMap(data: GerMyOrganizationsResponse[]): Map<string, EnumRoles> {
  return new Map(
    data.map(item => [item.organizationId, item.role])
  );
}