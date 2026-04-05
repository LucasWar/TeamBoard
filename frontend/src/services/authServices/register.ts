import { api } from "../../lib/axios";

export interface RegisterParams {
  name: string,
  password: string,
  email: string,
}

interface RegisterResponse {
  accesseToken: string,
}

export async function register(params: RegisterParams){
  const { data } = await api.post<RegisterResponse>('/auth/register',params)

  return data
}