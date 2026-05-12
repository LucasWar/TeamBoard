import type { enumPlan } from "../../app/enums/plan";
import { api } from "../../lib/axios";

interface CreateParams {
  name: string
  plan: enumPlan
}

interface CreateResponse {
  id: string
}

export async function create(params: CreateParams) {
  const { data } = await api.post<CreateResponse>('organizations', params)
  return data
}