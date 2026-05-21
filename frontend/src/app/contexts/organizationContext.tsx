import { createContext, useCallback, useEffect, useState } from "react";
import { localStorageKeys } from "../config/localStorageKeys";
import { useAuth } from "../hooks/useAuth";
import { EnumRoles } from "../enums/roles";
import type { GetMyOrganizationsData } from "../../services/userServices/myOrganizations";
import { useListOrganizations } from "../hooks/useListOrganizations";

// 1. Limpamos a Interface (Removemos searchTerm e filter daqui)
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

  // 2. O Provider faz uma busca base (sem filtro de pesquisa) apenas para 
  // validar se o usuário ainda pertence à organização salva.
  // Usamos limit 50 ou 100 para garantir que pegamos as principais para validação.
  const [baseFilter] = useState({ page: 1, limit: 50, name: '' });
  const { data, isLoading } = useListOrganizations(signedIn, baseFilter);
  const baseOrganizations = data?.data ?? [];

  // 3. Pegamos tanto o ID quanto o Role do localStorage
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

  // 4. Validação Inicial: Se carregou as orgs, verifica se a salva é válida
  useEffect(() => {
    if (baseOrganizations.length > 0) {
      const savedOrgId = localStorage.getItem(localStorageKeys.ORGANIZATION_ID);
      const activeOrg = baseOrganizations.find(org => org.organizationId === savedOrgId);

      if (activeOrg) {
        // Se a org salva existe na lista do usuário, atualiza o cargo por segurança
        setCurrentRole(activeOrg.role);
        localStorage.setItem('user_role', activeOrg.role);
      } else if (!savedOrgId) {
        // Se não tem nada salvo, define a primeira como padrão
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

  // 5. A função de trocar agora recebe o ID e o Cargo diretamente da tela!
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
        isOrgLoading: isLoading, // Repasse apenas o isLoading da busca base
        toCleanOrganization, 
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};