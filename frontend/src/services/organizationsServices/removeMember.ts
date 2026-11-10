import { api } from "../../lib/axios"

export async function removeMember(memberId: string){
    await api.delete(`memberships/removeMembership/${memberId}`)
}