import * as Dialog from "@radix-ui/react-dialog"

import type React from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { cn } from "../lib/utils"

interface ModalProps {
  open: boolean
  children: React.ReactNode
  title: string
  rightAction?: React.ReactNode
  onClose?(): void;
}


export function Modal({open, onClose, children, title, rightAction}: ModalProps) {
  return(
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay 
          className={
            cn(
              "fixed inset-0 bg-black/80 z-50 backdrop-blur-sm",
              'data-[state=open]:animate-overlay-show'
            )}
        
        />
        <Dialog.Content
          className={cn(
            'fixed top-[50%] left-[50%] -translate-y-1/2 p-6 space-y-10 bg-white rounded-2xl z-51 shadow-[0px_11px_20px_0px_rgba(0,0,0,0.10)] w-full max-w-100 outline-none',
            'data-[state=open]:animate-content-show'
          )}
        >
          <Dialog.Title className="h-12 flex items-center justify-between text-gray-800">
            <button className="w-12 h-12 flex items-center justify-center outline-none">
              <Cross2Icon className="w-6 h-6" onClick={onClose}/>
            </button>
            <span className="text-lg tracking-[-1px]">{title}</span>
            <div className="w-12 h-12 flex items-center justify-center">{rightAction}</div>
          </Dialog.Title>

          <div>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

