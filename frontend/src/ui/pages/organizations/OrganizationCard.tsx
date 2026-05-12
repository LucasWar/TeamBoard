import { CircleCheck, ClipboardPen, Ellipsis, Trash, UserRoundPlus } from "lucide-react";
import { EnumRoles } from "../../../app/enums/roles";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { cn } from "../../../lib/utils";
import type { EditOrganization } from "../../../assets/interfaces/organization";
import { enumPlan } from "../../../app/enums/plan";

export interface OrganizationCardProps {
  organizationId: string
  name: string
  role: EnumRoles
  onChange: (value:string) => void
  onEdit: (value:EditOrganization) => void
  onSelectId: (value:string) => void
  onDelete: (value:string) => void
  isSelectedOrganization: string
}

export function OrganizationCard({name, organizationId, role, isSelectedOrganization, onChange, onEdit, onSelectId, onDelete}:OrganizationCardProps) {

  return (
    <div 
      className={`p-6 border rounded-lg bg-white shadow-sm flex flex-col ${
        isSelectedOrganization === organizationId ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'
      }`}
    >
      {isSelectedOrganization === organizationId && (
        <span 
          className="text-md text-green-600 bg-green-200 mb-2 inline-flex items-center gap-2 self-start px-1" 
        >
          <CircleCheck className='w-4 h-4'/>
          Ativo Agora
        </span>
      )}
      <div className="flex flex-col justify-between items-start mb-4 w-full">
        
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="w-10 h-10 shrink-0 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700">
            {name.charAt(0).toUpperCase()}
          </div>
          
          <h2 
            className="font-semibold text-lg line-clamp-2 flex-1 min-w-0 wrap-break-words" 
            title={name}
          >
            {name}
          </h2>
        </div>
        
        <span className={
          cn("mt-2 text-xs font-medium px-2 py-1 rounded",
            role == EnumRoles.ADMIN && 'bg-purple-300 text-purple-500',
            role == EnumRoles.MANAGER && 'bg-blue-300 text-blue-500',
            role == EnumRoles.USER && 'bg-gray-300 text-gray-500',
        )}>
          {role}
        </span>
      </div>

      <div className="mt-auto pt-4 flex gap-2">
        <button 
          onClick={() => onChange(organizationId)}
          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 rounded border border-gray-200 transition"
        >
          Acessar
        </button>
        {role === EnumRoles.ADMIN && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className='p-2 bg-white flex justify-center items-center border rounded'>
                <Ellipsis />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item onSelect={() => onDelete(organizationId)}>
                <div className='flex gap-2'>
                  <Trash className='w-4 h-4'/>
                  Excluir
                </div>
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => {
                    onEdit({name: name, plan: enumPlan.FREE})
                    onSelectId(organizationId)     
                  } 
                }>
                <div className='flex gap-2'>
                  <ClipboardPen className='w-4 h-4'/>
                  Editar
                </div>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <div className='flex gap-2'>
                  <UserRoundPlus className='w-4 h-4'/>
                  Adicionar membro  
                </div>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </div>
    </div>
  )
}