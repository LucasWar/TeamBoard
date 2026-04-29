import { Button } from "../../../../assets/components/Button";
import { Modal } from "../../../../components/Modal";

interface DeleteOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteOrganizationModal({ open, onClose, onConfirm, isLoading }: DeleteOrganizationModalProps) {
  return (
    <Modal open={open} title="Excluir Organização" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-gray-700">
          Tem certeza que deseja excluir esta organização? Esta ação não poderá ser desfeita e todos os dados serão perdidos.
        </p>
        
        <div className="flex gap-3 justify-end mt-4">
          <Button 
            type="button" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            type="button" 
            className="bg-red-600 hover:bg-red-700 text-white" // Botão destrutivo
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Sim, excluir'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}