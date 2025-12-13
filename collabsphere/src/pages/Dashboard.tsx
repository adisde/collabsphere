import { Outlet } from "react-router-dom";
import HomeSidebar from "../components/HomeSidebar";

export default function Dashboard() {
  return (
    <div className="flex items-start justify-start gap-4 max-[800px]:flex-col">
        <HomeSidebar />
        <div className="flex-1 w-full">
            <Outlet />
        </div>
    </div>
  )
}
