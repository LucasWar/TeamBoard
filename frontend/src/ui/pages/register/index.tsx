import { Link } from "react-router-dom";
import { Input } from "../../../assets/components/Input";
import { Button } from "../../../assets/components/Button";
import { useRegisterController } from "./useRegisterController";

import { Controller } from "react-hook-form";
import { ImageInput } from "../../../components/imageInput";


export function Register() {
  const { handleSubmit, register, control } = useRegisterController()

  return (
    <div className="w-1/2">
      <header className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-white">
          Crie sua conta
        </h1>

        <p className="space-x-2">
          <span className="text-gray-300 tracking-[-0.5px]">
            Ja possui uma conta?
          </span> 
          <Link to='/login' className="tracking-[-0.5px] font-medium text-secondary-bg">
            Login
          </Link>
        </p>
      </header>
      <form className="mt-16 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center">
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <ImageInput
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <Input type="text" placeholder="Nome" {...register('name')} />
        <Input type="email" placeholder="E-email" {...register('email')} />
        <Input type="password" placeholder="Senha"  {...register('password')} />
        <Button type="submit" className="mt-2">
          Criar contar
        </Button>
      </form>
    </div>
  )
}