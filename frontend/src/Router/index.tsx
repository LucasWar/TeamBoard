import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthGuard } from "./auth.guard";
import { AuthLayout } from "../ui/layouts/auth_layout";
import { Login } from "../ui/pages/login";
import { Register } from "../ui/pages/register";
import { Onboarding } from "../ui/pages/onboarding";
import { DashboardLayout } from "../ui/layouts/dashboard_laytou";
import { Dashboard } from "../ui/pages/dashboard";
import { ProjectsDashboard } from "../ui/pages/Projects";


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
          <Route element={<DashboardLayout title="Dashboard" />} >
            <Route path='/' element={<Dashboard />}/>
            <Route path='/projects' element={<ProjectsDashboard />}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}