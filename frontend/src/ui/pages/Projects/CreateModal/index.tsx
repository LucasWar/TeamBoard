import { Input } from "../../../../assets/components/Input";
import { Modal } from "../../../../components/Modal";

interface CreateProjectModalProps {
  open: boolean
  onClose(): void
}

export function CreateProjectModal({onClose, open}:CreateProjectModalProps) {

  return(
    <Modal open={open} title="Criar um projeto" onClose={onClose}>
        <Input 
            name = 'name'
            placeholder="Nome"
        />

        <Input 
            name = 'description'
            placeholder="Descrição"
        />
    </Modal>
  )
}