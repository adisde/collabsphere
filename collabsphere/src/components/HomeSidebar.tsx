import { Book, Briefcase, Calendar, ChevronRight, ClipboardList, LogOut, UserPen } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `w-full p-2 rounded-lg flex flex-row items-center justify-between transition
   ${isActive ? "bg-stone-200" : "hover:bg-stone-200"}`;

export default function HomeSidebar() {
  return (
    <div
      id="sidebar"
      className="border border-r-stone-200 border-transparent max-w-60 p-2 flex flex-col gap-2 rounded-lg text-md"
    >
      <div
        id="user"
        className="flex flex-row w-full items-center gap-2 p-2 rounded-lg"
      >
        <div>
          <img
            src="https://i.pinimg.com/474x/df/a5/a3/dfa5a33bc7eea06c644b8a568adf3e7f.jpg"
            alt="profile-image"
            width={40}
            height={40}
            className="object-cover rounded-lg w-10 h-10"
          />
        </div>
        <div>
          <p className="font-medium">Julia</p>
          <p>someone@gmail.com</p>
        </div>
      </div>
      <NavLink to="profile" end className={navItemClass}>
        <span className="flex flex-row items-center gap-2">
          <UserPen size={20} />
          Profile
        </span>
        <ChevronRight size={20} />
      </NavLink>

      <NavLink to="workspaces" className={navItemClass}>
        <span className="flex flex-row items-center gap-2">
          <Briefcase size={20} />
          Workspaces
        </span>
        <ChevronRight size={20} />
      </NavLink>
       <NavLink to="tasks" className={navItemClass}>
        <span className="flex flex-row items-center gap-2">
          <ClipboardList size={20} />
          Tasks
        </span>
        <ChevronRight size={20} />
      </NavLink>
       <NavLink to="calendar" className={navItemClass}>
        <span className="flex flex-row items-center gap-2">
          <Calendar size={20} />
          Calendar
        </span>
        <ChevronRight size={20} />
      </NavLink>
       <NavLink to="docs" className={navItemClass}>
        <span className="flex flex-row items-center gap-2">
          <Book size={20} />
          Documentation
        </span>
        <ChevronRight size={20} />
      </NavLink>
      <Link
        to=""
        className="w-full p-2 hover:bg-stone-200 rounded-lg flex flex-row items-center justify-between"
      >
        <span className="flex flex-row items-center gap-2">
          <LogOut size={20} />
          Logout
        </span>
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}
