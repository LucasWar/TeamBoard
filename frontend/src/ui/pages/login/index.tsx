import { Link } from "react-router-dom";
import { Input } from "../../../assets/components/Input";
import { Button } from "../../../assets/components/Button";
import { LoginController } from "./loginController";
 
export function Login() {
  const { errors, register, handleSubmit, isPending } = LoginController();

  return (
    <div className="w-1/2">
      <header className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-white">
          Entre em sua conta
        </h1>

        <p className="space-x-2">
          <span className="text-gray-300 tracking-[-0.5px]">
            Novo por aqui?
          </span>
          <Link to="/register" className="tracking-[-0.5px] font-medium text-secondary-bg">
            Crie uma conta
          </Link>
        </p>
      </header>

      <form className="mt-16 flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="E-mail"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          type="password"
          placeholder="Senha"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" className="mt-2 flex items-center justify-center" isLoading={isPending}>
          Entrar
        </Button>
      </form>
    </div>
  );
}