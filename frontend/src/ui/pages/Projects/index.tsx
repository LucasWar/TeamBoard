import { Plus, SearchIcon } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { Select } from "../../../components/Select";
import { cn } from "../../../lib/utils";
import { EnumRoles } from "../../../assets/enums/roles";
import type { enumStatusProject } from "../../../assets/enums/statusProject";
import { CreateProjectModal } from "./CreateModal";
import { useControllerProject } from "./useProjectController";


export function ProjectsDashboard(){

  const {currentRole, openModal, projects, handleCloseModal, handleOpenModal, handleChangeVisualizationProjects, visualizationProjects, searchTerm, handleSelectFilters, handleChangeSearchTerm} = useControllerProject()

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen relative">
      <CreateProjectModal 
        open={openModal}
        onClose={handleCloseModal}
      />
      <div className="ml-4 mt-4 flex justify-between">
        <div className="flex items-center gap-2 pl-2 bg-white border border-gray-300">
          <span>Status</span>
          <Select.Root 
            defaultValue="all"
            onValueChange={(value: enumStatusProject | "all") => {
              handleSelectFilters({status: value === "all" ? undefined : value})
            }}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>

            <Select.Content onChange=''>
              <Select.Item value="all">Todos</Select.Item>
              <Select.Item value="ACTIVE">Ativo</Select.Item>
              <Select.Item value="ARCHIVED">Arquivado</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        <div className="relative bg-white border-2 border-gray-200 w-1/2 lg:w-1/4 ">
          <SearchIcon className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            className="border pl-8 pr-2 text-lg w-full h-full"
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => handleChangeSearchTerm(e.target.value)}
          />
        </div>

        <div className="hidden gap-5 lg:flex">
          <div className="flex gap-3 px-4 items-center bg-white border-2 border-gray-200 ">
            <button className={cn(visualizationProjects == 'GRID' && 'text-gray-500')} onClick={() => handleChangeVisualizationProjects("GRID")}>Grid</button>
            <button className={cn(visualizationProjects == 'LIST' && 'text-gray-500')} onClick={() => handleChangeVisualizationProjects("LIST")}>List</button>
          </div>
          {
            (currentRole == EnumRoles.MANAGER || currentRole == EnumRoles.ADMIN) &&
            <button className="bg-blue-600 px-2 text-white rounded-xs" onClick={() => handleOpenModal()}>Novo projeto</button>
          }
        </div>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-5">
        {
          projects?.map((project) => (
            <ProjectCard 
              key={project.id}
              status={project.status}
              title={project.name}
              describe={project.description}
              advance={project.progress}
            />
          ))
        }
        
      </div>
      <button className="flex fixed bottom-3 right-3 bg-blue-600 p-3 rounded-full text-white lg:hidden">
        <Plus />
      </button>
    </div>
  )
}