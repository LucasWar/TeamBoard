import type { PriorityTask } from "../../app/enums/priorityTask";
import { api } from "../../lib/axios";

export interface UpdateStatusProps {
  params: {
    title?: string
    description?: string
    priority?: PriorityTask
    assigneeEmail?: string
    dueDate?: Date 
  }
  taskId: string
}

export async function update({taskId, params}: UpdateStatusProps){
  await api.patch(`/tasks/${taskId}`, params);
}