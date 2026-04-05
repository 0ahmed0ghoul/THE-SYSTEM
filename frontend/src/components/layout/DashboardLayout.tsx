import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// ── Route info map ─────────────────────────────────────────────────────────
function getRouteInfo(pathname: string) {
  if (pathname.match(/^\/projects\/\d+\/board$/)) {
    const id = pathname.split("/")[2];
    return { title: "Project Board",   subtitle: "Manage tasks with the gate board", breadcrumb: ["Workspace", "Gates", `Gate ${id}`, "Board"] };
  }
  if (pathname.match(/^\/projects\/\d+$/)) {
    const id = pathname.split("/")[2];
    return { title: "Gate Details",    subtitle: "View and manage gate operations",  breadcrumb: ["Workspace", "Gates", `Gate ${id}`] };
  }
  if (pathname.match(/^\/tasks\/\d+$/)) {
    const id = pathname.split("/")[2];
    return { title: "Quest Details",   subtitle: "View and manage quest information", breadcrumb: ["Workspace", "Quests", `Quest ${id}`] };
  }
  if (pathname === "/tasks/new")    return { title: "Create Quest",      subtitle: "Register a new quest to the board",       breadcrumb: ["Workspace", "Quests", "Create"] };
  if (pathname === "/projects")     return { title: "Active Gates",       subtitle: "View and manage all dungeon gates",        breadcrumb: ["Workspace", "Gates"] };
  if (pathname === "/tasks")        return { title: "Quest Board",        subtitle: "All active and pending quests",            breadcrumb: ["Workspace", "Quests"] };
  if (pathname === "/team")         return { title: "Hunter Guild",       subtitle: "Manage your team and collaborations",      breadcrumb: ["Workspace", "Guild"] };
  if (pathname === "/analytics")    return { title: "Analytics",          subtitle: "Track performance and system insights",    breadcrumb: ["Workspace", "Analytics"] };
  if (pathname === "/calendar")     return { title: "Calendar",           subtitle: "Manage your schedule and events",          breadcrumb: ["Workspace", "Calendar"] };
  if (pathname === "/settings")     return { title: "Settings",           subtitle: "Manage your account and preferences",      breadcrumb: ["Workspace", "Settings"] };
  if (pathname === "/board")        return { title: "Gate Board",         subtitle: "Manage your tasks with Kanban board",      breadcrumb: ["Workspace", "Board"] };
  if (pathname === "/notifications") return { title: "System Alerts",    subtitle: "Stay updated with all system activity",    breadcrumb: ["Workspace", "Alerts"] };
  // default — dashboard
  return { title: "Command Center",   subtitle: "Hunter operations overview — all systems nominal", breadcrumb: ["Workspace", "Command Center"] };
}

// ── Breadcrumb nav targets ─────────────────────────────────────────────────
const CRUMB_ROUTES: Record<string, string> = {
  Workspace:       "/",
  Gates:           "/projects",
  Quests:          "/tasks",
  Guild:           "/team",
  Analytics:       "/analytics",
  Calendar:        "/calendar",
  Settings:        "/settings",
  Board:           "/board",
  Alerts:          "/notifications",
  "Command Center": "/",
};

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const current = getRouteInfo(location.pathname);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarCollapsed(mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed((p) => !p);

  const handleCrumb = (crumb: string) => {
    const route = CRUMB_ROUTES[crumb];
    if (route) navigate(route);
  };

  return (
    <>
      {/* ── Background layers ──────────────────────────────────── */}
      <div className="sys-layout">
        <div className="sys-layout-grid" />
        <div className="sys-layout-orb1" />
        <div className="sys-layout-orb2" />
        <div className="sys-layout-scan" />

        {/* ── Mobile overlay ─────────────────────────────────── */}
        {isMobile && !isSidebarCollapsed && (
          <div className="sys-mobile-overlay lg:hidden" onClick={toggleSidebar} />
        )}

        {/* ── Sidebar ────────────────────────────────────────── */}
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

        {/* ── Main column ────────────────────────────────────── */}
        <div
          className="sys-content-wrap"
          style={{
            paddingLeft: !isSidebarCollapsed && !isMobile ? "256px" : "0",
          }}
        >
          {/* Navbar */}
          <Navbar onMenuClick={toggleSidebar} isSidebarOpen={!isSidebarCollapsed} />

          {/* Breadcrumb */}
          <div className="sys-breadcrumb-bar">
            <div className="sys-bc-wrap">
              {current.breadcrumb.map((crumb, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {i > 0 && <span className="sys-bc-sep">›</span>}
                  <span
                    className={`sys-bc-item${i === current.breadcrumb.length - 1 ? " sys-bc-active" : ""}`}
                    onClick={() => i < current.breadcrumb.length - 1 && handleCrumb(crumb)}
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </div>
            <span className="sys-bc-session hidden sm:block">
              Session 0x7F2A · All systems nominal
            </span>
          </div>

          {/* ── Main content ──────────────────────────────────── */}
          <main className="sys-main">
            <div className="sys-page-body" key={location.pathname}>

              {/* Page header */}
              <div className="sys-page-header">
                <div className="sys-page-title">{current.title.toUpperCase()}</div>
                <div className="sys-page-sub">{current.subtitle}</div>
                <div className="sys-page-rule" />
              </div>

              {/* Routed page */}
              <div style={{ minHeight: "60vh" }}>
                <Outlet />
              </div>

              {/* Footer */}
              <footer className="sys-footer">
                <div className="sys-footer-left">
                  <span>© 2026 THE SYSTEM</span>
                  <span className="sys-footer-sep">·</span>
                  <span>Privacy</span>
                  <span className="sys-footer-sep">·</span>
                  <span>Terms</span>
                </div>
                <div className="sys-footer-status">
                  <span className="sys-footer-dot" />
                  All Gates Monitored
                </div>
              </footer>
            </div>
          </main>
        </div>

        {/* Scroll to top */}
        <button
          className="sys-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l7-7 7 7M12 5v14" />
          </svg>
        </button>
      </div>
    </>
  );
}