import { useQuery } from "@tanstack/react-query";
import { tasksService } from "../../services/tasksServives";

export function useRecentTasksByPriority() {
  return useQuery({
    queryKey: ['recentTasksByPriority'],
    queryFn: async () => {
      return await tasksService.recentTasksByPriority()
    }
  })
}