import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthGuard } from "./auth.guard";
import { AuthLayout } from "../ui/layouts/auth_layout";
import { Login } from "../ui/pages/login";
import { Register } from "../ui/pages/register";
import { Onboarding } from "../ui/pages/onboarding";
import { DashboardLayout } from "../ui/layouts/dashboard_laytou";
import { Dashboard } from "../ui/pages/dashboard";
import { ProjectsDashboard } from "../ui/pages/Projects";
import { MyOrganizations } from "../ui/pages/organizations";
import { KanbanBoard } from "../ui/pages/kaban";
import { MyTasks } from "../ui/pages/myTasks";


export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard   isPrivate={false} />}>
          <Route element={<AuthLayout />}>
            <Route path='/login' element={<Login />}/>
            <Route path='/register' element={<Register />}/>
          </Route>
        </Route >
        <Route element={<AuthGuard isPrivate={true} />}>
          <Route element={<AuthLayout />}>
            <Route path='/firtsOrganization' element={<Onboarding />}/>
          </Route>
        </Route>
        <Route element={<AuthGuard isPrivate={true} />}>
          <Route element={<DashboardLayout />} >
            <Route path='/' element={<Dashboard />}/>
            <Route path='/projects' element={<ProjectsDashboard />}/>
            <Route path='/myOrganizations' element={<MyOrganizations />}/> 
            <Route path='projects/tasks/:idProject' element={<KanbanBoard />}/> 
            <Route path='myTasks' element={<MyTasks />}/> 
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}