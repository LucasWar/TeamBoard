import { useControllerKaban } from './useControllerKaban';
import { useParams } from "react-router-dom";
import { EnumStatusTask } from '../../../assets/enums/statusTask';
import { KanbanColumn } from './kanbanColumn';
import {DragDropProvider} from '@dnd-kit/react';

const COLUMNS: { id: EnumStatusTask; title: string }[] = [
  { id: EnumStatusTask.TODO, title: 'A FAZER' },
  { id: EnumStatusTask.IN_PROGRESS, title: 'EM ANDAMENTO' },
  { id: EnumStatusTask.DONE, title: 'CONCLUÍDO' },
  { id: EnumStatusTask.BLOCKED, title: 'BLOQUEADO' },
];

export function KanbanBoard() {
  const { idProject } = useParams();

  if(!idProject){
    return (<div>Id não encontrado</div>)
  }

  const { tasks, setTasks } = useControllerKaban(idProject)

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen overflow-x-auto">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500 mb-1">Acme Corp / Projetos / WaiterApp</div>
          <h1 className="text-3xl font-bold text-gray-900">waiterapp</h1>
          <p className="text-gray-500 mt-2 max-w-2xl text-sm">
            Desenvolvimento de um APP voltado para restaurantes com gestão de mesas e pedidos em tempo real.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
          + Nova Tarefa
        </button>
      </header>

      <DragDropProvider
       onDragEnd={(event) => {
          if (event.canceled) return;

          const { source, target } = event.operation;
          if (!target || !source) return;
        
          setTasks(prev => {
            const targetTask = prev.find(t => t.id === target.id);

            const newStatus = targetTask
              ? targetTask.status // soltou em cima de outro card
              : target.id;        // soltou na coluna

            return prev.map(task =>
              task.id === source.id
                ? { ...task, status: newStatus }
                : task
            );
          });
        }}
      >
        <div className="flex gap-6 items-start">
          {COLUMNS.map((column) => {
            if(tasks){
              return (
                <KanbanColumn 
                  key={column.id} 
                  id={column.id} 
                  title={column.title}
                  tasks={tasks.filter(t => t.status === column.id)}
                />
              );
            }
          })}
        </div>
      </DragDropProvider>
    </div>
  );
}