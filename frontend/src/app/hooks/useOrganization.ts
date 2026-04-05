import { useContext } from "react";
import { OrganizationContext } from "../contexts/organizationContext";

export function useOrganization() {
  return useContext(OrganizationContext)
}