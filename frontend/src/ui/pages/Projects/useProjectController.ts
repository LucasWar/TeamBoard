import { useEffect, useState } from "react";
import { useListProject } from "../../../app/hooks/useListProjects"
import type { listProjectsFilter } from "../../../services/projectsServices/listProjects";
import { useOrganization } from "../../../app/hooks/useOrganization";

export function useControllerProject() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [openModal, setOpenModal] = useState(true)
  const [filter, setFilter] = useState<listProjectsFilter>({page: currentPage, limit: 9, name: ''})
  const { currentRole } = useOrganization()
  const [visualizationProjects, setVisualizationProjects] = useState<"GRID" | "LIST">('GRID')
  
  const { data } = useListProject(filter)

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

  function handleOpenModal(){
    console.log("AQUI")
    setOpenModal(true)
  }
  
  function handleCloseModal(){
    console.log("AQUI")
    setOpenModal(false)
  }

  function handleChangeVisualizationProjects(model: "GRID" | "LIST") {
    setVisualizationProjects(model)
  }

  function handleChangeSearchTerm(search: string) {
    setSearchTerm(search)
  }

  function handleSelectFilters(filters?: listProjectsFilter) {
    setFilter((prev) => ({
      ...prev,
      ...filters,
      page: 1
    }))
  }

  return { 
    projects: data?.data ,
    openModal,
    currentRole,
    handleCloseModal,
    handleOpenModal,
    visualizationProjects,
    handleChangeVisualizationProjects,
    searchTerm,
    handleSelectFilters,
    handleChangeSearchTerm,
  }
}