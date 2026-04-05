import { useQuery } from "@tanstack/react-query";
import { projectService } from "../../services/projectsServices";
import type { listProjectsFilter } from "../../services/projectsServices/listProjects";

export function useListProject(filter: listProjectsFilter){
  return useQuery({
    queryKey: ['listProjects',filter],
    queryFn: () => projectService.listProjects(filter)
  })
}