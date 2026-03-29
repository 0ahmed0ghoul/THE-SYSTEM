import { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Calendar,
  Users,
  Settings,
  ChevronDown,
  Star,
  BarChart3,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  Briefcase
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

type SidebarProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/calendar" },
    { id: "team", label: "Team", icon: Users, path: "/team" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const projectItems = [
    { id: "ecommerce", label: "E-commerce Platform", progress: 75, star: true, path: "/projects/1" },
    { id: "mobile-app", label: "Mobile App Redesign", progress: 45, star: false, path: "/projects/2" },
    { id: "api-integration", label: "API Integration", progress: 90, star: true, path: "/projects/3" },
    { id: "documentation", label: "Documentation", progress: 30, star: false, path: "/projects/4" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white dark:bg-slate-900 p-2.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col 
        transition-transform duration-300 ease-in-out z-40 w-64
        ${isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}
      `}
      >
        {/* Logo Section */}
        <div 
          onClick={() => navigate("/")}
          className="p-6 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white dark:text-slate-200 font-bold text-sm tracking-wider">TS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                The System
              </h1>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
                Workspace
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          {/* Main Menu */}
          <div className="mb-8">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-3">
              Overview
            </p>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => onToggle()}
                  className={({ isActive }) => `
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={
                          isActive 
                            ? "text-slate-100 dark:text-slate-200" 
                            : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                        }
                      />
                      <span className={`text-sm ${isActive ? "font-medium" : "font-medium"}`}>
                        {item.label}
                      </span>
                      {item.id === "analytics" && (
                        <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive 
                            ? "bg-white/20 dark:bg-white/10 text-white" 
                            : "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800"
                        }`}>
                          NEW
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-8">
            <button
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <span>Active Projects</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 text-slate-400 dark:text-slate-500 ${
                  isProjectsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProjectsOpen && (
              <div className="mt-2 space-y-0.5">
                {projectItems.map((project) => (
                  <NavLink
                    key={project.id}
                    to={project.path}
                    onClick={() => onToggle()}
                    className={({ isActive }) => `
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group
                      ${isActive ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
                    `}
                  >
                    <Briefcase size={14} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 truncate text-left">
                      {project.label}
                    </span>
                    {project.star && (
                      <Star
                        size={12}
                        className="text-amber-400 fill-amber-400"
                      />
                    )}
                  </NavLink>
                ))}

                <NavLink
                  to="/projects"
                  onClick={() => onToggle()}
                  className={({ isActive }) => `
                    w-full flex items-center gap-2 px-3 py-2.5 mt-2 rounded-lg transition-colors group
                    ${isActive 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <FolderKanban size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                  <span className="text-sm font-medium">Browse All Projects</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Priority Tasks */}
          <div className="mb-6">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-3">
              Up Next
            </p>
            <div className="space-y-1">
              <div 
                onClick={() => navigate("/board")}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm bg-white dark:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">Finalize PR Review</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">E-commerce</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => navigate("/board")}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm bg-white dark:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">Update Typography</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">Design System</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer User Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white dark:ring-slate-800">
                AD
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">Alex Doe</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">alex@thesystem.io</p>
              </div>
            </div>
            <LogOut size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors" />
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/50 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={onToggle}
        />
      )}
    </>
  );
}