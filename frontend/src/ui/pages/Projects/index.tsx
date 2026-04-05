import { SearchIcon } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { useState } from "react";
import { useControllerProject } from "./useProjectController";
import { Select } from "../../../components/Select";
import { cn } from "../../../lib/utils";
import { useOrganization } from "../../../app/hooks/useOrganization";
import { EnumRoles } from "../../../assets/enums/roles";
import { percentageProjectProgress } from "../../../app/utils/percentageProjectProgress";


export function ProjectsDashboard(){
  const { currentRole } = useOrganization()
  const [visualizationProjects, setVisualizationProjects] = useState<"GRID" | "LIST">('GRID')
  const { projects } = useControllerProject()

  console.log(projects)
  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="ml-4 mt-4 flex justify-between">
        <div className="flex items-center gap-2 pl-2 bg-white border border-gray-300">
          <span>Status</span>
          <Select.Root defaultValue="all">
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

        <div className="relative bg-white border-2 border-gray-200">
          <SearchIcon className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            className="border pl-8 pr-2 text-lg w-full h-full"
            placeholder="Pesquisar"
          />
        </div>

        <div className="flex gap-5">
          <div className="flex gap-3 px-4 items-center bg-white border-2 border-gray-200">
            <button className={cn(visualizationProjects == 'GRID' && 'text-gray-500')} onClick={() => setVisualizationProjects("GRID")}>Grid</button>
            <button className={cn(visualizationProjects == 'LIST' && 'text-gray-500')} onClick={() => setVisualizationProjects("LIST")}>List</button>
          </div>
          {
            (currentRole == EnumRoles.MANAGER || currentRole == EnumRoles.ADMIN) &&
            <button className="bg-blue-600 px-2 text-white rounded-xs">Novo projeto</button>
          }
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
        {
          projects?.map((project) => (
            <ProjectCard 
              status={project.status}
              title={project.name}
              describe={project.description}
              advance={project.progress}
            />
          ))
        }
        
      </div>
    </div>
  )
}