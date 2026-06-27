import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { usersService } from "../../../../../services/userServices";
import toast from "react-hot-toast";

export function useChangePasswordController(onClose: () => void){
  const schema = z.object({
    newPassword: z.string().min(6,'Tamanho mínimo para nova senha deve ser 6'),
    oldPassword: z.string().min(6,'Tamanho mínimo para senha atual deve ser 6')
  })

  const { handleSubmit: changePasswordSubmit, formState: {errors}, register} = useForm({
    resolver: zodResolver(schema)
  })

  type changePasswordData = z.infer<typeof schema>

  const { mutateAsync } = useMutation({
      mutationFn: async (data: changePasswordData) => {
        return usersService.changePassword(data)
      }
  })

  const handleSubmit = changePasswordSubmit(async (data) => {
    try{
      await mutateAsync(data)
      toast.success("Senha alterada com sucesso !")
      onClose()
    }
    catch(error){
      console.log(error)
    }
  })

  return {
    register,
    errors,
    handleSubmit
  }
}