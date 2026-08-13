import { useQuery } from "@tanstack/react-query";
import { notificationsServices } from "../../services/notificationsServices";

export function useNotifications(signedIn:  boolean){
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => await notificationsServices.listNotification(),
    enabled: signedIn,
  });
}