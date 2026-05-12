import type { EnumStatusTask } from "../../app/enums/statusTask";
import type { PriorityTask } from "../../app/enums/priorityTask";
import { api } from "../../lib/axios";

interface MyTasks {
  id: string,
  organizationId: string,
  projectId: string,
  title: string,
  description: string,
  status: EnumStatusTask,
  priority: PriorityTask,
  reporterId: string,
  dueDate?: string,
  position: number,
}

export interface ListMyTasks {
  late: MyTasks[],
  today: MyTasks[],
  upcoming: MyTasks[],
}

export async function listMyTasks() {
  const { data } = await api.get<ListMyTasks>(`tasks/myTasks`);

  return data;
}