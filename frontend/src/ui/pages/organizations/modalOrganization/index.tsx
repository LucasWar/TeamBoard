import { Controller } from "react-hook-form";
import { enumPlan } from "../../../../app/enums/plan";
import { Modal } from "../../../../components/Modal";
import { Select } from "../../../../components/Select";
import { Input } from "../../../../assets/components/Input";
import { useControllerModalOrganization } from "./useControllerModalOrganization";
import { Button } from "../../../../assets/components/Button";
import type { EditOrganization } from "../../../../assets/interfaces/organization";


interface OrganizationModalProps {
  organizationId?: string;
  organizationData?: EditOrganization | null;
  open: boolean;
  onClose:() => void;
}

export function OrganizationModal({onClose, open, organizationData, organizationId}:OrganizationModalProps){

  const { errors, handleSubmit, register, control, } = useControllerModalOrganization(organizationId, organizationData, onClose)

  const isEditing = !!organizationId;

  return (
    <Modal open={open} title={isEditing ? "Editar Organização" : "Criar uma organização"} onClose={onClose}>
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
                className="w-[var(--radix-select-trigger-width)] z-90" 
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
        <Button type='submit' className="mt-3 w-full">
          {isEditing ? "Salvar alterações" : "Cadastrar"}
        </Button>
      </form>
    </Modal>
  )
}