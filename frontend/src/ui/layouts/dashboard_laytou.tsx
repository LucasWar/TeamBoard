import { Link, Outlet } from "react-router-dom";
import { UserMenu } from "../../components/UserMenu";
import { BookOpenIcon, Building, FolderKanbanIcon, SearchIcon } from "lucide-react";
import { Separator } from "radix-ui";
import { DashboardIcon } from "@radix-ui/react-icons";

interface DashboardLayoutProps {
  title: string
}

export function DashboardLayout(){ 

  return (
    <div className="h-full">
      <header className="bg-red h-13 text-2xl flex items-center justify-center relative bg-white">
        <div className="absolute right-5 flex items-center justify-center">
          <div className="relative">
            <SearchIcon className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              className="border w-53 pl-8 pr-2 rounded-md text-lg "
              placeholder="Pesquisar"
            />
          </div>

        </div>
        {/* <input className="border  w-53 h-6 absolute right-0">
          <SearchIcon />
        </input> */}
      </header>
      <div className="h-full flex">
        <div className="bg-primary-bg w-60 h-full">
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
            <div className="flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5" />
              <span>Minhas tarefas</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              <span>Minhas Organizações</span>
            </div>
          </nav>
          <Separator.Root className="mt-2 bg-red-600 data-[orientation=horizontal]:h-px " />
        </div>
        <Outlet />  
      </div>
    </div>
  )
}