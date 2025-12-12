import {
  Menu,
  Book,
  BarChart2,
  Info,
  ChevronRight,
  LogInIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpenMenu, setOpenMenu] = useState<boolean>(false);
  return (
    <div className="w-full border-b border-stone-200">
      <div className="flex flex-row justify-between items-center p-3 text-md">
        {/* Logo */}
        <Link to="/" id="logo" className="font-semibold text-lg tracking-wide">
          CollabSphere
        </Link>

        {/* Desktop Links */}
        <div
          id="links"
          className="flex flex-row items-center gap-8 font-semibold max-[800px]:hidden"
        >
          <Link to="/">Docs</Link>
          <Link to="/">Usage</Link>
          <Link to="/">How to use</Link>
          <Link to="/">Login</Link>
        </div>

        {/* Mobile Menu Icon */}
        <div
          id="options"
          className="flex flex-row gap-2 items-center min-[800px]:hidden"
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          <button className="p-2 rounded hover:bg-gray-100 transition">
            {isOpenMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpenMenu && (
        <div className="p-2 flex flex-col gap-1 font-medium text-sm bg-gray-50 min-[800px]:hidden border-t border-gray-200 z-10 relative w-full min-h-screen">
          <Link
            to="/"
            onClick={() => setOpenMenu((prev) => !prev)}
            className="flex flex-row justify-between items-center p-2 w-full hover:bg-stone-100 rounded-lg transition-all duration-100"
          >
            <span className="flex flex-row gap-4 items-center">
              <Book size={20} />
              Docs
            </span>
            <ChevronRight size={20} />
          </Link>

          <Link
            to="/"
            onClick={() => setOpenMenu((prev) => !prev)}
            className="flex flex-row justify-between items-center p-2 w-full hover:bg-stone-100 rounded-lg transition-all duration-100"
          >
            <span className="flex flex-row gap-4 items-center">
              <BarChart2 size={20} />
              Usage
            </span>
            <ChevronRight size={20} />
          </Link>

          <Link
            to="/"
            onClick={() => setOpenMenu((prev) => !prev)}
            className="flex flex-row justify-between items-center p-2 w-full hover:bg-stone-100 rounded-lg transition-all duration-100"
          >
            <span className="flex flex-row gap-4 items-center">
              <Info size={20} />
              How to use
            </span>
            <ChevronRight size={20} />
          </Link>

          <Link
            to="/login"
            onClick={() => setOpenMenu((prev) => !prev)}
            className="flex flex-row justify-between items-center p-2 w-full hover:bg-stone-100 rounded-lg transition-all duration-100"
          >
            <span className="flex flex-row gap-4 items-center">
              <LogInIcon size={20} />
              Login
            </span>
            <ChevronRight size={20} />
          </Link>
        </div>
      )}
    </div>
  );
}
