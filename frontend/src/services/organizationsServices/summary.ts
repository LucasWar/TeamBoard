import { api } from "../../lib/axios"

interface SummaryResponse {
  id: string,
  actor: string,
  actorAvatar: string,
  description: string,
  fullText: string,
  createdAt: string
}

export async function Summary(){
  const { data } = await api.get<SummaryResponse[]>('/organizations/summary')
  return data
}