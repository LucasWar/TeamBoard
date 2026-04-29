import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { OrganizationService } from "../../../services/organizationsServices";
import { enumPlan } from "../../../assets/enums/plan";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganization } from "../../../app/hooks/useOrganization";

export function useControllerOnboarding() {
  const queryClient = useQueryClient();
  const schema = z.object({
      name: z.string().nonempty('Nome não pode esta vazio'),
      plan: z.enum(enumPlan, 'Escolha um dos planos disponiveis'),
  })

  const { changeOrganization } = useOrganization()

  const {handleSubmit: handleCreateOrganization, formState: {errors}, register, control } = useForm({
    resolver: zodResolver(schema)
  })

  type formData = z.infer<typeof  schema>

  const { mutateAsync } = useMutation({
    mutationFn: async (data: formData) => { 
      return await OrganizationService.create(data) 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrganizations'] });
    }
  })

  const handleSubmit = handleCreateOrganization(async (data) => {
    try {
        const { id } = await mutateAsync(data)
        changeOrganization(id)
    }
    catch(error){
      console.log(error)
    }
  })

  return {
    control,
    register,
    errors,
    handleSubmit
  }
}