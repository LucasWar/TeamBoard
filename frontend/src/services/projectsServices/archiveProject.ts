import { api } from "../../lib/axios";

export interface ChangeStatusProjectParams {
  status: "ACTIVE" | "ARCHIVED" | "COMPLETE"
}

export async function changeStatusProject(id: string, params: ChangeStatusProjectParams){
  await api.patch(`projects/changeStatus/${id}`, params);
}