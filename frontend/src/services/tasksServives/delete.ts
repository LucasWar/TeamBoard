import { api } from "../../lib/axios";

export async function deleteTask(id: string){
  await api.delete(`tasks/${id}`);
}