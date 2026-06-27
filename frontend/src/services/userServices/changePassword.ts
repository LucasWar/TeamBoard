import { api } from "../../lib/axios";

export interface ChangePasswordParams {
  newPassword: string
  oldPassword: string
}

export async function changePassword(params: ChangePasswordParams){
  return await api.patch(`users/changePassword`, params);
}