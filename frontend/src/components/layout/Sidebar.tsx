import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { LogOut, Star, ChevronDown, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

type SidebarProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

// ── Rank helpers (mirrors the dashboard) ─────────────────────────────────────
function getProjectRank(progress: number): "S" | "A" | "B" | "C" {
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

// ── Static data (replace with real store data as needed) ─────────────────────
const NAV_ITEMS = [
  { id: "dashboard",  label: "Command Center", path: "/",          icon: "⬡" },
  { id: "analytics",  label: "Analytics",      path: "/analytics", icon: "◈", badge: "NEW", badgeType: "gold" },
  { id: "calendar",   label: "Calendar",        path: "/calendar",  icon: "◷" },
  { id: "team",       label: "Team",            path: "/team",      icon: "⊕", badge: "4",   badgeType: "blue" },
  { id: "settings",   label: "Settings",        path: "/settings",  icon: "✦" },
];

const GATE_ITEMS = [
  { id: "1", label: "Shadow Army Expansion",    progress: 72, starred: true  },
  { id: "2", label: "Gate Analytics Dashboard", progress: 45, starred: true  },
  { id: "3", label: "Hunter Guild API",         progress: 18, starred: false },
  { id: "4", label: "Mana Expenditure Tracker", progress: 61, starred: false },
];

const QUEST_ITEMS = [
  { id: "1", label: "Finalize PR Review for auth module",  urgency: "urgent" },
  { id: "2", label: "Update typography system docs",       urgency: "high"   },
  { id: "3", label: "Migrate legacy dungeon records",      urgency: ""       },
];

const URGENCY_STYLE: Record<string, string> = {
  urgent: "color:rgba(255,107,107,.7);border-color:rgba(255,107,107,.3)",
  high:   "color:rgba(255,179,71,.7);border-color:rgba(255,179,71,.3)",
};
const URGENCY_DOT: Record<string, string> = {
  urgent: "rgba(255,107,107,0.7)",
  high:   "rgba(255,179,71,0.7)",
  "":     "rgba(79,195,247,0.45)",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const navigate  = useNavigate();
  const logout    = useAuthStore((s) => s.logout);
  const [gatesOpen, setGatesOpen] = useState(true);

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
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        :root {
          --sys-blue:  #4fc3f7;
          --sys-gold:  #ffd54f;
          --sys-green: #4fe6a0;
          --sys-red:   #ff6b6b;
          --sys-amber: #ffb347;
          --sys-panel: rgba(4,18,38,0.98);
          --sys-border: rgba(79,195,247,0.18);
        }

        /* ── Sidebar shell ── */
        .sys-sb {
          position: fixed; top: 0; left: 0;
          height: 100vh;
          background: var(--sys-panel);
          border-right: 1px solid var(--sys-border);
          display: flex; flex-direction: column;
          transition: width 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1);
          z-index: 40;
          overflow: hidden;
        }
        .sys-sb::after {
          content: '';
          position: absolute; top: 0; right: -1px; width: 1px; height: 100%;
          background: linear-gradient(180deg, transparent, rgba(79,195,247,0.45), rgba(79,195,247,0.15), transparent);
          pointer-events: none;
        }

        /* ── Logo ── */
        .sys-sb-logo {
          padding: 16px 14px;
          border-bottom: 1px solid rgba(79,195,247,0.1);
          cursor: pointer;
          position: relative; overflow: hidden;
          transition: background .2s;
          flex-shrink: 0;
        }
        .sys-sb-logo:hover { background: rgba(79,195,247,0.03); }
        .sys-sb-logo::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,0.25), transparent);
        }
        .sys-logo-icon {
          width: 36px; height: 36px; flex-shrink: 0;
          border: 1px solid rgba(79,195,247,0.4);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif; font-size: 15px; font-weight: 700;
          color: var(--sys-blue);
          text-shadow: 0 0 8px rgba(79,195,247,0.7);
          position: relative;
        }
        .sys-logo-icon::before {
          content: ''; position: absolute; inset: -4px;
          border: 1px solid rgba(79,195,247,0.1);
        }
        .sys-logo-name {
          font-family: 'Cinzel', serif; font-size: 15px; font-weight: 700;
          letter-spacing: 3px; color: #e0f7fa;
          white-space: nowrap;
        }
        .sys-logo-sub {
          font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(79,195,247,0.28); margin-top: 2px;
          white-space: nowrap;
        }

        /* ── Rank bar ── */
        .sys-rank-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 7px 14px;
          background: rgba(255,213,79,0.03);
          border-bottom: 1px solid rgba(255,213,79,0.1);
          flex-shrink: 0;
        }
        .sys-rank-label {
          font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase;
          color: rgba(255,213,79,0.38);
          white-space: nowrap;
        }
        .sys-rank-val {
          font-family: 'Cinzel', serif; font-size: 11px; font-weight: 700;
          letter-spacing: 2px; color: var(--sys-gold);
          text-shadow: 0 0 8px rgba(255,213,79,0.4);
          display: flex; align-items: center; gap: 6px;
        }
        .sys-rank-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--sys-green);
          animation: sb-dot 2s ease-in-out infinite;
        }
        @keyframes sb-dot {
          0%,100% { opacity:1; box-shadow: 0 0 4px var(--sys-green); }
          50%      { opacity:0.4; box-shadow: none; }
        }

        /* ── Navigation scroll area ── */
        .sys-sb-nav {
          flex: 1; overflow-y: auto;
          padding: 14px 10px;
          display: flex; flex-direction: column;
          gap: 20px;
        }
        .sys-sb-nav::-webkit-scrollbar { width: 2px; }
        .sys-sb-nav::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.12); }

        /* Section label */
        .sys-sec-label {
          font-size: 9px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(79,195,247,0.26);
          padding: 0 8px; margin-bottom: 4px;
          display: flex; align-items: center; gap: 8px;
          white-space: nowrap;
        }
        .sys-sec-label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(79,195,247,0.1), transparent);
        }

        /* Nav items */
        .sys-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; cursor: pointer;
          position: relative;
          transition: background .2s, color .2s;
          color: rgba(79,195,247,0.38);
          white-space: nowrap;
          text-decoration: none;
        }
        .sys-nav-item::before {
          content: ''; position: absolute;
          left: 0; top: 50%; transform: translateY(-50%);
          width: 0; height: 60%;
          background: var(--sys-blue);
          transition: width .2s;
        }
        .sys-nav-item:hover { color: rgba(200,230,255,0.8); background: rgba(79,195,247,0.05); }
        .sys-nav-item:hover::before { width: 2px; }
        .sys-nav-item.active { color: #e0f7fa; background: rgba(79,195,247,0.08); }
        .sys-nav-item.active::before { width: 2px; box-shadow: 0 0 8px var(--sys-blue); }

        .sys-nav-icon {
          width: 20px; height: 20px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; line-height: 1;
        }
        .sys-nav-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: .5px;
          flex: 1;
        }
        .sys-nav-badge {
          font-size: 9px; font-weight: 700; letter-spacing: 1.5px;
          padding: 2px 6px; border: 1px solid;
          font-family: 'Rajdhani', sans-serif;
          white-space: nowrap;
        }
        .snb-gold { color: var(--sys-gold); border-color: rgba(255,213,79,0.35); background: rgba(255,213,79,0.05); }
        .snb-blue { color: var(--sys-blue); border-color: rgba(79,195,247,0.3);   background: rgba(79,195,247,0.05); }

        /* ── Gates section ── */
        .sys-gates-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 2px 8px; margin-bottom: 2px;
        }
        .sys-gates-meta {
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,0.22);
        }
        .sys-gates-toggle {
          font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(79,195,247,0.25);
          background: none; border: none; cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          transition: color .2s;
          padding: 2px 4px;
        }
        .sys-gates-toggle:hover { color: var(--sys-blue); }

        .sys-gate-item {
          display: flex; align-items: center; gap: 9px;
          padding: 8px 10px; cursor: pointer;
          transition: background .2s;
          text-decoration: none;
          position: relative;
        }
        .sys-gate-item:hover { background: rgba(79,195,247,0.04); }
        .sys-gate-rank {
          font-family: 'Cinzel', serif; font-size: 11px; font-weight: 700;
          width: 16px; flex-shrink: 0; text-align: center; line-height: 1;
        }
        .sys-gate-name {
          font-size: 12px; font-weight: 500; letter-spacing: .3px;
          color: rgba(190,225,245,0.6); flex: 1;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          transition: color .2s;
        }
        .sys-gate-item:hover .sys-gate-name { color: rgba(200,230,255,0.88); }
        .sys-gate-prog {
          width: 30px; height: 2px;
          background: rgba(79,195,247,0.08);
          flex-shrink: 0; overflow: hidden;
        }
        .sys-gate-prog-fill { height: 100%; transition: width 0.8s ease; }
        .sys-gate-star {
          font-size: 10px; color: var(--sys-gold); opacity: .75;
          flex-shrink: 0;
        }

        .sys-browse-gates {
          display: flex; align-items: center; gap: 7px;
          margin: 6px 2px 2px;
          padding: 7px 8px;
          border: 1px dashed rgba(79,195,247,0.14);
          cursor: pointer; transition: border-color .2s, color .2s;
          text-decoration: none;
        }
        .sys-browse-gates:hover {
          border-color: rgba(79,195,247,0.32);
          background: rgba(79,195,247,0.03);
        }
        .sys-browse-gates-label {
          font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,0.28);
          transition: color .2s;
          white-space: nowrap;
        }
        .sys-browse-gates:hover .sys-browse-gates-label { color: var(--sys-blue); }

        /* ── Quests section ── */
        .sys-quest-item {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 8px 10px; cursor: pointer;
          transition: background .2s;
        }
        .sys-quest-item:hover { background: rgba(79,195,247,0.04); }
        .sys-quest-dot {
          width: 7px; height: 7px; border-radius: 1px;
          transform: rotate(45deg); flex-shrink: 0; margin-top: 4px;
        }
        .sys-quest-label {
          font-size: 12px; letter-spacing: .3px; line-height: 1.35;
          color: rgba(190,225,245,0.52); flex: 1;
          transition: color .2s;
        }
        .sys-quest-item:hover .sys-quest-label { color: rgba(200,230,255,0.82); }
        .sys-quest-tag {
          font-size: 9px; font-weight: 700; letter-spacing: 1px;
          padding: 2px 5px; border: 1px solid;
          font-family: 'Rajdhani', sans-serif;
          flex-shrink: 0; margin-top: 1px;
        }

        /* Collapsed icon-only items */
        .sys-collapsed-nav {
          display: flex; align-items: center; justify-content: center;
          padding: 10px 0; cursor: pointer;
          transition: background .2s, color .2s;
          color: rgba(79,195,247,0.38);
          font-size: 16px;
          text-decoration: none;
        }
        .sys-collapsed-nav:hover { background: rgba(79,195,247,0.05); color: rgba(200,230,255,0.8); }
        .sys-collapsed-nav.active { color: var(--sys-blue); background: rgba(79,195,247,0.08); }

        /* ── Footer ── */
        .sys-sb-footer {
          border-top: 1px solid rgba(79,195,247,0.1);
          padding: 10px;
          flex-shrink: 0;
        }
        .sys-sb-footer::before {
          content: ''; display: block; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,0.18), transparent);
          margin-bottom: 10px;
        }
        .sys-collapse-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 7px;
          font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,0.28);
          background: none;
          border: 1px solid rgba(79,195,247,0.1);
          cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          transition: all .2s;
          margin-bottom: 8px;
          white-space: nowrap;
        }
        .sys-collapse-btn:hover {
          border-color: rgba(79,195,247,0.32);
          color: var(--sys-blue);
          background: rgba(79,195,247,0.03);
        }
        .sys-user-row {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; cursor: pointer;
          transition: background .2s;
          position: relative;
        }
        .sys-user-row:hover { background: rgba(79,195,247,0.04); }
        .sys-user-avatar {
          width: 34px; height: 34px; flex-shrink: 0;
          border: 1px solid rgba(79,195,247,0.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif; font-size: 12px; font-weight: 700;
          color: var(--sys-blue); background: rgba(79,195,247,0.07);
          position: relative;
        }
        .sys-user-avatar::after {
          content: ''; position: absolute; inset: -3px;
          border: 1px solid rgba(79,195,247,0.1);
        }
        .sys-user-name {
          font-size: 13px; font-weight: 600; letter-spacing: .5px;
          color: rgba(200,230,255,0.8); line-height: 1; white-space: nowrap;
        }
        .sys-user-email {
          font-size: 10px; letter-spacing: .5px;
          color: rgba(79,195,247,0.28); margin-top: 2px; white-space: nowrap;
        }
        .sys-logout-label {
          margin-left: auto; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(79,195,247,0.2); transition: color .2s; white-space: nowrap;
        }
        .sys-user-row:hover .sys-logout-label { color: rgba(255,107,107,.55); }

        /* Mobile toggle button */
        .sys-mobile-btn {
          position: fixed; top: 14px; left: 14px; z-index: 50;
          width: 38px; height: 38px;
          background: rgba(4,18,38,0.95);
          border: 1px solid rgba(79,195,247,0.3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--sys-blue);
          transition: border-color .2s;
        }
        .sys-mobile-btn:hover { border-color: var(--sys-blue); }

        /* Mobile overlay */
        .sys-overlay {
          position: fixed; inset: 0;
          background: rgba(2,8,17,0.65);
          backdrop-filter: blur(4px);
          z-index: 30;
        }
      `}</style>

      {/* ── Mobile toggle ─────────────────────────────────────── */}
      <button className="sys-mobile-btn lg:hidden" onClick={onToggle}>
        {isCollapsed ? <Menu size={18} /> : <X size={18} />}
      </button>

      {/* ── Sidebar ───────────────────────────────────────────── */}
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

        {/* Rank banner */}
        {!isCollapsed && (
          <div className="sys-rank-bar">
            <span className="sys-rank-label">Hunter Status</span>
            <div className="sys-rank-val">
              <span className="sys-rank-dot" />
              S-RANK
            </div>
          </div>
        )}

        {/* Nav scroll area */}
        <div className="sys-sb-nav">

          {/* ── Main navigation ── */}
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

          {/* ── Active Gates ── */}
          <div>
            {!isCollapsed ? (
              <>
                <div className="sys-sec-label">Active Gates</div>
                <div className="sys-gates-head">
                  <span className="sys-gates-meta">{GATE_ITEMS.length} Open · {GATE_ITEMS.filter(g => g.starred).length} Starred</span>
                  <button
                    className="sys-gates-toggle"
                    onClick={() => setGatesOpen(!gatesOpen)}
                  >
                    {gatesOpen ? "Hide ▲" : "Show ▼"}
                  </button>
                </div>

                {gatesOpen && GATE_ITEMS.map((gate) => {
                  const rank = getProjectRank(gate.progress);
                  const color = RANK_COLOR[rank];
                  const glow  = RANK_GLOW[rank];
                  const progColor = gate.progress > 60 ? "var(--sys-blue)" : gate.progress > 30 ? "var(--sys-amber)" : "var(--sys-red)";
                  return (
                    <NavLink
                      key={gate.id}
                      to={`/projects/${gate.id}`}
                      onClick={closeOnMobile}
                      className="sys-gate-item"
                    >
                      <span
                        className="sys-gate-rank"
                        style={{ color, textShadow: `0 0 6px ${glow}` }}
                      >
                        {rank}
                      </span>
                      <span className="sys-gate-name">{gate.label}</span>
                      <div className="sys-gate-prog">
                        <div
                          className="sys-gate-prog-fill"
                          style={{
                            width: `${gate.progress}%`,
                            background: progColor,
                            boxShadow: gate.progress > 60 ? `0 0 4px ${progColor}` : "none",
                          }}
                        />
                      </div>
                      {gate.starred && <span className="sys-gate-star">★</span>}
                    </NavLink>
                  );
                })}

                <NavLink to="/projects" onClick={closeOnMobile} className="sys-browse-gates">
                  <span style={{ color: "rgba(79,195,247,0.3)", fontSize: 13 }}>⊕</span>
                  <span className="sys-browse-gates-label">Browse All Gates</span>
                </NavLink>
              </>
            ) : (
              // Collapsed: just icons
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                {GATE_ITEMS.slice(0, 3).map((gate) => {
                  const rank = getProjectRank(gate.progress);
                  const color = RANK_COLOR[rank];
                  return (
                    <NavLink
                      key={gate.id}
                      to={`/projects/${gate.id}`}
                      title={gate.label}
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

          {/* ── Active Quests ── */}
          {!isCollapsed && (
            <div>
              <div className="sys-sec-label">Active Quests</div>
              {QUEST_ITEMS.map((quest) => (
                <div key={quest.id} className="sys-quest-item" onClick={() => navigate("/tasks")}>
                  <div
                    className="sys-quest-dot"
                    style={{ background: URGENCY_DOT[quest.urgency] ?? URGENCY_DOT[""] }}
                  />
                  <span className="sys-quest-label">{quest.label}</span>
                  {quest.urgency && (
                    <span
                      className="sys-quest-tag"
                      style={{ ...(URGENCY_STYLE[quest.urgency] ? {} : {}) }}
                    >
                      {quest.urgency.toUpperCase()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
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
            <div className="sys-user-avatar">AD</div>
            {!isCollapsed && (
              <>
                <div>
                  <div className="sys-user-name">Alex Doe</div>
                  <div className="sys-user-email">alex@thesystem.io</div>
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