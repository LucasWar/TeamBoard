import { Link, Outlet } from "react-router-dom";
import { UserMenu } from "../../components/UserMenu";
import { BookOpenIcon, Building, FolderKanbanIcon, UserIcon } from "lucide-react";
import { DashboardIcon } from "@radix-ui/react-icons";
import { useOrganization } from "../../app/hooks/useOrganization";
import { EnumRoles } from "../../app/enums/roles";

export function DashboardLayout(){ 
  const { currentRole } = useOrganization()
  return (
    <div className="h-full">
      {/* <header className="bg-red h-13 text-2xl flex items-center justify-center relative bg-white">
        <div className="absolute right-5 flex items-center justify-center">
          <div className="relative">
            <SearchIcon className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              className="border w-53 pl-8 pr-2 rounded-md text-lg "
              placeholder="Pesquisar"
            />
          </div>

        </div>
        <input className="border  w-53 h-6 absolute right-0">
          <SearchIcon />
        </input>
      </header> */}
      <div className="h-screen flex">
        <div className="bg-primary-bg w-60 min-h-screen">
          <div className="mt-4 ml-2">
            <UserMenu />
          </div>
          <nav className="mt-12 flex flex-col gap-6 text-white pl-4">
            <Link to="/">
              <p className="flex items-center gap-2 right-0">
                <DashboardIcon className="w-5 h-5"/>
                Dashboard
              </p>
            </Link>
            <Link to="/projects">
              <div className="flex items-center gap-2">
                  <FolderKanbanIcon className="w-5 h-5"/>
                  <span>Projetos</span>
              </div>
            </Link>
            <Link to="/myTasks">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5" />
                <span>Minhas tarefas</span>
              </div>
            </Link>
            { currentRole !== EnumRoles.USER && (
              <Link to="/members">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  <span>Membros</span>
                </div>
              </Link>
              )
            }
            <Link to="/myOrganizations">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                <span>Minhas Organizações</span>
              </div>
            </Link>
          </nav>
          {/* <Separator.Root className="mt-2 data-[orientation=horizontal]:h-px " /> */}
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />  
        </main>
      </div>
    </div>
  )
}