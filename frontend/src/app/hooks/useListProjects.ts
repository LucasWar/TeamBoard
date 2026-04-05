import { useQuery } from "@tanstack/react-query";
import { listProjects } from "../../services/projectsServices/listProjects";

export function useListProject(){
  return useQuery({
    queryKey: ['listProjects'],
    queryFn: () => listProjects()
  })
}