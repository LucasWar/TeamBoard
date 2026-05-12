import { PriorityTask } from "../../../../app/enums/priorityTask";
import { EnumStatusTask } from "../../../../app/enums/statusTask";
import { cn } from "../../../../app/utils/cn";
import { formatDateBR } from "../../../../app/utils/formarDate";
import { priorityMap } from "../../../../app/utils/priorityMap";
import { Select } from "../../../../components/Select";
import { statusTaskMap } from "../../../../app/utils/statusTaskMap";
import { useUpdateStatusTask } from "../../../../app/hooks/useUpdateStatusTask";
import { useState } from "react";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    priority: PriorityTask;
    position: number;
    status: EnumStatusTask;
    dueDate?: string; 
  }
  onComplete: (id: string, currentSatus: EnumStatusTask) => void
}

export function TaskItem({ task, onComplete }: TaskItemProps ) {

  const { mutateAsync } = useUpdateStatusTask()

  const [isRemoving, setIsRemoving] = useState(false);

  async function handleComplete() {
    setIsRemoving(true);

    // espera a animação terminar
    setTimeout(() => {
      onComplete(task.id, task.status);
    }, 300);
  }


  return (
    <div className={`flex items-center justify-between bg-gray-50 p-4 hover:bg-gray-50  border-b last:border-b-0 border-gray-100 group transition-all duration-300 ease-in-out
      ${
          isRemoving
            ? "opacity-0 translate-x-10 scale-95 max-h-0 py-0"
            : "opacity-100 translate-x-0 scale-100 max-h-40"
        }
    `}>
      <div className="flex items-center gap-4">
        {/* Checkbox estilizado */}
        <input 
          onClick={() => handleComplete()}
          type="checkbox" 
          className="w-5 h-5 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        
        <div>
          <h4 className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
            {task.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            {/* <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">
              {task.projectName}
            </span> */}
            { task.dueDate &&
              <span className="text-xs text-gray-400">
                {formatDateBR(task.dueDate)}
              </span>
            }
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full uppercase',
          priorityMap[task.priority].classNameStatus
        )}>
          {priorityMap[task.priority].label}
        </span>
        
        {/* Select de Status rápido */}
        <Select.Root defaultValue={task.status} onValueChange={(t:EnumStatusTask) => {
          mutateAsync({
            id: task.id,
            newPosition: 0,
            oldStatus: task.status,
            newStatus: t,
          })
        }}>
          <Select.Trigger className="w-30 h-8 text-xs rounded-lg border border-gray-500 text-gray-800" defaultValue={task.priority}>
            <Select.Value />
          </Select.Trigger>

          <Select.Content
            className="w-[var(--radix-select-trigger-width)] z-99" 
            position="popper"
            side="bottom"
          >
            <Select.Item value={EnumStatusTask.TODO}>{statusTaskMap[EnumStatusTask.TODO].label}</Select.Item>
            <Select.Item value={EnumStatusTask.IN_PROGRESS}>{statusTaskMap[EnumStatusTask.IN_PROGRESS].label}</Select.Item>
            <Select.Item value={EnumStatusTask.DONE}>{statusTaskMap[EnumStatusTask.DONE].label}</Select.Item>
            <Select.Item value={EnumStatusTask.BLOCKED}>{statusTaskMap[EnumStatusTask.BLOCKED].label}</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  );
}