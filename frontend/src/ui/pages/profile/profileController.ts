import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import type { User } from "../../../app/interfaces/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../../services/userServices";
import toast from "react-hot-toast";

export function useProfileController(user: User, onClose: () => void){
  const queryClient = useQueryClient();

  const [changePassword, setChangePassword] = useState(false);

  const schema = z.object({
    email: z.email("Digite um email valido").nonempty("Email não pode esta vazio"),
    name: z.string().nonempty("Este campo não pode estar vazio"),
    avatar: z.instanceof(File).optional(),
    avatarUrl: z.string().optional(),
  });
  
  type formData = z.infer<typeof schema>

  const {handleSubmit ,control, reset, register} = useForm({
    resolver: zodResolver(schema)
  })
  
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar,
      });
    } else {
      reset({
        name: '',
        email: '',
        avatarUrl: '',
      });
    }
  }, [user, reset]);

  const { mutateAsync, isPending} = useMutation({
    mutationFn: async (data: formData) => {
      const { avatarUrl, ...payload } = data;

      return await usersService.updateUser(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users','me'] })
      toast.success('Seus dados foram atualizados com sucesso')
      onClose()
    },
    onError: () => {
      toast.error('Error ao tentar atualizar seus dados')
    }
  })

  function handleSwitchChangePassword(){
    setChangePassword(prev => !prev)
  }

  const handleUpdateProfile = handleSubmit((data: formData) => {
    try {
      mutateAsync(data)
    }
    catch(error) {
      console.log(error)
    }
  })

  return {
    handleSwitchChangePassword,
    changePassword,
    register,
    control,
    handleUpdateProfile,
    isLoading: isPending
  }
}