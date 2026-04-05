import { Progress } from "radix-ui";
import type { enumStatusProject } from "../../../assets/enums/statusProject";
import { statusMap } from "../../../app/utils/statusMap";
import { cn } from "../../../lib/utils";
import { Trash2, FolderClosed } from "lucide-react";

interface ProjectCardProps{
  title: string,
  describe: string,
  status: enumStatusProject,
  advance: number
}


export function ProjectCard({describe, status, title, advance}: ProjectCardProps){
  const statusConfig = statusMap[status]
  return(
    <div className="flex flex-col bg-white min-h-60 border shadow ">
      <header className="flex mt-6 ml-4 justify-between"> 
        <div className="flex flex-col">
          <p className="font-medium text-2xl">{title}</p>
          <p className="text-gray-400 text-xl">{describe}</p>
        </div>
        <div className="flex gap-5 text-gray-400 mr-2">
          <Trash2 className="w-6 h-6 hover:text-red-500 transition-colors" />
          <FolderClosed className="w-6 h-6 hover:text-blue-500 transition-colors" />
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