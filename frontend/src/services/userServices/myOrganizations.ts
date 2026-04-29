import type { EnumRoles } from "../../assets/enums/roles";
import { api } from "../../lib/axios";

export interface GerMyOrganizationsResponse {
  name: string,
  organizationId: string
  role: EnumRoles
}


export async function getMyOrganizations() {
  const { data } = await api.get<GerMyOrganizationsResponse[]>('/users/myOrganizations');

  return data
}