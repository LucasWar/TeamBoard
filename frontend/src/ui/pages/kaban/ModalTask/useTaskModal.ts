import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import toast from "react-hot-toast";
import { PriorityTask } from "../../../../app/enums/priorityTask";
import { tasksService } from "../../../../services/tasksServives";
import type { EditTask } from "../../../../assets/interfaces/task";
import { useEffect } from "react";
import { formatDateBR } from "../../../../app/utils/formarDate";


export function useTaskModal(projectId: string,taskId?: string, taskData?: Omit<EditTask, 'id'>, onClose?: () => void){
  const queryClient = useQueryClient();
  
  const schema = z.object({
    title: z.string().nonempty('Titulo não pode esta vazio'),
    dueDate: z.preprocess(
      (value) => value === '' ? undefined : value,
      z.coerce.date().optional()
    ),
    description: z.string().nonempty('Descrição não pode esta vazio'),
    priority: z.enum(PriorityTask,'Defina a prioridade da tarefa'),
    assigneeEmail: z
      .union([
        z.email('Digite um email válido'),
        z.literal('')
      ])
      .transform(v => v === '' ? undefined : v)
      .optional()
  })

  type formData = z.infer<typeof schema>

  const { formState: {errors}, register, handleSubmit: handleRegisterProject, reset, control } = useForm({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    if (taskData) {
      reset({
        ...taskData,
        assigneeEmail: taskData.assigneeEmail,
        dueDate: taskData.dueDate ? formatDateBR(String(taskData.dueDate),1) : undefined, // sua função aqui
      });
    } else {
      reset();
    }
  }, [taskId, reset]);

  const { mutateAsync: createTaskMutate} = useMutation({
    mutationFn: async ({data, projectId}: {data:formData, projectId:string}) => {
      await tasksService.create({task:data, projectId})
    },
    onSuccess: () => {
      toast.success('Tarefa criada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['listTasks'] });
    },
  })

  const { mutateAsync: updateTaskMutate} = useMutation({
    mutationFn: async ({ id, data} : {id: string, data:formData}) => await tasksService.update({params:data, taskId:id}),
    onSuccess: () => {
      toast.success('tarefa editada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['listTasks'] });
    }
  });

  const handleSubmit = handleRegisterProject(async (data: formData) => {
    try {
      if (taskId && taskData) {
        await updateTaskMutate({ id: taskId, data });
      } else if (taskId && !taskData) {
        console.log("Delete projeto")
      }
      else {
        await createTaskMutate({data, projectId});
      }

      if (onClose) {
        onClose();
      }
      
    } catch(error){
      console.log("Erro ao salvar projeto:", error)
    }
  })

  return {
    register,
    errors,
    handleSubmit,
    control
  }
}