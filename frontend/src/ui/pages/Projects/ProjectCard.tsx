import { Progress } from "radix-ui";
import { enumStatusProject } from "../../../app/enums/statusProject";
import { statusMap } from "../../../app/utils/statusMap";
import { cn } from "../../../lib/utils";
import { Trash2, FolderClosed, ClipboardPen, FolderOpen } from "lucide-react";
import type { EditProject } from "../../../assets/interfaces/projetcs";
import type { ChangeStatusProjectParams } from "../../../services/projectsServices/archiveProject";
import { Link } from "react-router-dom";

interface ProjectCardProps{
  title: string,
  id: string,
  describe: string,
  status: enumStatusProject,
  advance: number
  onDelete: (id: string) => void
  onEdit: (project: EditProject) => void
  onArchiving: (id: string, params: ChangeStatusProjectParams) => void
}


export function ProjectCard({describe, status, title, advance, onDelete, id, onEdit, onArchiving}: ProjectCardProps){

  const statusConfig = statusMap[status]

  return(
    <div className="flex flex-col bg-white min-h-60 border shadow min-w-120 sm:min-w-0">
      <header className="flex mt-6 ml-4 justify-between"> 
        <div className="flex flex-col w-3/4">
          <p className="font-medium text-2xl hover:text-gray-600 transition-all"><Link to={`tasks/${id}`}  state={{ title, describe }}>{title}</Link></p>
          <p className="text-gray-400 text-xl line-clamp-2 flex-1 min-w-0 wrap-break-words">{describe}</p>
        </div>
        <div className="flex gap-4 text-gray-400 shrink-0">
          <button onClick={() => onDelete(id)}>
            <Trash2 className="w-6 h-6 hover:text-red-500 transition-colors" />
          </button>
          { status == enumStatusProject.ARCHIVED &&
            <button onClick={() => onArchiving(id, {status: 'ACTIVE'})}>
              <FolderOpen className="w-6 h-6 hover:text-blue-500 transition-colors" />
            </button>
          }
          { status == enumStatusProject.ACTIVE && 
            <button onClick={() => onArchiving(id, {status: 'ARCHIVED'})}>
              <FolderClosed className="w-6 h-6 hover:text-blue-500 transition-colors" />
            </button>
          }
          <button onClick={
              () => {
                onEdit({description: describe, name: title, id: id})
              }
            }>
            <ClipboardPen className="w-6 h-6 hover:text-yellow-500 transition-colors" />
          </button>
        </div>
      </header>
      <div className="flex flex-col ml-4 mt-5 mr-4 items-start">
        <div className={cn("text-white p-2 rounded-sm", statusConfig.classNameStatus)}>
          <span>{statusConfig.label}</span>
        </div>
        <div className="flex flex-col w-full gap-2">
          <Progress.Root
            className="relative h-3.25 w-full overflow-hidden bg-bg-default mt-3 rounded-xs"
            style={{
              transform: "translateZ(0)",
            }}
            value={50}
          >
            <Progress.Indicator
              className={cn("ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full transition-transform", statusConfig.classNameBar)}
              style={{ transform: `translateX(-${100 - advance}%)` }}
            />
          </Progress.Root>
          <span className="text-gray-600">{advance}%</span>
        </div>
      </div>
      
    </div>
  )
}