import { useContext } from "react";
import { ModalProviderContext } from "../contexts/modalProviderContext";

export function useModalProvider() {
  return useContext(ModalProviderContext)
}