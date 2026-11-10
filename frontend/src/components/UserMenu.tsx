import { ExitIcon } from "@radix-ui/react-icons";
import { DropdownMenu } from "./DropdownMenu";
import { useAuth } from "../app/hooks/useAuth";
import { ChevronDown, SettingsIcon, BellIcon, XIcon } from "lucide-react";
import { Avatar, ScrollArea, Separator } from "radix-ui";
import { useModalProvider } from "../app/hooks/useModalProvider";
import { Popover } from "./Popover";
import { Button } from "../assets/components/Button";
import { usersService } from "../services/userServices";
import { cn } from "../lib/utils";

export function UserMenu(){

  const { openModal } = useModalProvider()
  const {signout, user, notifications} = useAuth()

  function handleUpdateStatus(read: boolean, id: string){
    if(read) return

    console.log(id);
  }

  return (
    <div className="flex gap-4 pr-6">
      <div className="flex items-center justify-center gap-2">
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
      </div>
      <div className="flex gap-3 items-center justify-center">
        <div className="relative flex justify-center items-center p-2">
          <div className="absolute bg-red-500 text-white rounded-full right-0 top-0 h-5 w-5 flex items-center justify-center text-xs">
            {notifications ? notifications.length : 0}
          </div>
          <Popover.Root>   
            <Popover.Trigger>
              <BellIcon className="text-gray-500"/> 
              
            </Popover.Trigger>

            <Popover.Content isAlign="end" className="w-100">
              {notifications && notifications.length > 0 ? (
                <ScrollArea.Root className="h-55 w-full overflow-hidden">
                  <ScrollArea.Viewport className="h-full w-full">
                    <div className="flex flex-col gap-1">
                      {notifications.map((notification) => (
                        <>
                          <div
                            key={notification.id}
                            className={cn(
                              "group flex flex-col px-2 rounded mx-1 hover:bg-gray-200 transition-all",
                              notification.read === false && "bg-gray-200 hover:bg-gray-300"
                            )}
                            onMouseEnter={() => handleUpdateStatus(notification.read, notification.id)}
                          >
                            <div className="flex justify-end pr-2 pt-1">
                              <XIcon className="h-3 w-3 cursor-pointer" />
                            </div>

                            <div className="text-sm w-full text-gray-500 pb-2 group-hover:text-gray-600">
                              {notification.menssage}

                              {notification.type === "INVITING" &&
                                notification.organizationId && (
                                  <div className="flex gap-1 mt-2">
                                    <Button
                                      className="flex-1 h-5 rounded bg-blue-400 text-white hover:bg-blue-500"
                                      onClick={() =>
                                        usersService.confirmInvitation(
                                          notification.organizationId!
                                        )
                                      }
                                    >
                                      Confirmar
                                    </Button>

                                    <Button className="flex-1 h-5 rounded bg-red-400 text-white hover:bg-red-500">
                                      Recusar
                                    </Button>
                                  </div>
                                )}
                            </div>
                          </div>
                          <Separator.Root
                            orientation="horizontal"
                            className="h-px w-full bg-gray-300"
                          />
                        </>
                      ))}
                    </div>
                  </ScrollArea.Viewport>

                  <ScrollArea.Scrollbar
                    orientation="vertical"
                    className="flex w-2 touch-none select-none bg-gray-200"
                  >
                    <ScrollArea.Thumb className="relative flex-1 rounded-full bg-gray-500" />
                  </ScrollArea.Scrollbar>

                  <ScrollArea.Corner />
                </ScrollArea.Root>
              ) : (
                <div className="flex items-center justify-center w-full h-50 text-gray-500/50">
                  Nenhuma notificação no momento
                </div>
              )}
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>
      
    </div>
  )
}