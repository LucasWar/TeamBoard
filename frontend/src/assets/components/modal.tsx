import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ModalExampleProps {
  onCloseModal: (value:boolean) => void
  open: boolean
}

export function ModalCreateOrganization({open, onCloseModal}: ModalExampleProps) {

  return (
      <Dialog open={open} onOpenChange={onCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modal no Vite 🚀</DialogTitle>
            <DialogDescription>
              Funcionando perfeitamente com shadcn/ui.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <input
              className="w-full border rounded p-2"
              placeholder="Digite algo..."
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onCloseModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => onCloseModal(false)}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}