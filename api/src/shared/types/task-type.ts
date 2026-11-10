import { EnumPriority, EnumStatusTask } from '@prisma/client';

export interface TaskType {
  description: string | null;
  id: string;
  organizationId: string;
  projectId: string;
  title: string;
  priority: EnumPriority;
  status: EnumStatusTask;
  reporterId: string;
  dueDate: Date | null;
  position: number | null;
  idempotencyKey: string | null;
}