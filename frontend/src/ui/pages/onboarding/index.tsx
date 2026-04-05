import { useAuth } from "../../../app/hooks/useAuth";
import { Button } from "../../../assets/components/Button";
import { Input } from "../../../assets/components/Input";
import { ArrowLeftFromLine } from "lucide-react";
import { useControllerOnboarding } from "./useContrllerOnboarding";
import { Select } from "../../../components/Select";
import { enumPlan } from "../../../assets/enums/plan";
import { Controller } from "react-hook-form";
export function Onboarding() {

  const { signout } = useAuth()
  const { errors, handleSubmit, register, control } = useControllerOnboarding()

  return (
    <div className="w-1/2">
      <button className="absolute top-2 left-5 text-white hover:text-red-300 transition-all" onClick={() => signout()}>
        <ArrowLeftFromLine />
      </button>
      <header className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-white">
          Nomeie sua primeira organização
        </h1>
      </header>

      <form className="mt-16 flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          placeholder="Nome"
          {...register("name")}
        />
        <Controller
          name="plan"
          control={control}
          defaultValue={enumPlan.FREE}
          render={({ field }) => (
            <Select.Root
              value={field.value}
              onValueChange={field.onChange}
            >
              <Select.Trigger className="w-full h-12 rounded-lg border border-gray-500 text-gray-800">
                <Select.Value />
              </Select.Trigger>

              <Select.Content
                className="w-[var(--radix-select-trigger-width)]"
                position="popper"
                side="bottom"
              >
                <Select.Item value={enumPlan.FREE}>Gratuito</Select.Item>
                <Select.Item value={enumPlan.PRO}>Pro</Select.Item>
                <Select.Item value={enumPlan.ENTERPRISE}>Corporativo</Select.Item>
              </Select.Content>
            </Select.Root>
          )}
        />
        <Button type="submit">
          Cadastrar
        </Button>
      </form>
    </div>
  )
}