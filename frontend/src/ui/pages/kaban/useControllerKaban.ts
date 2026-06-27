import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { tasksService } from "../../../services/tasksServives"
import { useEffect, useState } from "react"
import { arrayMove } from '@dnd-kit/sortable';
import { 
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import type { EnumStatusTask } from "../../../app/enums/statusTask";
import { useUpdateStatusTask } from "../../../app/hooks/useUpdateStatusTask";
import type { Task } from "../../../app/interfaces/task";
import type { EditTask } from "../../../app/interfaces/editTask";


export function useControllerKaban(idProject: string){
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<EditTask | null>(null)
  
  const [openModal, setOpenModal] = useState(false)

  const { data, isSuccess } = useQuery({
    queryKey: ['listTasks', idProject],
    queryFn: () => tasksService.listTasksByProjectId(idProject)
  })

  const { mutateAsync: deleteTask } = useMutation({
    mutationFn: async (id:string) => {
      await tasksService.deleteTask(id)
    },
    onSuccess:() => {
      queryClient.invalidateQueries({ queryKey: ['listTasks'] });
    }
  })

  useEffect(() => {
    if (isSuccess) {
      setTasks(data)
    }
  }, [isSuccess, data]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { mutateAsync } = useUpdateStatusTask()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  
  function handleDeleteTask(id:string){
    try {
      deleteTask(id)
    }
    catch(error){
      console.log(error)
    }
  }

  function handleCloseModal(){
    setOpenModal(false)
    if(selectedTasks) {
      setSelectedTasks(null)
    }
  }

  function handleOpenModal(){
    setOpenModal(true)
  }

  function handleOpenEditModal(task: EditTask){
    setSelectedTasks(task)
    setOpenModal(true)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks?.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null); // Limpa o overlay

    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setTasks(prev => {
      const activeIndex = prev.findIndex(t => t.id === activeId);
      const overIndex = prev.findIndex(t => t.id === overId);
      
      const activeTask = prev[activeIndex];
      const overTask = overIndex >= 0 ? prev[overIndex] : undefined;

      if (!activeTask) return prev;

      // Descobre se soltou em cima de outra task ou na área vazia da coluna
      const newStatus = overTask 
        ? overTask.status 
        : (overId as EnumStatusTask);

      let newTasks = [...prev];

      // Se mudou de status (mudou de coluna), atualiza o status primeiro
      if (activeTask.status !== newStatus) {
        newTasks[activeIndex] = { ...activeTask, status: newStatus };
      }

      // Move o item no array para a posição correta
      if (overIndex >= 0) {
        newTasks = arrayMove(newTasks, activeIndex, overIndex);
      }


      const taskId = activeTask.id;
      const oldStatus = activeTask.status;

      // Verificações:
      const statusChanged = oldStatus !== newStatus;
      const positionChanged = activeIndex !== overIndex; // Mudou de índice no array geral?

      // Se o status mudou OU a posição mudou, dispara a API
      if (statusChanged || positionChanged) {
        const tasksInTargetColumn = prev.filter(t => t.status === newStatus);
        let targetPosition = 0;

        if (overIndex === -1) {
          targetPosition = tasksInTargetColumn.length; 
        } else {
          // Descobre a posição do overId DENTRO apenas da coluna de destino
          targetPosition = tasksInTargetColumn.findIndex(t => t.id === overId);
        }

        try{
          mutateAsync({
            id: taskId,
            newStatus,
            oldStatus,
            newPosition: targetPosition
          })
        }
        catch(error){
          console.log(error)
        }
      }

      return newTasks;
    });
  };

  return {tasks, setTasks, handleDragEnd, sensors, activeTask, setActiveTask, handleDragStart, handleCloseModal, openModal, handleOpenModal, handleOpenEditModal, selectedTasks, handleDeleteTask}
}