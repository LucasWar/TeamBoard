import z from "zod";
import { EnumRoles } from "../../../../app/enums/roles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrganizationService } from "../../../../services/organizationsServices";
import toast from "react-hot-toast";

export function useControllerAddMember(onClose: () => void){
  const queryClient = useQueryClient();

  const schema = z.object({
    email: z.email('Digite um email válido'),
    role: z.enum(EnumRoles)
  })

  const {  handleSubmit: handleSubmitAddMember, register, formState: {errors}, control, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: EnumRoles.USER
    }
  })

  type formData = z.infer<typeof schema>

  const { mutateAsync } = useMutation({
    mutationFn: async (data: formData) => {
      return await OrganizationService.addMember(data)
    },
    onSuccess: () => {
      toast.success('Membro adicionado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['listMembers'] });
    }
  })

  const handleSubmit = handleSubmitAddMember((data: formData) => {
    try {
      mutateAsync(data)
      reset()
      onClose()
    }
    catch(errors) {
      console.log(errors)
    }
  })

  return {
    register,
    errors,
    handleSubmit,
    control
  }
}