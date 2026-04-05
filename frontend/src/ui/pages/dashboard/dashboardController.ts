import { useQuery } from "@tanstack/react-query";
import { tasksService } from "../../../services/tasksServives";

export function useDashboardController(){
  const { data: mykips, isFetching:isFetchingMykips } = useQuery({
    queryKey: ['myKips'],
    queryFn: async () => {
      return await tasksService.myKpis()
    }
  })

  return {
    mykips,
    isFetchingMykips
  }
}