import type { PriorityTask } from "../enums/priorityTask";

export interface EditTask {
  id: string,
  title: string,
  description: string,
  priority: PriorityTask,
  dueDate: string,
  emailAssignee: string
}