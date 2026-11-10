import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { tasksService } from "../../../services/tasksServives"
import { useEffect, useState, useRef } from "react"
import { arrayMove } from '@dnd-kit/sortable';
import { 
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import type { EnumStatusTask } from "../../../app/enums/statusTask";
import { useUpdateStatusTask } from "../../../app/hooks/useUpdateStatusTask";
import type { Task } from "../../../app/interfaces/task";
import type { EditTask } from "../../../app/interfaces/editTask";
import { io, type Socket } from "socket.io-client";
import { localStorageKeys } from "../../../app/config/localStorageKeys";

export function useControllerKaban(idProject: string){
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<EditTask | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      // Ordena por position aqui, UMA vez, no load inicial.
      // Depois disso, quem manda na ordem visual é o próprio array
      // do state (reordenado ao vivo pelo onDragOver) — não re-sortamos
      // por position a cada render, senão isso sobrescreve o drag ao vivo.
      const sorted = [...data].sort((a, b) => a.position - b.position);
      setTasks(sorted);
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
      // Guarda o snapshot ORIGINAL (status/position antes de qualquer
      // reordenação ao vivo) — é isso que vamos mandar como old* pro backend.
      setActiveTask(task);
    }
  };

  /**
   * Reordena o array de tasks EM TEMPO REAL enquanto o item é arrastado
   * por cima de outro card ou de uma coluna vazia. É esse reorder ao vivo
   * (padrão oficial do dnd-kit pra multi-container) que faz o card "seguir"
   * o cursor com precisão — sem isso, qualquer cálculo feito só no dragEnd
   * fica sujeito a rects desatualizados/offset.
   */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    if (!isActiveATask) return;

    const isOverATask = over.data.current?.type === 'Task';

    setTasks((prev) => {
      const activeIndex = prev.findIndex(t => t.id === activeId);
      if (activeIndex === -1) return prev;

      const current = prev[activeIndex];

      let newStatus: EnumStatusTask;
      if (isOverATask) {
        const overTask = prev.find(t => t.id === overId);
        if (!overTask) return prev;
        newStatus = overTask.status;
      } else {
        // Soltou em cima da coluna (área vazia), overId é o id da coluna
        newStatus = overId as EnumStatusTask;
      }

      if (current.status === newStatus) {
        // Mesma coluna: só reordena se estiver sobre outro card
        if (isOverATask) {
          const overIndex = prev.findIndex(t => t.id === overId);
          if (overIndex === -1 || overIndex === activeIndex) return prev;
          return arrayMove(prev, activeIndex, overIndex);
        }
        return prev;
      }

      // Trocou de coluna: atualiza status e move pra perto do overIndex
      const updated = [...prev];
      updated[activeIndex] = { ...current, status: newStatus };

      if (isOverATask) {
        const overIndex = updated.findIndex(t => t.id === overId);
        if (overIndex !== -1) {
          return arrayMove(updated, activeIndex, overIndex);
        }
      }

      // Soltou na área vazia da coluna -> vai pro final dela
      let lastIndexOfStatus = -1;
      updated.forEach((t, idx) => {
        if (t.status === newStatus) lastIndexOfStatus = idx;
      });
      
      if (lastIndexOfStatus !== -1 && lastIndexOfStatus !== activeIndex) {
        return arrayMove(updated, activeIndex, lastIndexOfStatus);
      }

      return updated;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const draggedTaskSnapshot = activeTask; // status/position ANTES do drag
    setActiveTask(null);

    if (!over || !draggedTaskSnapshot) return;

    const activeId = active.id as string;

    setTasks((prev) => {
      const currentIndex = prev.findIndex(t => t.id === activeId);
      if (currentIndex === -1) return prev;

      const current = prev[currentIndex];
      const newStatus = current.status; // já atualizado ao vivo pelo onDragOver

      // A ordem final já está correta no array (fruto do onDragOver),
      // então a posição é simplesmente o índice dentro da coluna.
      const columnTasks = prev.filter(t => t.status === newStatus);
      const newPosition = columnTasks.findIndex(t => t.id === activeId);

      const oldStatus = draggedTaskSnapshot.status;
      const oldPosition = draggedTaskSnapshot.position;

      if (oldStatus !== newStatus || oldPosition !== newPosition) {
        // Clear previous timeout if exists
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }

        // Add debounce to prevent multiple updates
        updateTimeoutRef.current = setTimeout(() => {
          try {
            mutateAsync({
              id: activeId,
              newStatus,
              oldStatus,
              newPosition,
            }).catch((error) => {
              console.error('Erro ao atualizar tarefa:', error);
            });
          } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
          }
        }, 300);
      }

      return prev; // nenhuma mudança adicional necessária
    });
  };

  useEffect(() => {
    const token = localStorage.getItem(
      localStorageKeys.ACCESS_TOKEN
    );

    if (!token) return;

    const socket: Socket = io('http://localhost:3000/tasks', {
      auth: {
        token,
      },
      extraHeaders: {
        project_id: idProject,
      },
    });

    socket.on('task.created', (task: Task) => {
      setTasks((currentTasks) => {
        if (currentTasks.some((item) => item.id === task.id)) {
          return currentTasks;
        }
        return [...currentTasks, task];
      });
    });

    socket.on('task.updated', (task: Task) => {
      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === task.id ? task : item
        )
      );
    });

    socket.on('task.deleted', (taskId: string) => {
      setTasks((currentTasks) =>
        currentTasks.filter((item) => item.id !== taskId)
      );
    });

    // Fonte de verdade da reordenação: corrige qualquer drift do
    // reorder otimista, tanto pra quem arrastou quanto pros outros
    // clients. Depois de mesclar, re-sorta por position pra manter
    // a ordem do array consistente com o que veio do backend.
    socket.on(
      'tasks.reordered',
      (payload: { projectId: string; movedTask: Task; tasks: Task[] }) => {
        setTasks((currentTasks) => {
          const affectedMap = new Map(payload.tasks.map(t => [t.id, t]));
          affectedMap.set(payload.movedTask.id, payload.movedTask);

          const existingIds = new Set(currentTasks.map(t => t.id));

          const merged = currentTasks.map(t =>
            affectedMap.has(t.id) ? affectedMap.get(t.id)! : t
          );

          const missing = payload.tasks.filter(t => !existingIds.has(t.id));

          return [...merged, ...missing].sort((a, b) => a.position - b.position);
        });
      }
    );

    socket.on('disconnect', (reason) => {
      console.log('Socket desconectado:', reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [idProject]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    tasks,
    setTasks,
    handleDragEnd,
    handleDragOver,
    sensors,
    activeTask,
    setActiveTask,
    handleDragStart,
    handleCloseModal,
    openModal,
    handleOpenModal,
    handleOpenEditModal,
    selectedTasks,
    handleDeleteTask
  }
}