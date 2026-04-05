import { api } from "../../lib/axios"

interface LoginParams {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
}

export async function login(params: LoginParams){
  const { data } = await api.post<LoginResponse>('/auth/login', params)

  return data
}