import { api } from "../../lib/axios"

export interface UpdateProjectParams {
  name: string
  description: string
}

export async function updateProject(project: UpdateProjectParams, id: string){
  await api.patch(`/projects/${id}`,project)
}