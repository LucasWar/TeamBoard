import type { enumStatusProject } from "../../../assets/enums/statusProject"
import type { EditProject } from "../../../assets/interfaces/projetcs"
import type { ChangeStatusProjectParams } from "../../../services/projectsServices/archiveProject"

interface ProjectListProps{
  title: string,
  id: string,
  describe: string,
  status: enumStatusProject,
  advance: number
  onDelete: (id: string) => void
  onEdit: (project: EditProject) => void
  onArchiving: (id: string, params: ChangeStatusProjectParams) => void
}

export function ProjectList({advance, describe, id,onArchiving,onDelete, onEdit, status, title}:ProjectListProps) { 
  return (
    <div className="bg-red-600 w-full">
      
    </div>
  )
}