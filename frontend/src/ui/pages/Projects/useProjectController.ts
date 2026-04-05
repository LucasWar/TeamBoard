import { useListProject } from "../../../app/hooks/useListProjects"


export function useControllerProject() {
  const { data } = useListProject()

  return { projects: data?.data }
}