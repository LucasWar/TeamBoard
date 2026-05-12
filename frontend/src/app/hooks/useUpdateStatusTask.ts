import { useMutation } from "@tanstack/react-query"
import { tasksService } from "../../services/tasksServives"
import type { UpdateStatusProps } from "../../services/tasksServives/updateStatus"

export function useUpdateStatusTask(){
  return useMutation({
    mutationFn: async (params: UpdateStatusProps) => {
      await tasksService.updateStatus(params)
    }
  })
}