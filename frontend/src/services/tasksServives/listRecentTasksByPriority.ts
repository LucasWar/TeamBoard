import type { PriorityTask } from "../../app/enums/priorityTask";
import type { EnumStatusTask } from "../../app/enums/statusTask";
import { api } from "../../lib/axios";

export interface recentTasksByPriorityResponse {
  id: string,
  status: EnumStatusTask,
  taskTitle: string,
  dueDate: string,
  priority: PriorityTask,
  projectName: string
}

export async function recentTasksByPriority(){
  const { data } = await api.get<recentTasksByPriorityResponse[]>('tasks/recentTasksByPriority');
  return data;
}