import { api } from "../../lib/axios";

export async function deleteProject(id: string){
  await api.delete(`projects/${id}`);
}