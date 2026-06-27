import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EditTask } from "../../../../app/interfaces/editTask";
import { PriorityTask } from "../../../../app/enums/priorityTask";
import { tasksService } from "../../../../services/tasksServives";
import { formatDateBR } from "../../../../app/utils/formarDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect } from "react";
import z from "zod";


export function useTaskModalController(projectId: string,taskId?: string, taskData?: Omit<EditTask, 'id'>, onClose?: () => void){
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
        assigneeEmail: taskData.emailAssignee,
        dueDate: taskData.dueDate ? formatDateBR(String(taskData.dueDate),1) : undefined, // sua função aqui
      });
    } else {
      console.log('ola')
      reset({
        title: "",
        description: "",
        assigneeEmail: "",
        priority: undefined,
        dueDate: undefined,
      });
    }
  }, [taskId, reset]);

  const { mutateAsync: createTaskMutate} = useMutation({
    mutationFn: async ({data, projectId, idempotencyKey}: {data:formData, projectId:string, idempotencyKey: string}) => {
      await tasksService.create({task:data, projectId}, idempotencyKey)
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
        const idempotencyKey = crypto.randomUUID();
        await createTaskMutate({data, projectId, idempotencyKey});
        reset({
          title: "",
          description: "",
          assigneeEmail: "",
          priority: undefined,
          dueDate: undefined,
        });
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