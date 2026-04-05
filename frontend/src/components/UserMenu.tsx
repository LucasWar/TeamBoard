import { ExitIcon } from "@radix-ui/react-icons";
import { DropdownMenu } from "./DropdownMenu";
import { useAuth } from "../app/hooks/useAuth";
import { ChevronDown } from "lucide-react";
export function UserMenu(){

  const {signout, userName} = useAuth()

  return (
    <DropdownMenu.Root>
        <div className="flex items-center justify-center gap-3">
          <div className="bg-gray-50 rounded-full w-10 h-10 flex items-center justify-center border border-gray-100">
            <span className="text-sm tracking-[-0.5px] text-teal-900 font-medium">LU!</span>
          </div>
          <div className="flex-col text-left items-center justify-center max-w-30">
            <p className="text-sm tracking-[-0.5px] text-white font-medium truncate ">Minnha Organização</p>
            <p className="text-sm tracking-[-0.5px] text-gray-400 truncate">{userName}</p>
          </div>
          <DropdownMenu.Trigger>
            <ChevronDown className="text-gray-500"/> 
          </DropdownMenu.Trigger>
        </div>

      <DropdownMenu.Content isAlign="start">
        <DropdownMenu.Item onSelect={signout}>
          Sair  
          <ExitIcon className="w-4 h-4"/>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}