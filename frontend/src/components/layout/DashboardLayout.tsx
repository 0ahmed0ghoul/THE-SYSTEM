import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Helper function to get breadcrumb and title based on path
  const getRouteInfo = (pathname: string) => {
    // Handle dynamic project routes
    if (pathname.match(/^\/projects\/\d+$/)) {
      const projectId = pathname.split('/')[2];
      return {
        title: "Project Details",
        subtitle: "View and manage project information",
        breadcrumb: ["Workspace", "Projects", `Project ${projectId}`],
      };
    }
    
    // Handle project board routes
    if (pathname.match(/^\/projects\/\d+\/board$/)) {
      const projectId = pathname.split('/')[2];
      return {
        title: "Project Board",
        subtitle: "Manage tasks with Kanban board",
        breadcrumb: ["Workspace", "Projects", `Project ${projectId}`, "Board"],
      };
    }
    
    // Handle dynamic task routes
    if (pathname.match(/^\/tasks\/\d+$/)) {
      const taskId = pathname.split('/')[2];
      return {
        title: "Task Details",
        subtitle: "View and manage task information",
        breadcrumb: ["Workspace", "Tasks", `Task ${taskId}`],
      };
    }
    
    // Handle new task route
    if (pathname === "/tasks/new") {
      return {
        title: "Create New Task",
        subtitle: "Add a new task to your project",
        breadcrumb: ["Workspace", "Tasks", "Create"],
      };
    }
    
    // Handle projects list
    if (pathname === "/projects") {
      return {
        title: "Projects",
        subtitle: "View and manage all your projects",
        breadcrumb: ["Workspace", "Projects"],
      };
    }
    
    // Handle tasks list
    if (pathname === "/tasks") {
      return {
        title: "Tasks",
        subtitle: "View and manage all your tasks",
        breadcrumb: ["Workspace", "Tasks"],
      };
    }
    
    // Handle team page
    if (pathname === "/team") {
      return {
        title: "Team",
        subtitle: "Manage your team members and collaborations",
        breadcrumb: ["Workspace", "Team"],
      };
    }

    // Default route data for static pages
    const routeData: Record<string, any> = {
      "/": {
        title: "Dashboard",
        subtitle: "Here's what's happening across The System today.",
        breadcrumb: ["Workspace", "Dashboard"],
      },
      "/analytics": {
        title: "Analytics",
        subtitle: "Track performance and insights.",
        breadcrumb: ["Workspace", "Analytics"],
      },
      "/calendar": {
        title: "Calendar",
        subtitle: "Manage your schedule and events.",
        breadcrumb: ["Workspace", "Calendar"],
      },
      "/settings": {
        title: "Settings",
        subtitle: "Manage your account and preferences.",
        breadcrumb: ["Workspace", "Settings"],
      },
      "/board": {
        title: "Board",
        subtitle: "Manage your tasks with Kanban board.",
        breadcrumb: ["Workspace", "Board"],
      },
      "/notifications": {
        title: "Notifications",
        subtitle: "Stay updated with your latest activities.",
        breadcrumb: ["Workspace", "Notifications"],
      },
    };
    
    return routeData[pathname] || routeData["/"];
  };

  const current = getRouteInfo(location.pathname);
  
  // Detect screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (mobile) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    // Initial check
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (index: number, crumb: string) => {
    if (crumb === "Workspace") {
      navigate("/");
    } else if (crumb === "Projects") {
      navigate("/projects");
    } else if (crumb === "Tasks") {
      navigate("/tasks");
    } else if (crumb === "Dashboard") {
      navigate("/");
    } else if (crumb === "Board") {
      navigate("/board");
    } else if (crumb === "Team") {
      navigate("/team");
    } else if (crumb === "Analytics") {
      navigate("/analytics");
    } else if (crumb === "Calendar") {
      navigate("/calendar");
    } else if (crumb === "Settings") {
      navigate("/settings");
    } else if (crumb === "Notifications") {
      navigate("/notifications");
    } else if (crumb.startsWith("Project ") && current.breadcrumb[index + 1] !== "Board") {
      // Navigate to projects list if clicking on project breadcrumb
      navigate("/projects");
    } else if (crumb.startsWith("Task ")) {
      navigate("/tasks");
    }
    // Don't navigate for dynamic IDs (Project X, Task X) - just stay on current page
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/50 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && !isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-20 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className={`
          flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out
          ${!isSidebarCollapsed && !isMobile ? "lg:pl-64" : "lg:pl-0"}
        `}
      >
        {/* Navbar */}
        <Navbar
          onMenuClick={toggleSidebar}
          isSidebarOpen={!isSidebarCollapsed}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:px-10 lg:py-8">
          {/* Animated Content Container */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-350 mx-auto">
            {/* Page Header with Breadcrumb */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex-wrap">
                {current.breadcrumb.map((crumb: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    {index > 0 && (
                      <span className="text-slate-300 dark:text-slate-600">/</span>
                    )}
                    <span
                      onClick={() => handleBreadcrumbClick(index, crumb)}
                      className={`
                        ${index === current.breadcrumb.length - 1 
                          ? "text-indigo-600 dark:text-indigo-400 cursor-default" 
                          : "hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer transition-colors"
                        }
                      `}
                    >
                      {crumb}
                    </span>
                  </div>
                ))}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {current.title}
              </h1>

              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
                {current.subtitle}
              </p>
            </div>

            {/* Dynamic Content - This is where your pages will render */}
            <div className="min-h-[60vh]">
              <Outlet />
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <span>© 2026 The System</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">
                    Privacy
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">
                    Terms
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-700 dark:text-slate-300">
                    All systems operational
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 z-20 group"
        aria-label="Back to top"
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
}