import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authService } from "../../../services/authServices";
import { useAuth } from "../../../app/hooks/useAuth";
import type { RegisterParams } from "../../../services/authServices/register";

export function useRegisterController() {
  const schema = z.object({
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

  const { handleSubmit: handleRegisterUserForm, formState: { errors }, register } = useForm<formData>({
    resolver: zodResolver(schema)
  })

  const handleSubmit = handleRegisterUserForm(async (data) => {
    try{
      const { accesseToken } = await mutateAsync(data)
      signin(accesseToken)
    }
    catch(error) {
      console.log(error)
    }
  })

  return { errors, register, handleSubmit }
}