import type { EnumRoles } from "../../app/enums/roles"
import type { EnumRolesMembers } from "../../app/enums/statusMember"
import { api } from "../../lib/axios"

interface ListMembersResponse {
  id: string
  name: string
  email: string
  avatar: string
  role: EnumRoles
  status: EnumRolesMembers
}

export async function listMembers(){
  const { data } = await api.get<ListMembersResponse[]>('organizations/members')
  return data
}