import { useState } from "react";
import type { EditOrganization } from "../../../assets/interfaces/organization";
import { OrganizationService } from "../../../services/organizationsServices";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useOrganizationController(){
  const queryClient = useQueryClient();
  const [openOrganizationModal, setOpenOrganizationModal] = useState(false)
  const [openOrganizationDeleteModal, setOpenOrganizationDeleteModal] = useState(false)
  const [selectedOrganizationData,setsSlectedOrganizationData] = useState<EditOrganization | null>(null)
  const [selectedOrganizationEditId,setSelectedOrganizationEditId] = useState<string>()
  const [selectedOrganizationDeleteId,setSelectedOrganizationDeleteId] = useState<string | null>()
  
  function handleSelectOrganization(id: string){
    setSelectedOrganizationEditId(id)
  }

  function handleOpenOrganizationModal(){
    setOpenOrganizationModal(true)
  }

  function handleCloseOrganizationModal(){
    setOpenOrganizationModal(false)
  }

  function handleOpenOrganizationDeleteModal(id: string){
    setSelectedOrganizationDeleteId(id);
    setOpenOrganizationDeleteModal(true)
  }

  function handleCloseOrganizationDeleteModal(){
    setSelectedOrganizationDeleteId(null)
    setOpenOrganizationDeleteModal(false)
  }

  function handleCreateProject() {
      setsSlectedOrganizationData(null);
      setOpenOrganizationModal(true);
  }

  function handleEditProject(organization: EditOrganization) {
    setsSlectedOrganizationData(organization);
    setOpenOrganizationModal(true);
  }

  const deleteOrganizationMutation = useMutation({
    mutationFn: (id: string) => OrganizationService.deleteOrganization(id),
    onSuccess: () => {
      toast.success('Projeto deletado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['myOrganizations'] });
    }
  });

  function confirmDelete() {
    if (selectedOrganizationDeleteId) {
      deleteOrganizationMutation.mutate(selectedOrganizationDeleteId, {
        onSuccess: () => {
          setOpenOrganizationDeleteModal(false)
        }
      });
    }
  }

  return {
    openOrganizationModal,
    handleOpenOrganizationModal,
    handleCloseOrganizationModal,
    selectedOrganizationData,
    handleEditProject,
    handleCreateProject,
    selectedOrganizationEditId,
    handleSelectOrganization,
    confirmDelete,
    openOrganizationDeleteModal,
    handleOpenOrganizationDeleteModal,
    handleCloseOrganizationDeleteModal
  }
}