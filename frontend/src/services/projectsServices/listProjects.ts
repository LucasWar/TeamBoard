import type { enumStatusProject } from "../../assets/enums/statusProject";
import { api } from "../../lib/axios";

interface listProjectsResponse {
  id: string,
  name: string
  description: string
  status: enumStatusProject
  progress: number

}

export interface listProjectsFilter {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  sortBy?: string;
  status?: enumStatusProject;
  name?: string
}

export async function listProjects(filter: listProjectsFilter) {
  return await api.get<listProjectsResponse[]>('projects',{
    params: filter
  })
}