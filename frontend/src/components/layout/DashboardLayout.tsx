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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        :root {
          --sys-blue:  #4fc3f7;
          --sys-gold:  #ffd54f;
          --sys-green: #4fe6a0;
          --sys-red:   #ff6b6b;
          --sys-dark:  #020c1a;
        }

        .sys-layout {
          min-height: 100vh;
          background: var(--sys-dark);
          font-family: 'Rajdhani', sans-serif;
          color: #e0f7fa;
          position: relative;
        }

        /* Persistent background layers */
        .sys-layout-grid {
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, rgba(79,195,247,0.05) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none; z-index: 0;
        }
        .sys-layout-orb1 {
          position: fixed; width: 800px; height: 800px; top: -300px; left: 50%;
          background: radial-gradient(circle, rgba(2,75,155,0.1) 0%, transparent 70%);
          border-radius: 50%; filter: blur(40px);
          pointer-events: none; z-index: 0;
        }
        .sys-layout-orb2 {
          position: fixed; width: 500px; height: 500px; bottom: -150px; right: 0;
          background: radial-gradient(circle, rgba(79,195,247,0.06) 0%, transparent 70%);
          border-radius: 50%; filter: blur(40px);
          pointer-events: none; z-index: 0;
        }
        .sys-layout-scan {
          position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(79,195,247,0.011) 2px, rgba(79,195,247,0.011) 4px);
          pointer-events: none; z-index: 0;
        }

        /* Mobile overlay */
        .sys-mobile-overlay {
          position: fixed; inset: 0;
          background: rgba(2,8,17,0.7);
          backdrop-filter: blur(4px);
          z-index: 30;
        }

        /* Content wrapper */
        .sys-content-wrap {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: flex; flex-direction: column;
          transition: padding-left 0.3s cubic-bezier(.4,0,.2,1);
        }

        /* ── Breadcrumb bar ── */
        .sys-breadcrumb-bar {
          background: rgba(3,12,26,0.92);
          border-bottom: 1px solid rgba(79,195,247,0.08);
          padding: 7px 24px;
          display: flex; align-items: center; justify-content: space-between;
          position: relative;
        }
        .sys-breadcrumb-bar::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,.08), transparent);
        }
        .sys-bc-wrap { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .sys-bc-item {
          font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,0.28); cursor: pointer;
          transition: color .2s;
        }
        .sys-bc-item:hover { color: rgba(79,195,247,.6); }
        .sys-bc-item.sys-bc-active { color: rgba(79,195,247,.6); cursor: default; }
        .sys-bc-sep { font-size: 9px; color: rgba(79,195,247,0.16); }
        .sys-bc-session {
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,0.18);
        }

        /* ── Main content ── */
        .sys-main { flex: 1; overflow-y: auto; padding: 24px 24px 0; }

        /* ── Page header ── */
        .sys-page-header { margin-bottom: 28px; }
        .sys-page-title {
          font-family: 'Cinzel', serif; font-size: 26px; font-weight: 900;
          letter-spacing: 3px;
          background: linear-gradient(135deg, #e0f7fa, var(--sys-blue));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .sys-page-sub {
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(79,195,247,0.3); margin-top: 4px;
        }
        .sys-page-rule {
          height: 1px; margin-top: 12px;
          background: linear-gradient(90deg, var(--sys-blue), rgba(79,195,247,0.1), transparent);
        }

        /* ── Footer ── */
        .sys-footer {
          margin-top: 40px;
          border-top: 1px solid rgba(79,195,247,0.1);
          padding: 14px 24px;
          display: flex; align-items: center; justify-content: space-between;
          position: relative;
        }
        .sys-footer::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,.18), transparent);
        }
        .sys-footer-left {
          display: flex; align-items: center; gap: 14px;
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,.18);
        }
        .sys-footer-left span { cursor: pointer; transition: color .2s; }
        .sys-footer-left span:hover { color: rgba(79,195,247,.5); }
        .sys-footer-sep { color: rgba(79,195,247,.1); }
        .sys-footer-status {
          display: flex; align-items: center; gap: 7px;
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,230,160,.45);
          border: 1px solid rgba(79,230,160,.15);
          padding: 3px 10px;
          font-family: 'Rajdhani', sans-serif;
        }
        .sys-footer-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--sys-green);
          animation: sf-dot 2s ease-in-out infinite;
        }
        @keyframes sf-dot {
          0%,100% { opacity:1; box-shadow: 0 0 4px var(--sys-green); }
          50%      { opacity:.4; box-shadow: none; }
        }

        /* ── Scroll to top ── */
        .sys-scroll-top {
          position: fixed; bottom: 20px; right: 20px;
          width: 34px; height: 34px;
          background: rgba(4,18,38,.96);
          border: 1px solid rgba(79,195,247,.22);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 20;
          color: rgba(79,195,247,.35);
          transition: all .2s;
        }
        .sys-scroll-top:hover {
          border-color: var(--sys-blue);
          color: var(--sys-blue);
          background: rgba(79,195,247,.07);
        }

        /* Page fade-in */
        .sys-page-body {
          animation: sys-page-in .4s ease both;
        }
        @keyframes sys-page-in {
          from { opacity:0; transform: translateY(10px); }
          to   { opacity:1; transform: translateY(0); }
        }
      `}</style>

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