import { api } from "../../lib/axios";

interface myKpistResponse {
  forToday: number
  late: number
  complets: number
}

export async function myKpis(){
  const { data } = await api.get<myKpistResponse>('/tasks/myKips');
  return data;
}