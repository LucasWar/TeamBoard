import { api } from "../../lib/axios"

interface MeResonse {
  id: string
  name: string
  email: string 
  avatar?: string
}

export async function me() {
  const { data } = await api.get<MeResonse>('/users/me')

  return data
}