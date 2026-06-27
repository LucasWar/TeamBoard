import type { EditTask } from "../../../../app/interfaces/editTask";
import { useTaskModalController } from "./useTaskModalController";
import { PriorityTask } from "../../../../app/enums/priorityTask";
import { priorityMap } from "../../../../app/utils/priorityMap";
import { Button } from "../../../../assets/components/Button";
import { Select } from "../../../../components/Select";
import { Modal } from "../../../../components/Modal";
import { Controller } from "react-hook-form";
import { useEffect } from "react";


interface CreateProjectModalProps {
  projetcId: string;
  taskRecord?: EditTask | null
  open: boolean;
  onClose:() => void;
}

export function TasktModal({onClose, open, taskRecord, projetcId}:CreateProjectModalProps) {
  const isEditing = !!taskRecord?.id;

  let taskData;

  if (taskRecord) {
    const { id, ...rest } = taskRecord;
    taskData = rest;
  }

  const { handleSubmit, register, errors, control } = useTaskModalController(
    projetcId,
    taskRecord?.id,
    taskData,
    onClose,
  );

  return(
    <Modal open={open} title={isEditing ? "Editar tarefa" : "Criar um tarefa"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <span>Nome</span>
            <input className="bg-white w-full rounded-lg border border-gray-500 px-3 h-10 text-gray-800 focus:border-gray-800 transition-all" {...register('title')} />
            {errors?.title && <span className="text-primary-red">{errors?.title.message}</span>}
          </div>
          <div>
            <span>Descrição</span>
            <input className="bg-white w-full rounded-lg border border-gray-500 px-3 h-10 text-gray-800 focus:border-gray-800 transition-all" {...register('description')} />
            {errors?.description && <span className="text-primary-red">{errors?.description.message}</span>}
          </div>
          <div>
            <span>Prazo</span>
            <input type="date" className="bg-white w-full rounded-lg border border-gray-500 px-3 h-10 text-gray-800 focus:border-gray-800 transition-all" {...register('dueDate')} />
            {errors?.dueDate && <span className="text-primary-red">{errors?.dueDate.message}</span>}
          </div>
          <div>
            <span>Responsavel</span>
            <input type="input" className="bg-white w-full rounded-lg border border-gray-500 px-3 h-10 text-gray-800 focus:border-gray-800 transition-all" {...register('assigneeEmail')} />
            {errors?.assigneeEmail && <span className="text-primary-red">{errors?.assigneeEmail.message}</span>}
          </div>
          <div>
            <span>Prioridade</span>
            <Controller
            name="priority"
            control={control}
            defaultValue={PriorityTask.LOW}
            render={({ field }) => (
              <Select.Root
                value={field.value}
                onValueChange={field.onChange}
              >
                <Select.Trigger className="w-full h-12 rounded-lg border border-gray-500 text-gray-800">
                  <Select.Value />
                </Select.Trigger>

                <Select.Content
                  className="w-[var(--radix-select-trigger-width)] z-99"
                  position="popper"
                  side="bottom"
                >
                  <Select.Item value={PriorityTask.LOW}>{priorityMap[PriorityTask.LOW].label}</Select.Item>
                  <Select.Item value={PriorityTask.MEDIUM}>{priorityMap[PriorityTask.MEDIUM].label}</Select.Item>
                  <Select.Item value={PriorityTask.HIGH}>{priorityMap[PriorityTask.HIGH].label}</Select.Item>
                  <Select.Item value={PriorityTask.URGENT}>{priorityMap[PriorityTask.URGENT].label}</Select.Item>
                </Select.Content>
              </Select.Root>
            )}
          />
        </div>
        </div>
        <Button type='submit' className="mt-3 w-full">
          {isEditing ? "Salvar alterações" : "Cadastrar"}
        </Button>
      </form>
    </Modal>
  )
}