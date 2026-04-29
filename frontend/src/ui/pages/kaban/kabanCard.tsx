import { Avatar } from "radix-ui";
import { EnumStatusTask } from "../../../assets/enums/statusTask";
import { PriorityTask } from "../../../assets/enums/priorityTask";import { formatDateBR } from "../../../assets/utils/formarDate";
import { useSortable,  } from '@dnd-kit/react/sortable';

interface KanbanCardProps {
  task: {
    id: string,
    organizationId: string,
    projectId: string,
    title: string,
    description: string,
    status: EnumStatusTask,
    priority: PriorityTask,
    reporterId: string,
    dueDate: string,
    position: number,
    assignee?: {
      id: string,
      name: string,
      avatar?: string
    }
  }
}

export function KanbanCard({ task }: KanbanCardProps) {
  const { ref, isDragging  } = useSortable({
    id: task.id,
    index: task.position
  });

  return(
    <div 
      ref={ref}
      className={`bg-white p-4 rounded border shadow-sm ${isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'}`}
    >
      <h4 className="text-sm font-medium text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
        {task.title}
      </h4>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-col gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-max uppercase}`}>
            {task.priority === PriorityTask.HIGH ? 'Alta' : task.priority === PriorityTask.MEDIUM ? 'Média' : 'Baixa'}
          </span>
          <span className={`text-gray-500'}`}>
            Prazo: {formatDateBR(task.dueDate)}
          </span>
        </div>
        {
          task.assignee && (
            <Avatar.Root className="inline-flex size-8 select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
              <Avatar.Image
                className="size-full rounded-[inherit] object-cover"
                src={`${import.meta.env.VITE_BASE_URL}/uploads/users/${task.assignee.avatar}`}
                alt="Colm Tuite"
              />
              <Avatar.Fallback
                className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
                delayMs={600}
              >
                {task.assignee.name?.charAt(0).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
          )
        }
      </div>
    </div>
  )
}