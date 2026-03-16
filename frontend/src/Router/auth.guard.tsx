import { Outlet, Navigate} from 'react-router-dom'

interface AuthGuardProps {
  isPrivate: boolean;
}

export function AuthGuard({ isPrivate }:AuthGuardProps) {
  const singendIn =  false;

  if(!singendIn && isPrivate){
    return <Navigate to='/login' replace/>;
  }

  if(singendIn && !isPrivate){
    return <Navigate to='/' replace/>
  }

  return <Outlet />
}