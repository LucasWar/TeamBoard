import { Link } from "react-router-dom"
import { useRecentTasksByPriority } from "../../../../../app/hooks/useTask"
import { priorityMap } from "../../../../../app/utils/priorityMap"
import { cn } from "../../../../../lib/utils"
import { EnumStatusTask } from "../../../../../app/enums/statusTask"
import { useUpdateStatusTask } from "../../../../../app/hooks/useUpdateStatusTask"
import { useState } from "react"
import type { recentTasksByPriorityResponse } from "../../../../../services/tasksServives/listRecentTasksByPriority"
import { useQueryClient } from "@tanstack/react-query"

export function NextTask() {
  const queryClient = useQueryClient();

  const { data: tasks } = useRecentTasksByPriority()

  const { mutateAsync } = useUpdateStatusTask()

  function completeTask(id: string, currentSatus: EnumStatusTask) {
      if (!tasks) {
        return;
      }
  
      const index = tasks.findIndex(task => task.id === id);

      if (index !== -1) {
        tasks.splice(index, 1);
      }

      mutateAsync({
        id,
        newPosition: 0,
        newStatus: EnumStatusTask.DONE,
        oldStatus: currentSatus
      },{
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["myKips"]
          });
        }
      })
    }
  
  const [removingTaskId, setRemovingTaskId] = useState<string | null>(null);

  async function handleComplete(task: recentTasksByPriorityResponse) {
    setRemovingTaskId(task.id);

    setTimeout(() => {
      completeTask(task.id, task.status);
    }, 300);
  }

  return(
    <div className="xl:col-span-2">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Meu Foco (Próximas Tarefas)</h2>
          <button className="text-sm text-blue-600 hover:underline"><Link to="/myTasks">Ver todas</Link></button>
        </div>
        
        <div className="p-5">
          <ul className="space-y-4">
            {tasks && tasks.length !== 0 ? tasks.map((task) => (
              <li key={task.id} className={`cursor-pointer flex items-center justify-between p-3 hover:bg-gray-50 rounded-md border border-transparent hover:border-gray-200 transition-all duration-300 ease-in-out
                  ${
                      removingTaskId && removingTaskId === task.id
                        ? "opacity-0 translate-x-10 scale-95 max-h-0 py-0"
                        : "opacity-100 translate-x-0 scale-100 max-h-40"
                    }`
              }>
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" onClick={() => handleComplete(task)}/>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{task.taskTitle}</p>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">{task.projectName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn("text-xs font-semibold px-3 py-2 rounded-md", priorityMap[task.priority].classNameStatus)}>{priorityMap[task.priority].label}</span>
                  {/* { task.dueDate &&
                    <p className="text-xs text-red-500 mt-1 font-medium">Vence em {getTimeDifference(task.dueDate)}</p>
                  } */}
                </div>
              </li>
            )) : <div className="flex items-center justify-center font-bold opacity-30">Nenhuma atividade urgente no momento</div>}
          </ul>
        </div>
      </div>
    </div>
  )
}