import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authService } from "../../../services/authServices";
import { useAuth } from "../../../app/hooks/useAuth";
import type { RegisterParams } from "../../../services/authServices/register";

export function useRegisterController() {
  const schema = z.object({
    avatar: z.file().optional(),
    name: z.string().nonempty('Nome não pode esta vazio'),
    email: z.email('Email não é valido').nonempty('Email é obrigátorio'),
    password: z.string().nonempty('Senha é obrigátorio').min(6, 'Senha precisa ter no mínimo 6 caracteres')
  })

  type formData = z.infer<typeof  schema>

  const { signin } = useAuth()

  const { mutateAsync } = useMutation({
    mutationFn: async (data:RegisterParams) => {
      return await authService.register(data)
    }
  })

  const { handleSubmit: handleRegisterUserForm, formState: { errors }, register, control } = useForm<formData>({
    resolver: zodResolver(schema)
  })

  const handleSubmit = handleRegisterUserForm(async (data) => {
    try{
      const {accessToken} = await mutateAsync(data)

      signin(accessToken)
    }
    catch(error) {
      console.log(error)
    }
  })

  return { errors, register, handleSubmit , control}
}