import type { enumStatusProject } from "../../assets/enums/statusProject";

export const statusMap: Record<enumStatusProject, { label: string; classNameStatus: string, classNameBar: string }> = {
  ACTIVE: { label: "Ativo", classNameStatus: "bg-green-500", classNameBar: "bg-green-700"},
  ARCHIVED: { label: "Arquivado", classNameStatus: "bg-gray-400", classNameBar: "bg-gray-400" },
};