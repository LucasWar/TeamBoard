import type { EnumStatusTask } from "../../assets/enums/statusTask";
import { api } from "../../lib/axios";

interface UpdateStatusProps{
  status: EnumStatusTask
}

export async function updateStatus(params: UpdateStatusProps){
  const { data } = await api.patch('/tasks/myKips', params);
  return data;
}