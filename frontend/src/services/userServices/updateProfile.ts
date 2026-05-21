import { api } from "../../lib/axios";

export interface UpdateUserProps {
  name: string
  email: string
  avatar?: File
}

export async function updateUser(params: UpdateUserProps){
  console.log(params)
  return await api.patch(`/users`, params);
}