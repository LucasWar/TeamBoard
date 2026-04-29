import { Button } from "../../../../assets/components/Button";
import type { EditProject } from "../../../../assets/interfaces/projetcs";
import { Modal } from "../../../../components/Modal";
import { useProjectModal } from "./useProjectModal";

interface CreateProjectModalProps {
  projectId?: string;
  projectData?: Omit<EditProject, 'id'>;
  open: boolean;
  onClose:() => void;
}

export function ProjectModal({onClose, open, projectData, projectId}:CreateProjectModalProps) {
  const { handleSubmit, register, errors } = useProjectModal(projectId, projectData, onClose);

  const isEditing = !!projectId;

  return(
    <Modal open={open} title={isEditing ? "Editar projeto" : "Criar um projeto"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <span>Nome</span>
            <input className="bg-white w-full rounded-lg border border-gray-500 px-3 h-10 text-gray-800 focus:border-gray-800 transition-all" {...register('name')} />
            {errors?.name && <span className="text-primary-red">{errors?.name.message}</span>}
          </div>
          <div>
            <span>Descrição</span>
            <input className="bg-white w-full rounded-lg border border-gray-500 px-3 h-10 text-gray-800 focus:border-gray-800 transition-all" {...register('description')} />
            {errors?.description && <span className="text-primary-red">{errors?.description.message}</span>}
          </div>
        </div>
        <Button type='submit' className="mt-3 w-full">
          {isEditing ? "Salvar alterações" : "Cadastrar"}
        </Button>
      </form>
    </Modal>
  )
}