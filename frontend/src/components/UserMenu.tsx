import { ExitIcon } from "@radix-ui/react-icons";
import { DropdownMenu } from "./DropdownMenu";
import { useAuth } from "../app/hooks/useAuth";
import { ChevronDown } from "lucide-react";
import { Avatar } from "radix-ui";
export function UserMenu(){

  const {signout, userName, avatar} = useAuth()

  return (
    <div className="flex">
      <div className="flex items-center justify-center gap-3">
        <Avatar.Root className="inline-flex size-11.25 select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
          <Avatar.Image
            className="size-full rounded-[inherit] object-cover"
            src={`${import.meta.env.VITE_BASE_URL}/uploads/users/${avatar}`}
            alt="Colm Tuite"
          />
          <Avatar.Fallback
            className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
            delayMs={600}
          >
            {userName?.charAt(0).toUpperCase()}
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex-col text-left items-center justify-center max-w-30">
          <p className="text-sm tracking-[-0.5px] text-white font-medium truncate ">Minnha Organização</p>
          <p className="text-sm tracking-[-0.5px] text-gray-400 truncate">{userName}</p>
        </div>
      </div>
      <DropdownMenu.Root>  
        <DropdownMenu.Trigger>
          <ChevronDown className="text-gray-500"/> 
        </DropdownMenu.Trigger>

        <DropdownMenu.Content isAlign="start">
          <DropdownMenu.Item onSelect={signout}>
            Sair  
            <ExitIcon className="w-4 h-4"/>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}