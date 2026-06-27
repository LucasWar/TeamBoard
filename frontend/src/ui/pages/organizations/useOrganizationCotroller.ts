import { useEffect, useState } from "react";
import { OrganizationService } from "../../../services/organizationsServices";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EditOrganization } from "../../../app/interfaces/organization";
import { useAuth } from "../../../app/hooks/useAuth";
import type { listOrganizationFilter } from "../../../services/userServices/myOrganizations";
import { useOrganization } from "../../../app/hooks/useOrganization";
import { useListOrganizations } from "../../../app/hooks/useListOrganizations";
import { createPageHandler } from "../../../app/utils/controllerPages";

export function useOrganizationController(){
  const queryClient = useQueryClient();
  const [openOrganizationModal, setOpenOrganizationModal] = useState(false)
  const [openOrganizationDeleteModal, setOpenOrganizationDeleteModal] = useState(false)
  const [selectedOrganizationData,setsSlectedOrganizationData] = useState<EditOrganization | null>(null)
  const [selectedOrganizationEditId,setSelectedOrganizationEditId] = useState<string>()
  const [selectedOrganizationDeleteId,setSelectedOrganizationDeleteId] = useState<string | null>()
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<listOrganizationFilter>({ page: 1, limit: 12, name: '' });

  const handlePageChange = createPageHandler(setFilter);

  const { changeOrganization, selectedOrganization } = useOrganization();
  const { signedIn } = useAuth();

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

  const handleChangeOrganizationLocal = (orgId: string) => {
    const org = organizations.find(o => o.organizationId === orgId);
    if (org) {
      changeOrganization(org.organizationId, org.role);
    }
  };

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

  useEffect(() => {
    const delay = setTimeout(() => {
      setFilter(prev => ({
        ...prev,
        name: searchTerm,
        page: 1
      }));
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const { data, isFetching } = useListOrganizations(signedIn, filter);

  const organizations = data?.data ?? [];

  const pagination = data?.pagination
  return {
    filter,
    pagination,
    setSearchTerm,
    searchTerm,
    organizations,
    changeOrganization,
    selectedOrganization,
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
    handleCloseOrganizationDeleteModal,
    handleChangeOrganizationLocal,
    handlePageChange,
  }
}