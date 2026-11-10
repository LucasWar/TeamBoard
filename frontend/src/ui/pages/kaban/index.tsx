import { useLocation, useParams } from "react-router-dom";
import { useControllerKaban } from './useControllerKaban';
import { EnumStatusTask } from '../../../app/enums/statusTask';
import { KanbanColumn } from './kanbanColumn';
import { KanbanCard } from './kabanCard';
import { 
  DndContext, 
  DragOverlay,
  pointerWithin,
  rectIntersection,
  type CollisionDetection,
} from '@dnd-kit/core';
import { useCallback, useRef } from "react";
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

  const { tasks,
    activeTask,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    sensors,
    openModal,
    handleCloseModal,
    handleOpenModal,
    handleOpenEditModal,
    selectedTasks,
    handleDeleteTask
  } = useControllerKaban(idProject ?? " ");

  const lastOverId = useRef<string | number | null>(null);

  /**
   * Prioriza colisão com CARDS (sortable items) em vez da coluna
   * inteira (container droppable). Isso evita que soltar sobre
   * qualquer área da coluna sempre "vença" contra o card específico
   * que está sob o ponteiro, o que fazia a task sempre ir pro final.
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args);

    // Entre as colisões por ponteiro, prioriza quem NÃO é uma coluna
    const itemCollisions = pointerCollisions.filter(
      (c) => COLUMNS.every((col) => col.id !== c.id)
    );

    if (itemCollisions.length > 0) {
      lastOverId.current = itemCollisions[0].id;
      return itemCollisions;
    }

    if (pointerCollisions.length > 0) {
      lastOverId.current = pointerCollisions[0].id;
      return pointerCollisions;
    }

    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) {
      lastOverId.current = rectCollisions[0].id;
    }
    return rectCollisions;
  }, []);

  if (!idProject) {
    return (<div>Id não encontrado</div>);
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen overflow-x-auto">
      <header className="mb-8 flex justify-between items-start">
        <div>
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
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 items-start">
          {COLUMNS.map((column) => {
            if (tasks) {
              return (
                <KanbanColumn 
                  key={column.id} 
                  id={column.id} 
                  title={column.title}
                  tasks={tasks.filter(t => t.status === column.id)} 
                  handleEdit={handleOpenEditModal}
                  handleDelete={handleDeleteTask}
                />
              );
            }
            return null;
          })}
        </div>

        <DragOverlay dropAnimation={{duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'}}>
          {activeTask ? (
            <div className="opacity-95 shadow-2xl">
              <KanbanCard task={activeTask} isOverlay={true} onEdit={handleOpenEditModal} onDelete={handleDeleteTask}/>
            </div>
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