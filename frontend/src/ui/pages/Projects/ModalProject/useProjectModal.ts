import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { projectService } from "../../../../services/projectsServices";
import { useEffect } from "react";
import toast from "react-hot-toast";
import type { EditProject } from "../../../../app/interfaces/projetcs";

export function useProjectModal(projectId?: string, projectData?: Omit<EditProject, 'id'>, onClose?: () => void){
  const queryClient = useQueryClient();
  
  const schema = z.object({
    name: z.string().nonempty('Nome não pode esta vazio'),
    description: z.string().nonempty('Descrição não pode esta vazio')
  })

  type formData = z.infer<typeof schema>

  const { formState: {errors}, register, handleSubmit: handleRegisterProject, reset } = useForm({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    if (projectData) {
      reset(projectData); 
    } else {
      reset({ name: '', description: '' });
    }
  }, [projectData, reset]);

  const { mutateAsync: createProjectMutate} = useMutation({
    mutationFn: async (data: formData) => {
      await projectService.createProject(data)
    },
    onSuccess: () => {
      toast.success('Projeto criado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['listProjects'] });
    },
  })

  const { mutateAsync: updateProjectMutate} = useMutation({
    mutationFn: async ({ id, data} : {id: string, data:formData}) => await projectService.updateProject(data,id),
    onSuccess: () => {
      toast.success('Projeto editado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['listProjects'] });
    }
  });

  const handleSubmit = handleRegisterProject(async (data: formData) => {
    try {
      if (projectId && projectData) {
        await updateProjectMutate({ id: projectId, data });
      } else if (projectId && !projectData) {
        console.log("Delete projeto")
      }
      else {
        await createProjectMutate(data);
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
  }
}