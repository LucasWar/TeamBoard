import { api } from "../../lib/axios";

export async function updateStatusStatus(id: string){
  await api.patch(`/notifications/${id}`);
}