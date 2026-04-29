import { api } from "../../lib/axios"

export async function deleteOrganization(id: string){
  await api.delete(`organizations/${id}`)
}