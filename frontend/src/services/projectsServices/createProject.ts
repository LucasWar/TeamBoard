import { api } from "../../lib/axios"

export interface CreateProjectParams {
  name: string
  description: string
}

export async function createProject(project: CreateProjectParams){
  await api.post('/projects',project)
}