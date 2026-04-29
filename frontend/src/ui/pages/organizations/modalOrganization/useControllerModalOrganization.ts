import { useForm } from "react-hook-form";
import { enumPlan } from "../../../../assets/enums/plan"
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrganizationService } from "../../../../services/organizationsServices";
import type { EditOrganization } from "../../../../assets/interfaces/organization";
import { useEffect } from "react";

export function useControllerModalOrganization(organizationId?: string, organizationData?: EditOrganization | null, onClose?: () => void) {
  const queryClient = useQueryClient();
  const schema = z.object({
    name: z.string().nonempty('Nome não pode esta vazio'),
    plan: z.enum(enumPlan, 'Escolha um dos planos disponiveis'),
  })

  const {handleSubmit: handleCreateOrganization, formState: {errors}, register, control, reset } = useForm({
    resolver: zodResolver(schema)
  })

  type formData = z.infer<typeof  schema>

  useEffect(() => {
    if (organizationData) {
      reset(organizationData); 
    } else {
      reset({ name: '', plan: enumPlan.FREE });
    }
  }, [organizationData, reset]);

  const { mutateAsync:createOrganizationMutate } = useMutation({
    mutationFn: async (data: formData) => { 
      return OrganizationService.create(data) 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrganizations'] });
    }
  })

  const { mutateAsync: updateOrganizationMutate } = useMutation({
    mutationFn: async ({id, data}:{id: string,data: formData}) => { 
      return OrganizationService.update(id, data) 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrganizations'] });
    }
  })

  const handleSubmit = handleCreateOrganization(async (data: formData) => {
    try {
      if (organizationId && organizationData) {
        await updateOrganizationMutate({ id: organizationId, data });
      } else if (organizationId && !organizationData) {
        console.log("Delete projeto")
      }
      else {
        await createOrganizationMutate(data);
      }

      if (onClose) {
        onClose();
      }
      
    } catch(error){
      console.log("Erro ao salvar projeto:", error)
    }
  })

  return {
    control,
    register,
    errors,
    handleSubmit
  }
}