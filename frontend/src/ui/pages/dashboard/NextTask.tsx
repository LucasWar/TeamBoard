import { Link } from "react-router-dom"
import { useRecentTasksByPriority } from "../../../app/hooks/useTask"
import { priorityMap } from "../../../app/utils/priorityMap"
import { cn } from "../../../lib/utils"

export function NextTask() {

  const { data: tasks } = useRecentTasksByPriority()

  return(
    <div className="xl:col-span-2">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Meu Foco (Próximas Tarefas)</h2>
          <button className="text-sm text-blue-600 hover:underline"><Link to="/myTasks">Ver todas</Link></button>
        </div>
        
        <div className="p-5">
          {tasks ? tasks.map((task, index) => (
            <ul className="space-y-4" key={index}>
              <li className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition border border-transparent hover:border-gray-200">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
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
            </ul>
          )) : <div>Teste</div>}
          
        </div>
      </div>
    </div>
  )
}