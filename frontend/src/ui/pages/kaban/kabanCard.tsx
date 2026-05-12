import { Avatar } from "radix-ui";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { priorityMap } from "../../../app/utils/priorityMap";
import { cn } from "../../../lib/utils";
import type { EditTask, Task } from "../../../assets/interfaces/task";
import { formatDateBR } from "../../../app/utils/formarDate";
import { useMemo } from "react";
import { X } from "lucide-react";

interface KanbanCardProps {
  task: Task
  isOverlay?: boolean;
  onEdit: (task: EditTask) => void
}

export function KanbanCard({ task, isOverlay, onEdit }: KanbanCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const taskDataEdit = useMemo(() => ({
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    title: task.title,
    id: task.id,
    assigneeEmail: task.assignee?.email
  }), [task]);

  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="bg-gray-100 border-2 border-dashed border-gray-300 p-4 rounded h-[120px] opacity-50"
      />
    );
  }

  return(
    <div 
      onClick={() => onEdit(taskDataEdit)}
      ref={setNodeRef} 
      style={style}    
      {...attributes}  
      {...listeners}   
      className={`bg-white p-4 rounded border shadow-sm ${isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'}`}
    >
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {task.title}
        </h4>
        <div className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()

            console.log('Excluir')
          }}
        > 
          <X className="w-4 h-4"/>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-col gap-2">
          <span className={cn(`text-[10px] font-bold px-2 py-0.5 rounded w-max uppercase}`,priorityMap[task.priority].classNameStatus)}>
            {priorityMap[task.priority].label}
          </span>
          {task.dueDate &&
            <span className={`text-gray-500'}`}>
              Prazo: {formatDateBR(task.dueDate)}
            </span>
          }
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