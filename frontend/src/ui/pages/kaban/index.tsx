import { useLocation, useParams } from "react-router-dom";
import { useControllerKaban } from './useControllerKaban';
import { EnumStatusTask } from '../../../app/enums/statusTask';
import { KanbanColumn } from './kanbanColumn';
import { KanbanCard } from './kabanCard'; // Importante: precisamos do card aqui para o Overlay
import { 
  DndContext, 
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import { TasktModal } from "./ModalTask";


const COLUMNS: { id: EnumStatusTask; title: string }[] = [
  { id: EnumStatusTask.TODO, title: 'A FAZER' },
  { id: EnumStatusTask.IN_PROGRESS, title: 'EM ANDAMENTO' },
  { id: EnumStatusTask.DONE, title: 'CONCLUÍDO' },
  { id: EnumStatusTask.BLOCKED, title: 'BLOQUEADO' },
];

export function KanbanBoard() {
  const { idProject } = useParams();
  const location = useLocation();

  const { title, describe } = location.state || {};
  
  if (!idProject) {
    return (<div>Id não encontrado</div>);
  }
  
  const { tasks, activeTask, handleDragEnd, handleDragStart, sensors, openModal, handleCloseModal, handleOpenModal, handleOpenEditModal, selectedTasks } = useControllerKaban(idProject);
  
  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen overflow-x-auto">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500 mb-1">Acme Corp / Projetos / {title}</div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-2 max-w-2xl text-sm">
            {describe}
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors" onClick={handleOpenModal}>
          + Nova Tarefa
        </button>
      </header>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 items-start">
          {/* Mapeamento das Colunas restaurado */}
          {COLUMNS.map((column) => {
            if (tasks) {
              return (
                <KanbanColumn 
                  key={column.id} 
                  id={column.id} 
                  title={column.title}
                  tasks={tasks.filter(t => t.status === column.id)}
                  handleEdit={handleOpenEditModal}
                />
              );
            }
            return null;
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <KanbanCard task={activeTask} isOverlay={true} onEdit={handleOpenEditModal} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TasktModal 
        projetcId={idProject}
        onClose={handleCloseModal}
        open={openModal}  
        taskRecord={selectedTasks}
      />
    </div>
    
  );
}