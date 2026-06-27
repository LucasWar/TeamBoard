import type { PriorityTask } from "../../app/enums/priorityTask"
import { api } from "../../lib/axios"

export interface CreateTaskParams {
  task:{
    title: string,
    description: string,
    priority: PriorityTask  
    dueDate?: Date
    assigneeEmail?: string
  }
  projectId: string
}

export async function create({task, projectId}: CreateTaskParams, idempotencyKey: string){
  await api.post(`/tasks/${projectId}/create`,
    task,
    {
      headers: {
        "x-idempotency-key": idempotencyKey,
      }
    }
  )
}