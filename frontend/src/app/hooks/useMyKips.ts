import { useQuery } from "@tanstack/react-query"
import { tasksService } from "../../services/tasksServives"

export function useMyKips(){
  return useQuery({
    queryKey: ['myKips'],
    queryFn: async () => {
      return await tasksService.myKpis()
    }
  })
}