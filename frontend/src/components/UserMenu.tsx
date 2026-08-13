import { ExitIcon } from "@radix-ui/react-icons";
import { DropdownMenu } from "./DropdownMenu";
import { useAuth } from "../app/hooks/useAuth";
import { ChevronDown, SettingsIcon, BellIcon, XIcon } from "lucide-react";
import { Avatar, ScrollArea } from "radix-ui";
import { useModalProvider } from "../app/hooks/useModalProvider";
import { Popover } from "./Popover";
import { Button } from "../assets/components/Button";
import { usersService } from "../services/userServices";
export function UserMenu(){

  const { openModal } = useModalProvider()
  const {signout, user, notifications} = useAuth()
  console.log(notifications)
  return (
    <div className="flex">
      <div className="flex items-center justify-center gap-3">
        <Avatar.Root className="inline-flex size-11.25 select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
          <Avatar.Image
            className="size-full rounded-[inherit] object-cover"
            src={`${import.meta.env.VITE_BASE_URL}/uploads/users/${user.avatar}`}
            alt="Colm Tuite"
          />
          <Avatar.Fallback
            className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
            delayMs={600}
          >
            {user.name?.charAt(0).toUpperCase()}
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex-col text-left items-center justify-center max-w-30">
          <p className="text-sm tracking-[-0.5px] text-white font-medium truncate ">Minnha Organização</p>
          <p className="text-sm tracking-[-0.5px] text-gray-400 truncate">{user.name}</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <DropdownMenu.Root>  
          <DropdownMenu.Trigger>
            <ChevronDown className="text-gray-500"/> 
            
          </DropdownMenu.Trigger>

          <DropdownMenu.Content isAlign="start">
            <DropdownMenu.Item onSelect={signout}>
              <div className="flex gap-2 items-center"> 
                Sair  
                <ExitIcon className="w-4 h-4"/>
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => {
                openModal({
                  name: user.name,
                  email: user.email,
                  id: user.id,
                  avatar: user.avatar
                })
              }}>
              <div className="flex gap-2 items-center"> 
                Editar Perfil
                <SettingsIcon className="w-4 h-4"/>
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <div className="relative flex justify-center items-center p-2">
          <div className="absolute bg-red-500 text-white rounded-full right-0 top-0 h-5 w-5 flex items-center justify-center text-xs">
            {notifications ? notifications.length : 0}
          </div>
          <Popover.Root>   
            <Popover.Trigger>
              <BellIcon className="text-gray-500"/> 
              
            </Popover.Trigger>

            <Popover.Content isAlign="start" className="w-90">
                <ScrollArea.Root className="h-55 w-full overflow-hidden"> 
                  <ScrollArea.Viewport className="h-full w-full relative">
                      {
                        notifications && 
                          notifications.map((notification) => {
                            return ( 
                              <div className="w-full flex-col" key={notification.id}>
                                <div className="flex justify-end pr-2">
                                  <XIcon className="h-3 w-3 cursor-pointer"/>
                                </div> 
                                <div className="text-sm w-full text-gray-500">
                                  {notification.menssage}
                                  {notification.type === 'INVITING' && notification.organizationId && (() => {
                                    const organizationId = notification.organizationId;
                                    return (
                                      <div className="flex gap-2">
                                        <Button
                                          className="h-5 rounded bg-blue-400 text-white hover:none"
                                          onClick={() => usersService.confirmInvitation(organizationId)}
                                        >
                                          Confirmar
                                        </Button>

                                        <Button className="h-5 rounded bg-red-400 text-white hover:none">
                                          Recusar
                                        </Button>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            )
                          })
                      }
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar
                      orientation="vertical"
                      className="flex w-2 touch-none select-none bg-gray-200"
                    >
                      <ScrollArea.Thumb className="relative flex-1 rounded-full bg-gray-500" />
                    </ScrollArea.Scrollbar>

                    <ScrollArea.Corner />
                </ScrollArea.Root>
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>
      
    </div>
  )
}