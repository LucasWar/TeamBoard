import { Plus, SearchIcon } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { Select } from "../../../components/Select";
import { EnumRoles } from "../../../app/enums/roles";
import type { enumStatusProject } from "../../../app/enums/statusProject";
import { ProjectModal } from "./ModalProject";
import { useControllerProject } from "./useProjectController";
import { DeleteProjectModal } from "./ModalDeleteProject";
import Pagination from "../../../assets/components/Pagination";


export function ProjectsDashboard(){

  const { currentRole, 
          openModal, 
          projectsData, 
          projectsPagination, 
          handleCloseModal, 
          searchTerm, 
          handleSelectFilters, 
          handleChangeSearchTerm, 
          handleEditProject,
          selectedProject,
          handleCreateProject,
          handleCloseDeleteModal,
          handleOpenDeleteModal,
          confirmDelete,
          openDeleteModal,
          handleArqchiveProject,
          handlePageChange,
          filter,
        } = useControllerProject()

  
  return (
    <div className="flex-1 px-8 bg-gray-50 min-h-screen relative">
      <ProjectModal 
        open={openModal}
        onClose={handleCloseModal}
        projectId={selectedProject?.id}
        projectData={selectedProject 
          ? { 
              name: selectedProject.name, 
              description: selectedProject.description 
            } 
          : undefined }
      />
      <DeleteProjectModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
      />
      <div className="ml-4 mt-4 flex items-center justify-between">
        <div className="relative bg-white w-1/2 lg:w-1/4 shrink-0">
          <div className="absolute">
            <Select.Root
              defaultValue="all"
              onValueChange={(value: enumStatusProject | "all") => {
                handleSelectFilters({
                  status: value === "all" ? undefined : value,
                })
              }}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>

              <Select.Content>
                <Select.Item value="all">Todos</Select.Item>
                <Select.Item value="ACTIVE">Ativo</Select.Item>
                <Select.Item value="ARCHIVED">Arquivado</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <input
            className="border-none pl-23 pr-2 text-lg w-full h-8"
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => handleChangeSearchTerm(e.target.value)}
          />
        </div>

        <div className="hidden gap-5 lg:flex shrink-0">
          {(currentRole == EnumRoles.MANAGER ||
            currentRole == EnumRoles.ADMIN) && (
            <button
              className="bg-blue-600 px-4 py-2 text-white rounded-md cursor-pointer"
              onClick={() => handleCreateProject()}
            >
              Novo projeto
            </button>
          )}
        </div>
      </div>
      <div className="w-full overflow-x-auto pt-5">
        {projectsData && 
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              { projectsData.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    id={project.id}
                    status={project.status}
                    title={project.name}
                    describe={project.description}
                    advance={project.progress}
                    onEdit={handleEditProject}
                    onDelete={handleOpenDeleteModal}
                    onArchiving={handleArqchiveProject}
                  />
                ))
              }   
          </div>
        }
      </div>
       {projectsPagination && projectsPagination.total > 1 &&
          <Pagination 
            currentPage={filter.page}
            totalPages={projectsPagination.total}
            onPageChange={handlePageChange}
          />
        }
      {
        (currentRole == EnumRoles.MANAGER || currentRole == EnumRoles.ADMIN) &&
        <button className="flex fixed bottom-3 right-3 bg-blue-600 p-3 rounded-full text-white lg:hidden cursor-pointer" onClick={() => handleCreateProject()}>
          <Plus />
        </button>
      }
    </div>
  )
}