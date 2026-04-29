import type { enumStatusProject } from "../../assets/enums/statusProject";
import { api } from "../../lib/axios";

interface listProjectsData {
  id: string,
  name: string
  description: string
  status: enumStatusProject
  progress: number

}

interface listProjectsPagination {
  total: number,
  perPage: string,
  page: string,
  hasNext: boolean,
  hasPrev: boolean

}

interface listProjectsResponse {
  data: listProjectsData[]
  pagination: listProjectsPagination
}

export interface listProjectsFilter {
  page: number;
  limit: number;
  sort?: 'asc' | 'desc';
  sortBy?: string;
  status?: enumStatusProject;
  name?: string
}

export async function listProjects(filter: listProjectsFilter) {
  return await api.get<listProjectsResponse>('projects',{
    params: filter
  })
}