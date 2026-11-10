import { Link, Outlet, useLocation } from "react-router-dom";
import { UserMenu } from "../../components/UserMenu";
import { BookOpenIcon, Building, FolderKanbanIcon, UserIcon } from "lucide-react";
import { DashboardIcon } from "@radix-ui/react-icons";
import { useOrganization } from "../../app/hooks/useOrganization";
import { EnumRoles } from "../../app/enums/roles";
import { Avatar } from "radix-ui";
import iconeTB from "../../assets/iconeTB.jpg";
import { cn } from "../../lib/utils";

export function DashboardLayout(){ 
  const { currentRole } = useOrganization()
  const location = useLocation();
  const currentPage = [
    {
      label: 'Dashboard',
      href: '/',
      role: [],
      icon: DashboardIcon,
      subTitle: "Aqui está o resumo do seu dia.",
    },
    {
      label: 'Projetos',
      href: '/projects',
      role: [],
      icon: FolderKanbanIcon,
      subTitle: "Gestão centralizada de todos os seus projetos.",
    },
    {
      label: 'Minhas tarefas',
      href: '/myTasks',
      role: [],
      icon: BookOpenIcon,
      subTitle: "Gestão centralizada de todas as tuas responsabilidades.",
    },
    {
      label: 'Membros',
      href: '/members',
      role: [EnumRoles.MANAGER, EnumRoles.ADMIN],
      icon: UserIcon,
      subTitle: "Gerencie os acessos e permissões da sua organização.",
    },
    {
      label: 'Minhas Organizações',
      href: '/myOrganizations',
      role: [],
      icon: Building,
      subTitle: "Gerencie seus espaços de trabalho.",
    },
  ]

  const currentItem = currentPage.find((item) =>
    item.href === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.href)
  );

  return (
    <div className="h-full">      
      <div className="h-screen flex">
        <div className="bg-primary-bg w-60 min-h-screen">
          <div className="flex items-center pt-5 pl-5 gap-3">
            <Avatar.Root className="inline-flex size-11.25 select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
              <Avatar.Image
                className="size-full rounded-[inherit] object-cover"
                src={iconeTB}
                alt="Colm Tuite"
              />
              <Avatar.Fallback
                className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
                delayMs={600}
              >
                TB
              </Avatar.Fallback>
            </Avatar.Root>
            <div className="flex flex-col">
              <span className="text-xl text-white">
                TeamBoard
              </span>
              <span className="text-sm text-white">
                Organize suas tarefas
              </span>
            </div>
            
          </div>
          <nav className="mt-12 flex flex-col gap-6 text-white pl-4">
            {
              currentPage.map((item) => {
                
                if (item.role.length === 0) {
                  return (
                    <Link to={item.href}>
                      <p className={cn("flex items-center gap-2 right-0 p-3 mr-1 hover:bg-gray-500/50 rounded-2xl transition-all", item.href === currentItem?.href && 'bg-gray-500/50 rounded-2xl')}>
                        <item.icon className="w-5 h-5"/>
                        {item.label}
                      </p>
                    </Link>
                  )
                }
                else if(item.role.includes(currentRole)) {
                  return (
                    <Link to={item.href}>
                      <p className={cn("flex items-center gap-2 right-0 p-3 mr-1 hover:bg-gray-500/50 rounded-2xl transition-all", item.href === currentItem?.href && 'bg-gray-500/50 rounded-2xl')}>
                        <item.icon className="w-5 h-5"/>
                        {item.label}
                      </p>
                    </Link>
                  )
                }
              })
            }
          </nav>
          {/* <Separator.Root className="mt-2 data-[orientation=horizontal]:h-px " /> */}
        </div>
        <div className="flex-1 flex flex-col">
          <header className="h-20 bg-primary-bg flex justify-between items-center border-b-2 border-gray-500/50">
            <div className="flex flex-col items-start">
              <span className="flex justify-center items-center text-gray-400 text-xl gap-2">
                  {currentItem && <currentItem.icon className="w-5 h-5" />}
                  {currentItem?.label ?? 'Dashboard'}
              </span>
              <span className="text-gray-400/40">
                {currentItem?.subTitle ?? ''}
              </span>
            </div>
            <UserMenu />
          </header>
          <main className="flex-1 overflow-y-auto">
            <Outlet />  
          </main>
        </div>
      </div>
    </div>
  )
}