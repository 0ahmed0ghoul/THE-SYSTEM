// Sidebar.tsx (updated to fetch real data)
import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { LogOut, Star, ChevronDown, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useProjectStore } from "../../store/projectStore";
import { useTaskStore } from "../../store/taskStore";


type SidebarProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

// Rank helpers
function getProjectRank(progress: number = 0): "S" | "A" | "B" | "C" {
  if (progress >= 80) return "S";
  if (progress >= 60) return "A";
  if (progress >= 35) return "B";
  return "C";
}

const RANK_COLOR: Record<string, string> = {
  S: "var(--sys-red)",
  A: "var(--sys-amber)",
  B: "var(--sys-blue)",
  C: "var(--sys-green)",
};

const RANK_GLOW: Record<string, string> = {
  S: "rgba(255,107,107,0.5)",
  A: "rgba(255,179,71,0.5)",
  B: "rgba(79,195,247,0.4)",
  C: "rgba(79,230,160,0.4)",
};

// Static nav items (keep as is)
const NAV_ITEMS = [
  { id: "dashboard",  label: "Command Center", path: "/",          icon: "⬡" },
  { id: "analytics",  label: "Analytics",      path: "/analytics", icon: "◈", badge: "NEW", badgeType: "gold" },
  { id: "calendar",   label: "Calendar",        path: "/calendar",  icon: "◷" },
  { id: "team",       label: "Team",            path: "/team",      icon: "⊕", badge: "4",   badgeType: "blue" },
  { id: "settings",   label: "Settings",        path: "/settings",  icon: "✦" },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const [gatesOpen, setGatesOpen] = useState(true);
  
  // Get stores
  const { projects, fetchProjects, isLoading: projectsLoading } = useProjectStore();
  const { tasks, fetchTasks, getRecentTasks, getHighPriorityTasks } = useTaskStore();
  
  // Fetch data on mount
  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);
  
  // Get user's projects and filter active ones
  const activeProjects = projects
    .filter(p => p.status === "active")
    .slice(0, 5); // Limit to 5 for sidebar
  
  // Get starred/favorite projects (you can add a starred field to projects table)
  const starredProjects = projects
    .filter(p => p.priority === "urgent" || p.priority === "high")
    .slice(0, 3);
  
  // Get recent high priority tasks for quests section
  const urgentTasks = getHighPriorityTasks().slice(0, 3);
  
  // Get user's display name and initials
  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "AD";
  
  const userEmail = user?.email || "user@system.io";
  const userName = user?.name || "Alex Doe";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) onToggle();
  };

  return (
    <>
      <style>{`

      `}</style>

      {/* Mobile toggle button */}
      <button className="sys-mobile-btn lg:hidden" onClick={onToggle}>
        {isCollapsed ? <Menu size={18} /> : <X size={18} />}
      </button>

      {/* Sidebar */}
      <div
        className="sys-sb"
        style={{
          width: isCollapsed ? "72px" : "256px",
          transform: isCollapsed ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        {/* Logo */}
        <div className="sys-sb-logo" onClick={() => { navigate("/"); closeOnMobile(); }}>
          <div style={{ display: "flex", alignItems: "center", gap: isCollapsed ? 0 : "11px", justifyContent: isCollapsed ? "center" : "flex-start" }}>
            <div className="sys-logo-icon">S</div>
            {!isCollapsed && (
              <div>
                <div className="sys-logo-name">THE SYSTEM</div>
                <div className="sys-logo-sub">Command Interface</div>
              </div>
            )}
          </div>
        </div>

        {/* Rank banner - calculate overall rank based on project progress */}
        {!isCollapsed && (
          <div className="sys-rank-bar">
            <span className="sys-rank-label">Hunter Status</span>
            <div className="sys-rank-val">
              <span className="sys-rank-dot" />
              {projects.length > 0 
                ? `${getProjectRank(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length)}-RANK`
                : "E-RANK"
              }
            </div>
          </div>
        )}

        {/* Nav scroll area */}
        <div className="sys-sb-nav">
          {/* Main navigation */}
          {!isCollapsed && <div className="sys-sec-label">Overview</div>}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {NAV_ITEMS.map((item) => (
              isCollapsed ? (
                <NavLink
                  key={item.id}
                  to={item.path}
                  title={item.label}
                  onClick={closeOnMobile}
                  className={({ isActive }) =>
                    `sys-collapsed-nav${isActive ? " active" : ""}`
                  }
                >
                  {item.icon}
                </NavLink>
              ) : (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={closeOnMobile}
                  className={({ isActive }) =>
                    `sys-nav-item${isActive ? " active" : ""}`
                  }
                >
                  <span className="sys-nav-icon">{item.icon}</span>
                  <span className="sys-nav-label">{item.label}</span>
                  {item.badge && (
                    <span className={`sys-nav-badge ${item.badgeType === "gold" ? "snb-gold" : "snb-blue"}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )
            ))}
          </div>

          {/* Active Gates (Projects) */}
          <div>
            {!isCollapsed ? (
              <>
                <div className="sys-sec-label">Active Gates</div>
                <div className="sys-gates-head">
                  <span className="sys-gates-meta">
                    {activeProjects.length} Active · {starredProjects.length} Priority
                  </span>
                  <button
                    className="sys-gates-toggle"
                    onClick={() => setGatesOpen(!gatesOpen)}
                  >
                    {gatesOpen ? "Hide ▲" : "Show ▼"}
                  </button>
                </div>

                {projectsLoading ? (
                  <div style={{ padding: "12px", textAlign: "center", color: "rgba(79,195,247,0.38)" }}>
                    Loading...
                  </div>
                ) : (
                  gatesOpen && activeProjects.map((project) => {
                    const rank = getProjectRank(project.progress);
                    const color = RANK_COLOR[rank];
                    const glow = RANK_GLOW[rank];
                    const progColor = (project.progress || 0) > 60 
                      ? "var(--sys-blue)" 
                      : (project.progress || 0) > 30 
                        ? "var(--sys-amber)" 
                        : "var(--sys-red)";
                    
                    return (
                      <NavLink
                        key={project.id}
                        to={`/projects/${project.id}`}
                        onClick={closeOnMobile}
                        className="sys-gate-item"
                      >
                        <span
                          className="sys-gate-rank"
                          style={{ color, textShadow: `0 0 6px ${glow}` }}
                        >
                          {rank}
                        </span>
                        <span className="sys-gate-name">{project.name}</span>
                        <div className="sys-gate-prog">
                          <div
                            className="sys-gate-prog-fill"
                            style={{
                              width: `${project.progress || 0}%`,
                              background: progColor,
                              boxShadow: (project.progress || 0) > 60 ? `0 0 4px ${progColor}` : "none",
                            }}
                          />
                        </div>
                        {(project.priority === "urgent" || project.priority === "high") && (
                          <span className="sys-gate-star">★</span>
                        )}
                      </NavLink>
                    );
                  })
                )}

                <NavLink to="/projects" onClick={closeOnMobile} className="sys-browse-gates">
                  <span style={{ color: "rgba(79,195,247,0.3)", fontSize: 13 }}>⊕</span>
                  <span className="sys-browse-gates-label">Browse All Gates</span>
                </NavLink>
              </>
            ) : (
              // Collapsed view - just show rank icons
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                {activeProjects.slice(0, 3).map((project) => {
                  const rank = getProjectRank(project.progress);
                  const color = RANK_COLOR[rank];
                  return (
                    <NavLink
                      key={project.id}
                      to={`/projects/${project.id}`}
                      title={project.name}
                      style={{
                        padding: "8px 0", width: "100%",
                        display: "flex", justifyContent: "center",
                        fontFamily: "'Cinzel', serif", fontSize: "12px", fontWeight: 700,
                        color, textShadow: `0 0 5px ${RANK_GLOW[rank]}`,
                        textDecoration: "none", transition: "background .2s",
                      }}
                    >
                      {rank}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Quests (High Priority Tasks) */}
          {!isCollapsed && (
            <div>
              <div className="sys-sec-label">Active Quests</div>
              {urgentTasks.length > 0 ? (
                urgentTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="sys-quest-item" 
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="sys-quest-dot"
                      style={{ 
                        background: task.priority === "urgent" 
                          ? "rgba(255,107,107,0.7)" 
                          : task.priority === "high"
                            ? "rgba(255,179,71,0.7)"
                            : "rgba(79,195,247,0.45)"
                      }}
                    />
                    <span className="sys-quest-label">{task.title}</span>
                    {task.priority && (
                      <span
                        className="sys-quest-tag"
                        style={{
                          color: task.priority === "urgent" ? "rgba(255,107,107,.7)" : "rgba(255,179,71,.7)",
                          borderColor: task.priority === "urgent" ? "rgba(255,107,107,.3)" : "rgba(255,179,71,.3)"
                        }}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: "8px 12px", fontSize: "11px", color: "rgba(79,195,247,0.28)" }}>
                  No active quests
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sys-sb-footer">
          {/* Desktop collapse toggle */}
          <button className="sys-collapse-btn hidden lg:flex" onClick={onToggle}>
            {isCollapsed
              ? <><ChevronRight size={14} /></>
              : <><ChevronLeft size={14} /><span>Collapse Panel</span></>
            }
          </button>

          {/* User / logout */}
          <div
            className="sys-user-row"
            onClick={handleLogout}
            title={isCollapsed ? "Log out" : ""}
            style={{ justifyContent: isCollapsed ? "center" : "flex-start" }}
          >
            <div className="sys-user-avatar">{userInitials}</div>
            {!isCollapsed && (
              <>
                <div>
                  <div className="sys-user-name">{userName}</div>
                  <div className="sys-user-email">{userEmail}</div>
                </div>
                <div className="sys-logout-label">
                  <LogOut size={13} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {!isCollapsed && (
        <div className="sys-overlay lg:hidden" onClick={onToggle} />
      )}
    </>
  );
}