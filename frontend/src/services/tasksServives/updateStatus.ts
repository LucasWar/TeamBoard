import type { EnumStatusTask } from "../../app/enums/statusTask";
import { api } from "../../lib/axios";

export interface UpdateStatusProps {
  newStatus: EnumStatusTask
  oldStatus: EnumStatusTask
  newPosition: number
  id: string
}

export async function updateStatus({id, ...params}: UpdateStatusProps){
  await api.patch(`/tasks/${id}/reorder`, params);
}