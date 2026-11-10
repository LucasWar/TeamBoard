import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrganizationService } from "../../../services/organizationsServices";
import { useState } from "react";
import toast from "react-hot-toast";

export function useControllerMembers(){
  const queryClient = useQueryClient();
  const [openModal,setOpenModal] = useState(false)
  const [openRemoveMemberModal, setOpenRemoveMemberModal] = useState(false)
  const [memberRemoveId, setMemberId] = useState<string | null>(null);
  
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

  const removeMemberQuery = useMutation({
    mutationFn: async (memberId: string) => {
      await OrganizationService.removeMember(memberId)
    },
    onSuccess: () => {
      toast.success('Projeto deletado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['listMembers'] });
    }
  })

  function handleOpenRemoveMemberModal(id: string){
    setMemberId(id);
    setOpenRemoveMemberModal(true);
  }

  function handleCloseRemoveMemberModal(){
    setMemberId(null);
    setOpenRemoveMemberModal(false);
  }

  function confirmRemove() {
    if (memberRemoveId) {
      removeMemberQuery.mutate(memberRemoveId, {
        onSuccess: () => {
          handleCloseRemoveMemberModal();
        }
      });
    }
  }

  return {
    data,
    isPending,
    openModal,
    handleOpenModal,
    handleCloseModal,
    handleOpenRemoveMemberModal,
    handleCloseRemoveMemberModal,
    confirmRemove,
    openRemoveMemberModal,
  }
}