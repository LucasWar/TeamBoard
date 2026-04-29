import { createContext, useCallback, useEffect, useState, useMemo } from "react";
import { localStorageKeys } from "../config/localStorageKeys";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { usersService } from "../../services/userServices";
import { EnumRoles } from "../../assets/enums/roles";
import type { GerMyOrganizationsResponse } from "../../services/userServices/myOrganizations";

interface OrganizationContextValue {
  isOrgLoading: boolean;
  organizations: GerMyOrganizationsResponse[];
  selectedOrganization: string | null;
  currentRole: EnumRoles | null;
  changeOrganization(organizationId: string): void; 
  toCleanOrganization(): void; 
}

export const OrganizationContext = createContext({} as OrganizationContextValue);

function hasOrganizationId(data: GerMyOrganizationsResponse[], orgId: string): boolean {
  return data.some(item => item.organizationId === orgId);
}

function getRoleByOrgId(data: GerMyOrganizationsResponse[], orgId: string): EnumRoles | undefined {
  return data.find(item => item.organizationId === orgId)?.role;
}

export const OrganizationProvider = ({children}: {children: React.ReactNode}) => {
  const { signedIn, isFetchingAuth } = useAuth();

  const { data, isFetching } = useQuery({
    queryKey: ['myOrganizations'],
    queryFn: async () => await usersService.getMyOrganizations(),
    enabled: signedIn,
  });

  const organizations = data ?? [];

  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(() => {
    return localStorage.getItem(localStorageKeys.ORGANIZATION_ID) ?? null;
  });

  const currentRole = useMemo(() => {
    if (!selectedOrganization || organizations.length === 0) return null;
    return getRoleByOrgId(organizations, selectedOrganization) ?? null;
  }, [organizations, selectedOrganization]);

  const toCleanOrganization = useCallback(() => {
    setSelectedOrganization(null);
    localStorage.removeItem(localStorageKeys.ORGANIZATION_ID);
  }, []);

  useEffect(() => {
    if (organizations.length > 0) {
      const savedOrgId = localStorage.getItem(localStorageKeys.ORGANIZATION_ID);
      
      const isValidSavedOrg = savedOrgId ? hasOrganizationId(organizations, savedOrgId) : false;

      if (!isValidSavedOrg) {
        const fallbackOrgId = organizations[0].organizationId;
        setSelectedOrganization(fallbackOrgId);
        localStorage.setItem(localStorageKeys.ORGANIZATION_ID, fallbackOrgId);
      }
    }
  }, [organizations]);

  useEffect(() => {
    if (!isFetchingAuth && !signedIn) {
      toCleanOrganization();
    }
  }, [signedIn, isFetchingAuth, toCleanOrganization]);

  const changeOrganization = useCallback((organizationId: string) => {
    localStorage.setItem(localStorageKeys.ORGANIZATION_ID, organizationId);
    setSelectedOrganization(organizationId);
  }, []);
  
  return (
    <OrganizationContext.Provider 
      value={{ 
        selectedOrganization, 
        changeOrganization, 
        organizations, 
        isOrgLoading: isFetching, 
        toCleanOrganization, 
        currentRole 
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};