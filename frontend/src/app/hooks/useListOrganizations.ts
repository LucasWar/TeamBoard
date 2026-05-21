import { useQuery } from "@tanstack/react-query";
import type { listOrganizationFilter } from "../../services/userServices/myOrganizations";
import { usersService } from "../../services/userServices";

export function useListOrganizations(signedIn:  boolean, filters: listOrganizationFilter){
  return useQuery({
    queryKey: ['myOrganizations', filters],
    queryFn: async () => await usersService.getMyOrganizations(filters),
    enabled: signedIn,
  });
}