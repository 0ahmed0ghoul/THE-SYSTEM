import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { notificationsData, quickStats, getPageTitle } from "./navbarData";

type NavbarProps = {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
};

// ── notification shape ───────────────────────────────────────────────────────
interface Notification {
  id: string | number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  urgency?: "urgent" | "high" | "";
}

const URGENCY_DOT: Record<string, string> = {
  urgent: "rgba(255,107,107,0.75)",
  high:   "rgba(255,179,71,0.75)",
  "":     "rgba(79,195,247,0.5)",
};

export default function Navbar({ onMenuClick, isSidebarOpen }: NavbarProps) {
  const { user }              = useAuthStore();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isNotifOpen, setIsNotifOpen]   = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const location  = useLocation();
  const navigate  = useNavigate();
  const logout    = useAuthStore((s) => s.logout);
  const notifRef  = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close panels on route change
  useEffect(() => {
    setIsNotifOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const pageTitle = getPageTitle(location.pathname);

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
        }

        /* ── shell ── */
        .sys-navbar {
          position: sticky; top: 0; z-index: 20;
          background: rgba(3,14,30,0.97);
          border-bottom: 1px solid rgba(79,195,247,0.15);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
        .sys-navbar::before {
          content: '';
          position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,0.45), rgba(79,195,247,0.15), transparent);
          pointer-events: none; z-index: 1;
        }
        .sys-nb-inner {
          height: 56px; padding: 0 20px;
          display: flex; align-items: center; justify-content: space-between;
          position: relative; z-index: 1;
        }

        /* ── left ── */
        .sys-nb-left  { display: flex; align-items: center; gap: 16px; }
        .sys-nb-page  { display: flex; align-items: center; gap: 8px; }
        .sys-nb-bar   {
          width: 2px; height: 18px; flex-shrink: 0;
          background: linear-gradient(180deg, transparent, var(--sys-blue), transparent);
          box-shadow: 0 0 6px var(--sys-blue);
        }
        .sys-nb-title {
          font-family: 'Cinzel', serif; font-size: 14px; font-weight: 700;
          letter-spacing: 2.5px; color: #e0f7fa; white-space: nowrap;
        }
        .sys-nb-mobile-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(79,195,247,0.45);
          background: none; border: 1px solid transparent; cursor: pointer;
          transition: color .2s, border-color .2s, background .2s;
        }
        .sys-nb-mobile-btn:hover { color: var(--sys-blue); border-color: rgba(79,195,247,.2); background: rgba(79,195,247,.06); }

        /* search */
        .sys-nb-search { position: relative; }
        .sys-nb-search-ico {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          color: rgba(79,195,247,0.28); pointer-events: none; display: flex;
        }
        .sys-nb-search-input {
          background: rgba(79,195,247,0.04);
          border: 1px solid rgba(79,195,247,0.15);
          color: #d0eeff;
          padding: 7px 40px 7px 32px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px; font-weight: 500; letter-spacing: .5px;
          width: 260px; outline: none;
          transition: border-color .25s, background .25s;
        }
        .sys-nb-search-input::placeholder { color: rgba(79,195,247,0.2); font-weight: 400; }
        .sys-nb-search-input:focus {
          border-color: rgba(79,195,247,0.45);
          background: rgba(79,195,247,0.07);
        }
        .sys-nb-kbd {
          position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
          font-size: 9px; letter-spacing: 1px;
          color: rgba(79,195,247,0.28);
          background: rgba(79,195,247,0.06);
          border: 1px solid rgba(79,195,247,0.15);
          padding: 1px 5px;
          font-family: 'Rajdhani', sans-serif;
        }

        /* ── right ── */
        .sys-nb-right { display: flex; align-items: center; gap: 5px; }
        .sys-quick-stats { display: flex; align-items: center; gap: 6px; margin-right: 8px; }
        .sys-nb-stat {
          display: flex; align-items: center; gap: 5px;
          padding: 4px 10px; border: 1px solid;
          font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
          white-space: nowrap;
          font-family: 'Rajdhani', sans-serif;
        }
        .sys-nb-stat-dot { width: 5px; height: 5px; border-radius: 50%; }
        .sns-green { color: rgba(79,230,160,.7); border-color: rgba(79,230,160,.2); background: rgba(79,230,160,.04); }
        .sns-blue  { color: rgba(79,195,247,.6); border-color: rgba(79,195,247,.18); background: rgba(79,195,247,.04); }

        /* icon buttons */
        .sys-nb-icon {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(79,195,247,0.38); cursor: pointer;
          border: 1px solid transparent;
          transition: color .2s, border-color .2s, background .2s;
          position: relative; flex-shrink: 0;
        }
        .sys-nb-icon:hover {
          color: rgba(200,230,255,.8);
          border-color: rgba(79,195,247,.2);
          background: rgba(79,195,247,.05);
        }
        .sys-nb-pip {
          position: absolute; top: 6px; right: 6px;
          width: 5px; height: 5px; background: var(--sys-red); border-radius: 50%;
          animation: pip-pulse 2s ease-in-out infinite;
        }
        @keyframes pip-pulse {
          0%,100% { opacity:1; box-shadow: 0 0 4px var(--sys-red); }
          50%      { opacity:0.5; box-shadow: none; }
        }
        .sys-nb-divider { width: 1px; height: 22px; background: rgba(79,195,247,.12); margin: 0 3px; }

        /* user button */
        .sys-nb-user {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 10px 5px 5px;
          border: 1px solid rgba(79,195,247,.15);
          cursor: pointer;
          transition: border-color .2s, background .2s;
          position: relative;
        }
        .sys-nb-user:hover { border-color: rgba(79,195,247,.35); background: rgba(79,195,247,.05); }
        .sys-nb-avatar {
          width: 28px; height: 28px; flex-shrink: 0;
          border: 1px solid rgba(79,195,247,.4);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif; font-size: 11px; font-weight: 700;
          color: var(--sys-blue); background: rgba(79,195,247,.07);
          position: relative;
        }
        .sys-nb-avatar::before {
          content: ''; position: absolute; inset: -3px;
          border: 1px solid rgba(79,195,247,.1);
        }
        .sys-nb-uname { font-size: 12px; font-weight: 600; letter-spacing: .5px; color: rgba(200,230,255,.8); white-space: nowrap; }
        .sys-nb-urole { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(79,195,247,.28); margin-top: 1px; white-space: nowrap; }
        .sys-nb-chevron { font-size: 10px; color: rgba(79,195,247,.25); margin-left: 2px; }

        /* ── dropdowns ── */
        .sys-nb-drop {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: rgba(4,16,34,0.99);
          border: 1px solid rgba(79,195,247,.22);
          z-index: 50; overflow: hidden;
          animation: drop-appear .15s ease both;
        }
        @keyframes drop-appear {
          from { opacity:0; transform: translateY(-6px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .sys-nb-drop::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,.5), transparent);
        }
        .sys-drop-head { padding: 12px 14px; border-bottom: 1px solid rgba(79,195,247,.1); }
        .sys-drop-head-row { display: flex; align-items: center; justify-content: space-between; }
        .sys-drop-title {
          font-family: 'Cinzel', serif; font-size: 12px; font-weight: 700;
          letter-spacing: 2px; color: #e0f7fa;
        }
        .sys-drop-name { font-size: 13px; font-weight: 600; letter-spacing: .5px; color: rgba(200,230,255,.85); }
        .sys-drop-sub  { font-size: 10px; letter-spacing: .5px; color: rgba(79,195,247,.28); margin-top: 2px; }
        .sys-drop-action {
          font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(79,195,247,.35); background: none; border: none; cursor: pointer;
          font-family: 'Rajdhani', sans-serif; transition: color .2s;
        }
        .sys-drop-action:hover { color: var(--sys-blue); }
        .sys-drop-item {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 14px; cursor: pointer;
          transition: background .2s;
          font-size: 12px; font-weight: 500; letter-spacing: .5px;
          color: rgba(190,225,245,.55); text-decoration: none;
        }
        .sys-drop-item:hover { background: rgba(79,195,247,.05); color: rgba(200,230,255,.85); }
        .sys-drop-item.sys-danger { color: rgba(255,107,107,.6); }
        .sys-drop-item.sys-danger:hover { background: rgba(255,107,107,.05); color: rgba(255,107,107,.85); }
        .sys-drop-sep { height: 1px; background: rgba(79,195,247,.08); margin: 2px 0; }
        .sys-drop-icon { width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }

        /* notif specific */
        .sys-notif-drop { width: 310px; }
        .sys-notif-list { max-height: 340px; overflow-y: auto; }
        .sys-notif-list::-webkit-scrollbar { width: 2px; }
        .sys-notif-list::-webkit-scrollbar-thumb { background: rgba(79,195,247,.12); }
        .sys-notif-item {
          display: flex; align-items: flex-start; gap: 9px;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(79,195,247,.06);
          cursor: pointer; transition: background .2s;
        }
        .sys-notif-item:hover { background: rgba(79,195,247,.04); }
        .sys-notif-item.unread { background: rgba(79,195,247,.025); }
        .sys-notif-dot { width: 7px; height: 7px; border-radius: 1px; transform: rotate(45deg); flex-shrink: 0; margin-top: 4px; }
        .sys-notif-txt { font-size: 12px; color: rgba(190,225,245,.6); line-height: 1.4; flex: 1; }
        .sys-notif-txt strong { color: rgba(200,230,255,.8); font-weight: 600; }
        .sys-notif-time { font-size: 10px; color: rgba(79,195,247,.22); letter-spacing: 1px; margin-top: 2px; }
        .sys-notif-pip { width: 5px; height: 5px; background: var(--sys-blue); border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
        .sys-notif-footer {
          padding: 8px 14px; border-top: 1px solid rgba(79,195,247,.08);
          text-align: center; cursor: pointer;
        }
        .sys-notif-view {
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,.3); background: none; border: none; cursor: pointer;
          font-family: 'Rajdhani', sans-serif; transition: color .2s;
        }
        .sys-notif-view:hover { color: var(--sys-blue); }

        /* profile drop */
        .sys-profile-drop { width: 220px; }

        /* mobile search */
        .sys-mobile-search {
          padding: 0 16px 10px;
          border-top: 1px solid rgba(79,195,247,.06);
        }
      `}</style>

      <nav className="sys-navbar">
        <div className="sys-nb-inner">

          {/* ── LEFT ────────────────────────────────────── */}
          <div className="sys-nb-left">
            {/* Mobile menu toggle */}
            <button
              className="sys-nb-mobile-btn lg:hidden"
              onClick={onMenuClick}
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              )}
            </button>

            {/* Page title */}
            <div className="sys-nb-page">
              <div className="sys-nb-bar" />
              <span className="sys-nb-title">{pageTitle.toUpperCase()}</span>
            </div>

            {/* Search */}
            <div className="sys-nb-search hidden md:block">
              <div className="sys-nb-search-ico">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
              <input
                className="sys-nb-search-input"
                type="text"
                placeholder="Search gates, quests, hunters..."
                aria-label="Search"
              />
              <span className="sys-nb-kbd">⌘K</span>
            </div>
          </div>

          {/* ── RIGHT ───────────────────────────────────── */}
          <div className="sys-nb-right">

            {/* Quick stats */}
            <div className="sys-quick-stats hidden lg:flex">
              <div className="sys-nb-stat sns-green">
                <span className="sys-nb-stat-dot" style={{ background: "var(--sys-green)", boxShadow: "0 0 4px var(--sys-green)" }} />
                {quickStats.tasksDone} cleared
              </div>
              <div className="sys-nb-stat sns-blue">
                <span className="sys-nb-stat-dot" style={{ background: "var(--sys-blue)" }} />
                {quickStats.tasksDueToday} due today
              </div>
            </div>

            {/* Theme toggle */}
            <button
              className="sys-nb-icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDarkMode ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            {/* Help */}
            <button className="sys-nb-icon hidden sm:flex" aria-label="Help" title="Help & Support">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
            </button>

            {/* Notifications */}
            <div className="sys-nb-icon" ref={notifRef} onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {unreadCount > 0 && <span className="sys-nb-pip" />}

              {isNotifOpen && (
                <div className="sys-nb-drop sys-notif-drop" onClick={(e) => e.stopPropagation()}>
                  <div className="sys-drop-head">
                    <div className="sys-drop-head-row">
                      <span className="sys-drop-title">SYSTEM ALERTS</span>
                      <button className="sys-drop-action" onClick={markAllRead}>
                        MARK ALL READ
                      </button>
                    </div>
                  </div>
                  <div className="sys-notif-list">
                    {notifications.length === 0 ? (
                      <div style={{ padding: "32px", textAlign: "center" }}>
                        <div style={{ fontSize: 28, opacity: .15, marginBottom: 8 }}>🔔</div>
                        <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(79,195,247,.3)" }}>No alerts</div>
                      </div>
                    ) : notifications.map((n) => (
                      <div key={n.id} className={`sys-notif-item${!n.read ? " unread" : ""}`}>
                        <div
                          className="sys-notif-dot"
                          style={{ background: URGENCY_DOT[n.urgency ?? ""] ?? URGENCY_DOT[""] }}
                        />
                        <div style={{ flex: 1 }}>
                          <div className="sys-notif-txt">
                            <strong>{n.title}</strong> {n.message}
                          </div>
                          <div className="sys-notif-time">{n.time}</div>
                        </div>
                        {!n.read && <div className="sys-notif-pip" />}
                      </div>
                    ))}
                  </div>
                  {notifications.length > 0 && (
                    <div className="sys-notif-footer">
                      <button
                        className="sys-notif-view"
                        onClick={() => { navigate("/notifications"); setIsNotifOpen(false); }}
                      >
                        VIEW ALL ALERTS ›
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="sys-nb-divider" />

            {/* Profile */}
            <div className="sys-nb-user" ref={profileRef} onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}>
              <div className="sys-nb-avatar">
                {user?.email ? user.email[0].toUpperCase() : "H"}
              </div>
              <div className="hidden md:block">
                <div className="sys-nb-uname">{user?.email?.split("@")[0] || "Hunter"}</div>
                <div className="sys-nb-urole">S-Rank Hunter</div>
              </div>
              <span className="sys-nb-chevron hidden md:block">▾</span>

              {isProfileOpen && (
                <div className="sys-nb-drop sys-profile-drop" onClick={(e) => e.stopPropagation()}>
                  <div className="sys-drop-head">
                    <div className="sys-drop-name">{user?.email?.split("@")[0] || "Hunter"}</div>
                    <div className="sys-drop-sub">{user?.email || "hunter@thesystem.io"}</div>
                  </div>
                  <div style={{ padding: "4px 0" }}>
                    <NavLink
                      to="/profile"
                      className="sys-drop-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="sys-drop-icon">◈</span> Hunter Profile
                    </NavLink>
                    <NavLink
                      to="/settings"
                      className="sys-drop-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="sys-drop-icon">✦</span> Account Settings
                    </NavLink>
                    <div className="sys-drop-sep" />
                    <button
                      className="sys-drop-item sys-danger w-full"
                      style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "'Rajdhani', sans-serif" }}
                      onClick={() => { logout(); navigate("/login"); setIsProfileOpen(false); }}
                    >
                      <span className="sys-drop-icon">↗</span> Exit System
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sys-mobile-search md:hidden">
          <div style={{ position: "relative" }}>
            <div className="sys-nb-search-ico" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <input
              className="sys-nb-search-input"
              style={{ width: "100%" }}
              type="text"
              placeholder="Search gates, quests..."
              aria-label="Mobile search"
            />
          </div>
        </div>
      </nav>
    </>
  );
}