import { api } from "../../lib/axios";

export async function confirmInvitation(organizationId: string) {
  await api.post('/memberships/confirmInvitation',
    {
      organizationId,
    }
  )
}