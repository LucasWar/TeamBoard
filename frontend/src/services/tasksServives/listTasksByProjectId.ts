import type { EnumStatusTask } from "../../assets/enums/statusTask";
import type { PriorityTask } from "../../assets/enums/priorityTask";
import { api } from "../../lib/axios";

interface ListTasksByProjectIdResponse {
  id: string,
  organizationId: string,
  projectId: string,
  title: string,
  description: string,
  status: EnumStatusTask,
  priority: PriorityTask,
  reporterId: string,
  dueDate: string,
  position: number,
  assignee?: {
    id: string,
    name: string,
    avatar?: string
  }
}

export async function listTasksByProjectId(id: string) {
  const { data } = await api.get<ListTasksByProjectIdResponse[]>(`tasks/project/${id}`);

  return data;
}