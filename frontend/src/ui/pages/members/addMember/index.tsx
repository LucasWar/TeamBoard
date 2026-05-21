import { Controller } from "react-hook-form";
import { Button } from "../../../../assets/components/Button";
import { Modal } from "../../../../components/Modal";
import { useControllerAddMember } from "./useControllerAddMember";
import { Select } from "../../../../components/Select";
import { EnumRoles } from "../../../../app/enums/roles";

interface CreateAddMemberProps {
  open: boolean;
  onClose:() => void;
}

export function AddMemberModal({onClose, open}:CreateAddMemberProps){
  const {handleSubmit, errors, register, control} = useControllerAddMember(onClose)

   return(
    <Modal open={open} title='Adicionar novo membro' onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <span>Email</span>
            <input className="bg-white w-full rounded-lg border border-gray-500 px-3 h-10 text-gray-800 focus:border-gray-800 transition-all" {...register('email')} />
            {errors?.email && <span className="text-primary-red">{errors?.email.message}</span>}
          </div>
          <div className="flex flex-col">
            <span>Cargo</span>
            {/*<input className="bg-white w-full rounded-lg border border-gray-500 px-3 h-10 text-gray-800 focus:border-gray-800 transition-all" {...register('')} />
            {errors?.role && <span className="text-primary-red">{errors?.role.message}</span>} */}
            <Controller 
              name="role"
              control={control}
              render={({field}) => (
                <Select.Root
                  value={field.value || EnumRoles.USER}
                  onValueChange={field.onChange}
                  defaultValue={EnumRoles.USER}
                >
                  <Select.Trigger className="w-full border border-gray-500 rounded-lg py-5">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content className="z-99 w-60">
                    <Select.Item value={EnumRoles.ADMIN}>
                      ADMINISTRADOR
                    </Select.Item>
                    <Select.Item value={EnumRoles.MANAGER}>
                      GERENTE
                    </Select.Item>
                    <Select.Item value={EnumRoles.USER}>
                      MEMBRO
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              )}
            />
            {errors?.role && <span className="text-primary-red">{errors?.role.message}</span>}
          </div>
        </div>
        <Button type='submit' className="mt-3 w-full">
          Adicionar membro
        </Button>
      </form>
    </Modal>
  )
}