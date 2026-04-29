import { Outlet, Navigate} from 'react-router-dom'
import { useAuth } from '../app/hooks/useAuth';
import { useOrganization } from '../app/hooks/useOrganization';
import { PageLoader } from '../assets/components/PageLoader';

interface AuthGuardProps {
  isPrivate: boolean;
}

export function AuthGuard({ isPrivate }:AuthGuardProps) {
  const { signedIn, isFetchingAuth } = useAuth()
  const { selectedOrganization, isOrgLoading} = useOrganization()

  if (isFetchingAuth || isOrgLoading) {
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

  return <Outlet />
}