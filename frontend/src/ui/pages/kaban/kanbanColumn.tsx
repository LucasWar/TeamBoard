import type { Task } from "../../../assets/interfaces/task";
import { KanbanCard } from "./kabanCard";
import {useDroppable} from '@dnd-kit/react';

interface KanbanColumnProps {
  id: string
  position?: number
  title: string
  tasks: Task[]
}

export function KanbanColumn({id, tasks, title}: KanbanColumnProps){
  const {ref} = useDroppable({
    id,
  });


  return (
    <div ref={ref} key={id} className="w-80 flex-shrink-0 bg-gray-100/50 rounded-lg p-4">
      
      {/* Título da Coluna */}
      <div className="flex justify-between items-center mb-4" >
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          {title} <span className="text-gray-400 font-normal ml-1">({tasks.length})</span>
        </h3>
        <button className="text-gray-400 hover:text-gray-600">•••</button>
      </div>

      {/* Lista de Cards */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <KanbanCard 
            key={task.id}
            task={task}
          />
          
        ))}
      </div>
    </div>
  );
}