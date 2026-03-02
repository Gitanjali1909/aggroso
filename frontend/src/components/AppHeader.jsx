import { Link, NavLink } from "react-router-dom";

function navClassName({ isActive }) {
  return [
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <Link to="/" className="block text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            Code Insight AI
          </Link>
          <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
            Ask architecture-level questions across any codebase.
          </p>
        </div>
        <nav className="ml-4 flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/70 p-1">
          <NavLink to="/" className={navClassName} end>
            Home
          </NavLink>
          <NavLink to="/status" className={navClassName}>
            Status
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
