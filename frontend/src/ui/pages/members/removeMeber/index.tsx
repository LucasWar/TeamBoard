import { Modal } from "../../../../components/Modal";
import { Button } from "../../../../assets/components/Button";

interface CreateAddMemberProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function RemoveMemberModal({onClose, open, onConfirm, isLoading}:CreateAddMemberProps){
  return(
    <Modal open={open} title="Excluir membro" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-gray-700">
          Tem certeza que deseja remover esse membro ?
        </p>
        
        <div className="flex gap-3 justify-between mt-4">
          <Button 
            type="button" 
            className="bg-red-600 hover:bg-red-700 text-white" // Botão destrutivo
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Sim, excluir'}
          </Button>

          <Button 
            type="button" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}