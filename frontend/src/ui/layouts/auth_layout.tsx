import { Outlet } from "react-router-dom";
import login_image from '../../assets/login_image.svg'
export function AuthLayout() {
  return (
    <div className="flex items-center justify-center h-full w-full">
     <div className="w-full h-full flex items-center justify-center">
        <div className="flex justify-center items-center w-1/2">
          <img 
            className="w-1/2"
            src={login_image}
          />
        </div>


        <div className="flex flex-col items-center justify-center w-1/2 h-full bg-primary-bg rounded-l-4xl">
          <Outlet />
        </div>
      </div>
    </div>
  )
}