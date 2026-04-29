import type { PriorityTask } from "../enums/priorityTask"
import type { EnumStatusTask } from "../enums/statusTask"

export interface Task {
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