import { createContext, useCallback, useEffect, useState } from "react";
import { localStorageKeys } from "../config/localStorageKeys";
import { useAuth } from "../hooks/useAuth";
import { EnumRoles } from "../enums/roles";
import { useListOrganizations } from "../hooks/useListOrganizations";

interface OrganizationContextValue {
  isOrgLoading: boolean;
  selectedOrganization: string | null;
  currentRole: EnumRoles | null;
  changeOrganization(organizationId: string, role: EnumRoles): void; 
  toCleanOrganization(): void; 
}

export const OrganizationContext = createContext({} as OrganizationContextValue);

export const OrganizationProvider = ({children}: {children: React.ReactNode}) => {
  const { signedIn, isFetchingAuth } = useAuth();

  const [baseFilter] = useState({ page: 1, limit: 50, name: '' });
  const { data, isLoading } = useListOrganizations(signedIn, baseFilter);
  const baseOrganizations = data?.data ?? [];

  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(() => {
    return localStorage.getItem(localStorageKeys.ORGANIZATION_ID) ?? null;
  });
  
  const [currentRole, setCurrentRole] = useState<EnumRoles | null>(() => {
    return (localStorage.getItem('user_role') as EnumRoles) ?? null;
  });

  const toCleanOrganization = useCallback(() => {
    setSelectedOrganization(null);
    setCurrentRole(null);
    localStorage.removeItem(localStorageKeys.ORGANIZATION_ID);
    localStorage.removeItem('user_role');
  }, []);

  useEffect(() => {
    if (baseOrganizations.length > 0) {
      const savedOrgId = localStorage.getItem(localStorageKeys.ORGANIZATION_ID);
      const activeOrg = baseOrganizations.find(org => org.organizationId === savedOrgId);

      if (activeOrg) {
        setCurrentRole(activeOrg.role);
        localStorage.setItem('user_role', activeOrg.role);
      } else if (!savedOrgId) {
        const fallback = baseOrganizations[0];
        setSelectedOrganization(fallback.organizationId);
        setCurrentRole(fallback.role);
        localStorage.setItem(localStorageKeys.ORGANIZATION_ID, fallback.organizationId);
        localStorage.setItem('user_role', fallback.role);
      }
    }
  }, [baseOrganizations]);

  useEffect(() => {
    if (!isFetchingAuth && !signedIn) {
      toCleanOrganization();
    }
  }, [signedIn, isFetchingAuth, toCleanOrganization]);

  const changeOrganization = useCallback((organizationId: string, role: EnumRoles) => {
    localStorage.setItem(localStorageKeys.ORGANIZATION_ID, organizationId);
    localStorage.setItem('user_role', role);
    setSelectedOrganization(organizationId);
    setCurrentRole(role);
  }, []);
  
  return (
    <OrganizationContext.Provider 
      value={{ 
        selectedOrganization, 
        currentRole,
        changeOrganization, 
        isOrgLoading: isLoading,
        toCleanOrganization, 
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};