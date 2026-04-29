import type { enumPlan } from "../../assets/enums/plan";
import { api } from "../../lib/axios";

interface UpdateParams {
  name: string
  plan: enumPlan
}

export async function update(id: string, params: UpdateParams) {
  await api.patch(`organizations/${id}`, params)
}