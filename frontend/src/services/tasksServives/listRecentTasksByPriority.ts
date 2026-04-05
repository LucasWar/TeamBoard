import type { PriorityTask } from "../../assets/enums/priorityTask";
import { api } from "../../lib/axios";

interface recentTasksByPriorityResponse {
  taskTitle: string,
  dueDate: string,
  priority: PriorityTask,
  projectName: string
}

export async function recentTasksByPriority(){
  const { data } = await api.get<recentTasksByPriorityResponse[]>('tasks/recentTasksByPriority');
  return data;
}