import type { EnumRoles } from "../../app/enums/roles";
import { api } from "../../lib/axios";

export interface GetMyOrganizationsData {
  name: string,
  organizationId: string
  role: EnumRoles
}

interface listProjectsPagination {
  total: number,
  perPage: string,
  page: string,
  hasNext: boolean,
  hasPrev: boolean

}

interface listOrganizationResponse {
  data: GetMyOrganizationsData[]
  pagination: listProjectsPagination
}

export interface listOrganizationFilter {
  page: number;
  limit: number;
  sort?: 'asc' | 'desc';
  sortBy?: string;
  name?: string
}

export async function getMyOrganizations(filters: listOrganizationFilter) {
  const { data } = await api.get<listOrganizationResponse>('/organizations/organizationUserId/', {
    params: filters
  });

  return {
    data: data.data || [], 
    pagination: data.pagination
  }
}