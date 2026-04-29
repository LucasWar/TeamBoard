import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useEffect, useState } from "react";
import { usersService } from "../../services/userServices";
import { localStorageKeys } from "../config/localStorageKeys";

interface AuthContextValue {
  isFetchingAuth: boolean;
  signedIn: boolean;
  signin(accesseToken:string): void; 
  signout(): void;
  userName?: string
  avatar?: string
}

export const AuthContext = createContext({} as AuthContextValue);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const queryClient = useQueryClient();

  const [signedIn, setSignIn] = useState<boolean>(() => {
    const storedAccessToken = localStorage.getItem(localStorageKeys.ACCESS_TOKEN)

    return Boolean(storedAccessToken)
  });

  const {isError, isFetching, isSuccess, data: me} = useQuery({
    queryKey: ['users','me'],
    queryFn: () => usersService.me(),
    enabled: signedIn,
  })


  const signin = useCallback((accesseToken: string) => {
    localStorage.setItem(localStorageKeys.ACCESS_TOKEN, accesseToken)
    setSignIn(true)
  }, [])

  const signout = useCallback(() => {
    localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
    queryClient.removeQueries();
    setSignIn(false)
  }, [queryClient])

  useEffect(() => {
    if (isError) {
      signout()
    }
  }, [isError, signout])
  
  return (
    <AuthContext.Provider value={{ signedIn: isSuccess && signedIn, signin, signout, isFetchingAuth: isFetching, userName: me?.name, avatar: me?.avatar }}>
      {children}
    </AuthContext.Provider>
  );
};