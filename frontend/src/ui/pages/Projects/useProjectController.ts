import { useEffect, useState } from "react";
import { useListProject } from "../../../app/hooks/useListProjects"
import type { listProjectsFilter } from "../../../services/projectsServices/listProjects";
import { useOrganization } from "../../../app/hooks/useOrganization";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../../../services/projectsServices";
import type { ChangeStatusProjectParams } from "../../../services/projectsServices/archiveProject";
import toast from "react-hot-toast";
import type { EditProject } from "../../../app/interfaces/projetcs";
import { createPageHandler } from "../../../app/utils/controllerPages";

export function useControllerProject() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [filter, setFilter] = useState<listProjectsFilter>({page: 1, limit: 9, name: ''})
  const { currentRole } = useOrganization()
  const [visualizationProjects, setVisualizationProjects] = useState<"GRID" | "LIST">('GRID')

  const [selectedProject,setSelectedProject] = useState<EditProject | null>(null)

  const { data } = useListProject(filter)

  const handlePageChange = createPageHandler(setFilter);

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
  

  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      toast.success('Projeto deletado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['listProjects'] });
    }
  });

  const archiveProjectMutation = useMutation({
    mutationFn: ({id, params}:{id: string, params: ChangeStatusProjectParams}) => projectService.changeStatusProject(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listProjects'] });
    }
  });

  function handleCloseModal(){
    setOpenModal(false)
  }

  function handleOpenDeleteModal(id: string){
    setProjectToDeleteId(id);
    setOpenDeleteModal(true);
  }

  function handleCloseDeleteModal(){
    setProjectToDeleteId(null);
    setOpenDeleteModal(false);
  }

  function confirmDelete() {
    if (projectToDeleteId) {
      deleteProjectMutation.mutate(projectToDeleteId, {
        onSuccess: () => {
          handleCloseDeleteModal();
        }
      });
    }
  }

  function handleArqchiveProject(id: string, params: ChangeStatusProjectParams) {
    if (id) {
      archiveProjectMutation.mutate({id, params});
    }
  }

  function handleChangeVisualizationProjects(model: "GRID" | "LIST") {
    setVisualizationProjects(model)
  }

  function handleChangeSearchTerm(search: string) {
    setSearchTerm(search)
  }

  function handleCreateProject() {
    setSelectedProject(null);
    setOpenModal(true);
  }

  function handleEditProject(project: EditProject) {
    setSelectedProject(project);
    setOpenModal(true);
  }

  function handleSelectFilters(filters?: Omit<listProjectsFilter,'page' | 'limit'>) {
    setFilter((prev) => ({
      ...prev,
      ...filters,
      page: 1,
      limit: 9
    }))
  }

  return { 
    filter,
    projectsData: data ? data.data.data : [],
    projectsPagination: data ? data.data.pagination : undefined,
    openModal,
    currentRole,
    openDeleteModal,
    selectedProject,
    handleCloseModal,
    visualizationProjects,
    handleChangeVisualizationProjects,
    searchTerm,
    handleSelectFilters,
    handleChangeSearchTerm,
    handleCloseDeleteModal,
    handleOpenDeleteModal,
    handleCreateProject,
    handleEditProject,
    confirmDelete,
    handleArqchiveProject,
    handlePageChange

  }
}