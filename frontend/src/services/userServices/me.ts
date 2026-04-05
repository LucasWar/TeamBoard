import { api } from "../../lib/axios"

interface MeResonse {
  name: string
  email: string 
}

export async function me() {
  const { data } = await api.get<MeResonse>('/users/me')

  return data
}