import { Outlet, Navigate} from 'react-router-dom'
import { useAuth } from '../app/hooks/useAuth';
import { useOrganization } from '../app/hooks/useOrganization';
import { PageLoader } from '../assets/components/PageLoader';
import type { EnumRoles } from '../app/enums/roles';

interface AuthGuardProps {
  isPrivate: boolean;
  roles?: EnumRoles[]
}

export function AuthGuard({ isPrivate, roles }:AuthGuardProps) {
  const { signedIn, isFetchingAuth } = useAuth()
  const { selectedOrganization, isOrgLoading, currentRole} = useOrganization()

  if (isFetchingAuth || isOrgLoading) {
    console.log("Aqyu")
    return <PageLoader />; 
  }
  

  if (isPrivate && !signedIn) {
    return <Navigate to="/login" replace />;
  }

  if (isPrivate && signedIn) {
    if (selectedOrganization && window.location.pathname === '/firtsOrganization') {
      return <Navigate to="/" replace />
    }
  }

  if (!isPrivate && signedIn) {
    if(selectedOrganization != null){
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/firtsOrganization" replace />;
  }

  if(roles){
    if(roles.includes(currentRole)){
      return <Outlet />
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />

}