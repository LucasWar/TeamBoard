import { useQuery } from "@tanstack/react-query";
import { OrganizationService } from "../../../services/organizationsServices";
import { useState } from "react";

export function useControllerMembers(){
  const [openModal,setOpenModal] = useState(false)

  const { data, isPending } = useQuery({
    queryKey: ['listMembers'],
    queryFn: async () => {
      return await OrganizationService.listMembers()
    }
  });

  function handleOpenModal(){
    setOpenModal(true)
  }

  function handleCloseModal(){
    setOpenModal(false)
  }

  return {
    data,
    isPending,
    openModal,
    handleOpenModal,
    handleCloseModal
  }
}