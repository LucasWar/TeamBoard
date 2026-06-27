import type { enumPlan } from "../../app/enums/plan";
import { api } from "../../lib/axios";

interface CreateParams {
  name: string
  plan: enumPlan
}

interface CreateResponse {
  id: string
}

export async function create(params: CreateParams, idempotencyKey: string) {
  const { data } = await api.post<CreateResponse>('organizations', 
    params,
    {
      headers: {
        "x-idempotency-key": idempotencyKey,
      }
    }
  )
  return data
}