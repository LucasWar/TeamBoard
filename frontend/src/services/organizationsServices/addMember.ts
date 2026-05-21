import type { EnumRoles } from "../../app/enums/roles"
import { api } from "../../lib/axios"

interface AddMemberParams {
  email: string
  role: EnumRoles
}

export async function addMember(params: AddMemberParams){
    await api.post('organizations/addMember',params)
}