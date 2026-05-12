import { EnumStatusTask } from "../../../app/enums/statusTask";
import { useListMyTasks } from "../../../app/hooks/useTask";
import { useUpdateStatusTask } from "../../../app/hooks/useUpdateStatusTask";
import type { ListMyTasks } from "../../../services/tasksServives/listMyTasks";

export function useMyTasksController(){
  const { data:tasks } = useListMyTasks()

  const { mutateAsync } = useUpdateStatusTask()

  function completeTask(id: string, currentSatus: EnumStatusTask) {
    if (!tasks) {
      return;
    }

    Object.keys(tasks).forEach((key) => {
      const taskList = tasks[key as keyof ListMyTasks];

      const index = taskList.findIndex(task => task.id === id);

      if (index !== -1) {
        taskList.splice(index, 1);
      }
    });

    mutateAsync({
      id,
      newPosition: 0,
      newStatus: EnumStatusTask.DONE,
      oldStatus: currentSatus
    })
  }

  return {
    tasks,
    completeTask
  }
}