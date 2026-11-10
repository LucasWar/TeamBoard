import { api } from "../../lib/axios"

export async function signout(){
  await api.post('/auth/logout');
}