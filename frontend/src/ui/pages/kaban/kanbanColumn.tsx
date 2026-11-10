import { KanbanCard } from "./kabanCard";
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { EditTask } from "../../../app/interfaces/editTask";
import type { Task } from "../../../app/interfaces/task";

interface KanbanColumnProps {
  id: string
  position?: number
  title: string
  tasks: Task[]
  handleEdit: (task: EditTask) => void
  handleDelete: (id: string) => void
}

export function KanbanColumn({id, tasks, title, handleEdit, handleDelete}: KanbanColumnProps){
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'Column',
    }
  });

  return (
    <div ref={setNodeRef} className="w-96 shrink-0 bg-gray-100/50 rounded-lg p-4 min-h-screen flex flex-col transition-colors duration-200 hover:bg-gray-100/80">
      
      {/* Título da Coluna */}
      <div className="flex justify-between items-center mb-4" >
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          {title} <span className="text-gray-400 font-normal ml-1">({tasks.length})</span>
        </h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">•••</button>
      </div>

      {/* Lista de Cards */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              Nenhuma tarefa
            </div>
          ) : (
            tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}