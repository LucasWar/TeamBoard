import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { authService } from "../../../services/authServices";
import { useAuth } from "../../../app/hooks/useAuth";

export function LoginController() {
  const schema = z.object({
    email: z.email('Email invalido').nonempty('Email necessário'),
    password: z.string().nonempty('Senha necessária').min(6,'Senha deve conter no minimo 6 digitos')
  })

  type formData = z.infer<typeof schema>

  const { signin } = useAuth()

  const { mutateAsync, isPending } = useMutation({
    mutationFn:async (data: formData) => {
      return authService.login(data)
    }
  })

  const { register, formState: {errors}, handleSubmit: handleLoginUserForm } = useForm<formData>({
    resolver: zodResolver(schema)
  });

  const handleSubmit = handleLoginUserForm(async (data) => {
    try{
      const { accessToken } = await mutateAsync(data)
      signin(accessToken)
    }catch(error) {
      console.log(error)
    }
  })


  return {errors, register, handleSubmit, isPending}
}