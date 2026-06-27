import { api } from "../../lib/axios"

export interface CreateProjectParams {
  name: string
  description: string
}

export async function createProject(project: CreateProjectParams, idempotencyKey: string){
  await api.post('/projects', 
    project,
    {
      headers: {
        "x-idempotency-key": idempotencyKey,
      }
    }
  )
}