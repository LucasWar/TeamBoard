import type { EnumRoles } from "../enums/roles";

export const roleMap: Record<EnumRoles, { label: string; classNameStatus: string}> = {
  ADMIN: { label: "Administrador", classNameStatus: "bg-purple-100 text-purple-700"},
  MANAGER: { label: "Gerente", classNameStatus: "bg-blue-100 text-blue-700"},
  USER: { label: "Membro", classNameStatus: "bg-gray-100 text-gray-700"},
};