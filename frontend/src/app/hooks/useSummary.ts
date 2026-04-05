import { useQuery } from "@tanstack/react-query"
import { OrganizationService } from "../../services/organizationsServices"

export function useSummary() {
  return useQuery({
    queryKey: ['summary'],
    queryFn: async () => {
      return await OrganizationService.Summary()
    }
  })
}