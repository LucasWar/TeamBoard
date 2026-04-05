import type { enumStatusProject } from "../../assets/enums/statusProject";
import { api } from "../../lib/axios";

interface listProjectsResponse {
  name: string
  description: string
  status: enumStatusProject
  progress: number

}

export async function listProjects() {
  return await api.get<listProjectsResponse[]>('projects')
}