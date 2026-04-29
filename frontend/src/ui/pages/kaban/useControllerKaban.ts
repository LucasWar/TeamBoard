import { useQuery } from "@tanstack/react-query"
import { tasksService } from "../../../services/tasksServives"
import { useEffect, useState } from "react"
import type { Task } from "../../../assets/interfaces/task"

export function useControllerKaban(idProject: string){
  const [tasks, setTasks] = useState<Task[] | null>(null)

  const { data, isSuccess } = useQuery({
    queryKey: ['listTasks', idProject],
    queryFn: () => tasksService.listTasksByProjectId(idProject)
  })

  useEffect(() => {
    if (isSuccess) {
      setTasks(data)
    }
  }, [isSuccess, data]);

  return {tasks, setTasks}
}