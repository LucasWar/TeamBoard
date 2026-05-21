import { useMyTasksController } from './useMyTasksController';
import { TaskItem } from './components/sectionItem';

export function MyTasks() {
  const {tasks, completeTask} = useMyTasksController()

  return (
    <div className="flex-1 p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Minhas Tarefas</h1>
        <p className="text-sm text-gray-500 mt-1">Gestão centralizada de todas as tuas responsabilidades.</p>
      </header>

      <div className="w-full space-y-8">
        
        {/* SECÇÃO: ATRASADAS */}
        {tasks && tasks.late.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              Atrasadas
            </h2>
            <div className="bg-white rounded-lg border border-red-100 shadow-sm overflow-hidden">
              {tasks.late.map(task => <TaskItem key={task.id} task={task} onComplete={completeTask}/>)}
            </div>
          </section>
        )}

        {/* SECÇÃO: HOJE */}
        <section>
          <h2 className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
            Hoje
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {tasks && tasks.today.length > 0 ? (
              tasks.today.map(task => <TaskItem key={task.id} task={task} onComplete={completeTask}/>)
            ) : (
              <p className="p-4 text-sm text-gray-400 italic">Sem tarefas para hoje. Bom trabalho!</p>
            )}
          </div>
        </section>

        {/* SECÇÃO: PRÓXIMAS */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            Próximas
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {tasks &&  tasks.upcoming.map(task => <TaskItem key={task.id} task={task} onComplete={completeTask}/>)}
          </div>
        </section>

      </div>
    </div>
  );
}