import type { EnumStatusTask } from "../enums/statusTask";

export const statusTaskMap: Record<EnumStatusTask, { label: string }> = {
  BLOCKED: { label: "Bloqueado"},
  DONE: { label: "Concluído"},
  IN_PROGRESS: { label: "Em andamento"},
  TODO: { label: "A fazer"},
};