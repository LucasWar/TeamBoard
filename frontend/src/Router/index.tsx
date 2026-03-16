import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthGuard } from "./auth.guard";
import { AuthLayout } from "../ui/layouts/auth_layout";
import { Login } from "../ui/pages/login";
import { Register } from "../ui/pages/register";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard   isPrivate={false} />}>
          <Route element={<AuthLayout />}>
            <Route path='/login' element={<Login />}/>
            <Route path='/register' element={<Register />}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}