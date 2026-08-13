import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useEffect, useState } from "react";
import { usersService } from "../../services/userServices";
import { localStorageKeys } from "../config/localStorageKeys";
import type { User } from "../interfaces/user";
import type { ListNotificationResponse } from "../../services/notificationsServices/listNotification";
import { useNotifications } from "../hooks/useListNotifications";

interface AuthContextValue {
  isFetchingAuth: boolean;
  signedIn: boolean;
  signin(accesseToken:string): void; 
  signout(): void;
  user: User,
  notifications: ListNotificationResponse[] | undefined
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

  const { data: notifications } = useNotifications(signedIn)

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
    <AuthContext.Provider value={{ signedIn: isSuccess && signedIn, signin, signout, isFetchingAuth: isFetching, user: me!, notifications }}>
      {children}
    </AuthContext.Provider>
  );
};