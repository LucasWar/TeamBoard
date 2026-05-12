import type { PriorityTask } from "../enums/priorityTask";

export const priorityMap: Record<PriorityTask, { label: string; classNameStatus: string, classNameBar: string }> = {
  LOW: { label: "Baixa", classNameStatus: "text-green-600 bg-green-50", classNameBar: "bg-green-700"},
  MEDIUM: { label: "Media", classNameStatus: "text-blue-600 bg-blue-50", classNameBar: "bg-green-700"},
  HIGH: { label: "Alta", classNameStatus: "text-yellow-600 bg-yellow-100", classNameBar: "bg-green-700"},
  URGENT: { label: "Urgente", classNameStatus: "text-red-600 bg-red-50", classNameBar: "bg-green-700"},
};