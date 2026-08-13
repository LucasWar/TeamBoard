import { api } from "../../lib/axios"

export interface ListNotificationResponse {
  id: string,
  menssage: string,
  type: 'NOTIFCATION' | 'INVITING',
  read: boolean
  organizationId?: string
}

export async function listNotification(){
  const { data } = await api.get<ListNotificationResponse[]>('/notifications');
  return data
}

