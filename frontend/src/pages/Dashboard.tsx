// frontend/src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthDebug } from '../components/AuthDebug';
import {
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react";
import CreateProjectModal from "../features/projects/components/CreateProjectModal";
import { dashboardApi } from "../api/dashboard.api";
import type { 
  ProjectSummary, 
  TaskSummary, 
  ActivityItem, 
  DashboardStats 
} from "../types/dashboard";

type ViewType = "projects" | "tasks";

// ── Rank assignment helpers ──────────────────────────────────────────────────
function getProjectRank(priority: string): "S" | "A" | "B" | "C" | "D" {
  return (
    ({ urgent: "S", high: "A", medium: "B", low: "C" } as Record<string, any>)[
      priority
    ] ?? "D"
  );
}

function getRankStyle(rank: string) {
  return (
    {
      S: {
        badge: "text-red-400 border-red-500/40 bg-red-500/5 shadow-[0_0_8px_rgba(255,100,100,0.4)]",
        text: "text-red-400",
      },
      A: {
        badge: "text-amber-400 border-amber-500/40 bg-amber-500/5 shadow-[0_0_8px_rgba(255,180,70,0.4)]",
        text: "text-amber-400",
      },
      B: {
        badge: "text-sky-300 border-sky-400/40 bg-sky-400/5 shadow-[0_0_8px_rgba(79,195,247,0.4)]",
        text: "text-sky-300",
      },
      C: {
        badge: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_8px_rgba(79,230,160,0.4)]",
        text: "text-emerald-400",
      },
      D: {
        badge: "text-sky-500/50 border-sky-500/20 bg-transparent",
        text: "text-sky-500/50",
      },
    }[rank] ?? { badge: "text-sky-500/50 border-sky-500/20", text: "text-sky-500/50" }
  );
}

function getStatusTag(status: string) {
  return (
    {
      active: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
      planning: "text-sky-400 border-sky-400/30 bg-sky-400/5",
      onHold: "text-amber-400 border-amber-500/30 bg-amber-500/5",
      completed: "text-sky-500/50 border-sky-500/20 bg-transparent",
      archived: "text-sky-500/30 border-sky-500/15 bg-transparent",
    }[status] ?? "text-sky-500/30 border-sky-500/15"
  );
}

function statusLabel(status: string) {
  return (
    ({
      active: "ACTIVE",
      planning: "PLANNING",
      onHold: "ON HOLD",
      completed: "CLEARED",
      archived: "ARCHIVED",
    } as Record<string, string>)[status] ?? status.toUpperCase()
  );
}

function taskStatusStyle(status: string) {
  return (
    {
      todo: { cls: "text-sky-400/50 border-sky-400/20", label: "STANDBY" },
      inprogress: { cls: "text-amber-400 border-amber-400/35", label: "IN PROGRESS" },
      review: { cls: "text-emerald-400 border-emerald-400/35", label: "REVIEW" },
      done: { cls: "text-sky-500/30 border-sky-500/15", label: "DONE" },
    }[status] ?? { cls: "text-sky-400/50 border-sky-400/20", label: status.toUpperCase() }
  );
}

// ── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
  barWidth,
  delay,
}: {
  label: string;
  value: number;
  sub: string;
  accent: string;
  icon: string;
  barWidth: number;
  delay: string;
}) {
  const count = useCountUp(value);
  return (
    <div
      className="relative bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 overflow-hidden
                 hover:border-[rgba(79,195,247,0.45)] transition-colors duration-300"
      style={{ animationDelay: delay, animation: "fade-in-up 0.5s ease both" }}
    >
      {/* top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      {/* corner brackets */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[rgba(79,195,247,0.3)]" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[rgba(79,195,247,0.3)]" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-[rgba(79,195,247,0.45)]">
          {label}
        </span>
        <span className="text-lg opacity-40">{icon}</span>
      </div>
      <div
        className="font-[Cinzel,serif] text-4xl font-black leading-none mb-1"
        style={{ color: accent, textShadow: `0 0 20px ${accent}66` }}
      >
        {count}
      </div>
      <div className="text-[11px] tracking-[1px] text-[rgba(79,195,247,0.35)] mt-1">{sub}</div>
      <div className="h-[2px] mt-3 bg-[rgba(79,195,247,0.06)] overflow-hidden">
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{
            width: `${barWidth}%`,
            background: accent,
            boxShadow: `0 0 6px ${accent}`,
          }}
        />
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ViewType>("projects");
  const [activeTab, setActiveTab] = useState("all");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // State for API data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projectsData, setProjectsData] = useState<ProjectSummary[]>([]);
  const [upcomingTasksData, setUpcomingTasksData] = useState<TaskSummary[]>([]);
  const [activityData, setActivityData] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [statsData, projects, tasks, activities] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentProjects(100, 'all'),
          dashboardApi.getUpcomingTasks(8),
          dashboardApi.getActivityFeed(10)
        ]);
        
        setStats(statsData);
        setProjectsData(projects);
        setUpcomingTasksData(tasks);
        setActivityData(activities);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Filter projects based on active tab
  const recentProjects = projectsData
    .filter((project: ProjectSummary) => {
      if (activeTab === "all") return project.status === "active" || project.status === "planning";
      if (activeTab === "active") return project.status === "active";
      if (activeTab === "planning") return project.status === "planning";
      if (activeTab === "done") return project.status === "completed";
      return true;
    })
    .slice(0, 6);

  const urgentCount = projectsData.filter((p: ProjectSummary) => p.priority === "urgent").length;

  // Calculate stats if not available from API
  const dashboardStats = stats || {
    totalProjects: projectsData.length,
    activeProjects: projectsData.filter((p: ProjectSummary) => p.status === "active").length,
    planningProjects: projectsData.filter((p: ProjectSummary) => p.status === "planning").length,
    completedProjects: projectsData.filter((p: ProjectSummary) => p.status === "completed").length,
    onHoldProjects: projectsData.filter((p: ProjectSummary) => p.status === "onHold").length,
    archivedProjects: projectsData.filter((p: ProjectSummary) => p.status === "archived").length,
    urgentProjects: projectsData.filter((p: ProjectSummary) => p.priority === "urgent").length,
    highPriorityProjects: projectsData.filter((p: ProjectSummary) => p.priority === "high").length,
    totalTasks: upcomingTasksData.length,
    activeTasks: upcomingTasksData.filter((t: TaskSummary) => t.status !== "done").length,
    inProgressTasks: upcomingTasksData.filter((t: TaskSummary) => t.status === "inprogress").length,
    reviewTasks: upcomingTasksData.filter((t: TaskSummary) => t.status === "review").length,
    completedTasks: upcomingTasksData.filter((t: TaskSummary) => t.status === "done").length,
    completionRate: projectsData.length > 0 
      ? (projectsData.filter((p: ProjectSummary) => p.status === "completed").length / projectsData.length) * 100 
      : 0,
  };

  // Transform activity data for display
  const activityLog = activityData.slice(0, 4).map((activity: ActivityItem) => ({
    color: activity.type === 'project' ? 'var(--sys-blue)' : 
           activity.action === 'completed' ? 'var(--sys-green)' : 
           activity.action === 'created' ? 'var(--sys-gold)' : 'var(--sys-red)',
    text: activity.description,
    time: new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  // Default activity log if none from API
  const defaultActivityLog = [
    { color: "var(--sys-blue)", text: "System initialized", time: "Just now" },
    { color: "var(--sys-green)", text: "Dashboard connected", time: "1 min ago" },
  ];

  const displayActivityLog = activityLog.length > 0 ? activityLog : defaultActivityLog;

  // Loading state
  if (loading) {
    return (
      <div className="sys-dashboard flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-[#4fc3f7] mb-4 font-[Rajdhani] tracking-wider">Loading command center...</div>
          <div className="w-8 h-8 border-2 border-[#4fc3f7] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="sys-dashboard flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-400 mb-4 font-[Rajdhani] tracking-wider">Error loading dashboard</div>
          <div className="text-[rgba(79,195,247,0.5)] text-sm">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 border border-[rgba(79,195,247,0.3)] text-[#4fc3f7] text-sm hover:bg-[rgba(79,195,247,0.1)] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthDebug/>
      <div className="sys-dashboard">
        <div className="sys-bg-grid" />
        <div className="sys-bg-orb1" />
        <div className="sys-bg-orb2" />
        <div className="sys-scanlines" />

        <div className="sys-content">

          {/* ── TOPBAR ──────────────────────────────────────────── */}
          <div className="sys-topbar" style={{ animation: "fade-in-up .4s ease both" }}>
            <div className="sys-logo">
              <div className="sys-logo-icon">S</div>
              <span className="sys-logo-name">THE SYSTEM</span>
            </div>
            <div className="sys-topbar-meta">
              <span className="sys-tb-item">
                <span className="sys-online-dot" />
                Command Active
              </span>
              <span className="sys-tb-item">
                Gates: {dashboardStats.activeProjects + dashboardStats.planningProjects} Open
              </span>
              <span className="sys-tb-item">
                Quests: {upcomingTasksData.length} Active
              </span>
              <div className="sys-rank-badge">S-RANK HUNTER</div>
            </div>
          </div>

          {/* ── PAGE HEADER ─────────────────────────────────────── */}
          <div className="sys-page-head" style={{ animation: "fade-in-up .4s .06s ease both" }}>
            <div className="sys-page-title">COMMAND CENTER</div>
            <div className="sys-page-sub">Hunter Operations Dashboard · All systems operational</div>
            <div className="sys-page-divider" />
          </div>

          {/* ── STAT CARDS ──────────────────────────────────────── */}
          <div className="sys-stats-grid">
            <StatCard
              label="Active Gates"
              value={dashboardStats.activeProjects + dashboardStats.planningProjects}
              sub={`${dashboardStats.activeProjects} in progress`}
              accent="#4fc3f7"
              icon="⬡"
              barWidth={Math.min(((dashboardStats.activeProjects + dashboardStats.planningProjects) / Math.max(dashboardStats.totalProjects, 1)) * 100, 100)}
              delay="0.08s"
            />
            <StatCard
              label="Cleared"
              value={dashboardStats.completedProjects}
              sub="Gates cleared"
              accent="#4fe6a0"
              icon="✦"
              barWidth={Math.min((dashboardStats.completedProjects / Math.max(dashboardStats.totalProjects, 1)) * 100, 100)}
              delay="0.12s"
            />
            <StatCard
              label="Active Quests"
              value={upcomingTasksData.length}
              sub="Tasks in queue"
              accent="#ffd54f"
              icon="◈"
              barWidth={Math.min((upcomingTasksData.length / 20) * 100, 100)}
              delay="0.16s"
            />
            <StatCard
              label="On Hold"
              value={dashboardStats.onHoldProjects}
              sub="Suspended operations"
              accent="#ff6b6b"
              icon="⚠"
              barWidth={Math.min((dashboardStats.onHoldProjects / Math.max(dashboardStats.totalProjects, 1)) * 100, 100)}
              delay="0.2s"
            />
          </div>

          {/* ── CONTENT GRID ────────────────────────────────────── */}
          <div className="sys-content-grid">

            {/* LEFT: Projects or Tasks */}
            <div className="sys-panel" style={{ animation: "fade-in-up .4s .22s ease both" }}>
              <div className="sys-panel-head">
                <div className="sys-panel-head-left">
                  {/* Toggle inside panel head */}
                  <div
                    className="sys-panel-badge"
                    style={
                      activeView === "tasks"
                        ? { background: "var(--sys-gold)", boxShadow: "0 0 6px var(--sys-gold)" }
                        : {}
                    }
                  />
                  <button
                    onClick={() => setActiveView("projects")}
                    className="sys-tab"
                    style={
                      activeView === "projects"
                        ? { padding: "0 10px 0 0", color: "#e0f7fa", fontFamily: "'Cinzel', serif", fontSize: "13px", letterSpacing: "2px", borderBottom: "none", fontWeight: "700" }
                        : { padding: "0 10px 0 0", borderBottom: "none", opacity: 0.4 }
                    }
                  >
                    ACTIVE GATES
                  </button>
                  <span style={{ color: "rgba(79,195,247,0.2)", fontSize: 12 }}>|</span>
                  <button
                    onClick={() => setActiveView("tasks")}
                    className="sys-tab"
                    style={
                      activeView === "tasks"
                        ? { padding: "0 0 0 10px", color: "#e0f7fa", fontFamily: "'Cinzel', serif", fontSize: "13px", letterSpacing: "2px", borderBottom: "none", fontWeight: "700" }
                        : { padding: "0 0 0 10px", borderBottom: "none", opacity: 0.4 }
                    }
                  >
                    QUEST BOARD
                  </button>
                  <span className="sys-panel-count">
                    {activeView === "projects" ? `${recentProjects.length} OPEN` : `${upcomingTasksData.length} ACTIVE`}
                  </span>
                </div>
                <button className="sys-new-btn" onClick={() => setIsProjectModalOpen(true)}>
                  <Plus size={12} />
                  {activeView === "projects" ? "OPEN GATE" : "ADD QUEST"}
                </button>
              </div>

              {/* Urgent alert */}
              {urgentCount > 0 && activeView === "projects" && (
                <div className="sys-gate-alert">
                  <AlertTriangle size={13} style={{ color: "var(--sys-red)", flexShrink: 0 }} />
                  <span className="sys-alert-tag">URGENT</span>
                  <span className="sys-alert-txt">
                    {urgentCount} S-Rank gate{urgentCount > 1 ? "s" : ""} requiring immediate attention
                  </span>
                </div>
              )}

              {/* Tabs – projects view */}
              {activeView === "projects" && (
                <div className="sys-tab-row">
                  {["all", "active", "planning", "done"].map((t) => (
                    <button
                      key={t}
                      className={`sys-tab${activeTab === t ? " active" : ""}`}
                      onClick={() => setActiveTab(t)}
                    >
                      {t === "all" ? "All Gates" : t === "active" ? "Active" : t === "planning" ? "Planning" : "Cleared"}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Projects List ── */}
              {activeView === "projects" && (
                <>
                  <div className="sys-proj-list">
                    {recentProjects.length > 0 ? (
                      recentProjects.map((project: ProjectSummary) => {
                        const rank = getProjectRank(project.priority ?? "medium");
                        const rs = getRankStyle(rank);
                        const prog = project.progress ?? 0;
                        const progColor =
                          prog > 60 ? "var(--sys-blue)" : prog > 30 ? "var(--sys-amber)" : "var(--sys-red)";

                        return (
                          <div
                            key={project.id}
                            className="sys-proj-row"
                            onClick={() => navigate(`/projects/${project.id}`)}
                          >
                            <div className="sys-pr-corners">
                              <div className="prc-br" />
                              <div className="prc-bl" />
                            </div>

                            {/* Rank box */}
                            <div className={`sys-rank-box ${rs.badge}`}>{rank}</div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="sys-pr-name">{project.name}</span>
                                {project.status && (
                                  <span className={`sys-pr-tag ${getStatusTag(project.status)}`}>
                                    {statusLabel(project.status)}
                                  </span>
                                )}
                              </div>

                              {project.description && (
                                <div className="sys-pr-desc">{project.description}</div>
                              )}

                              <div className="sys-pr-meta">
                                {project.teamMembers && project.teamMembers.length > 0 && (
                                  <span className="sys-pr-meta-item">
                                    <Users size={10} /> {project.teamMembers.length} hunters
                                  </span>
                                )}
                                {project.dueDate && (
                                  <span className="sys-pr-meta-item">
                                    <Calendar size={10} />
                                    {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </span>
                                )}
                                <span className={`sys-pr-meta-item font-semibold ${rs.text}`}>
                                  {rank}-Rank Gate
                                </span>

                                <button
                                  onClick={(e) => { e.stopPropagation(); }}
                                  className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 transition-all"
                                  style={{ opacity: 0 }}
                                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                                >
                                  <MoreHorizontal size={14} style={{ color: "rgba(79,195,247,0.35)" }} />
                                </button>
                              </div>

                              {/* Progress bar */}
                              <div className="mt-3">
                                <div className="sys-pr-prog-label">
                                  <span>PROGRESS</span>
                                  <span style={{ color: progColor }}>{prog}%</span>
                                </div>
                                <div className="sys-pr-track">
                                  <div
                                    className="sys-pr-fill"
                                    style={{
                                      width: `${prog}%`,
                                      background: `linear-gradient(90deg, rgba(79,195,247,0.3), ${progColor})`,
                                      boxShadow: `0 0 5px ${progColor}`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="sys-empty">
                        <div className="sys-empty-icon">⬡</div>
                        <div className="sys-empty-txt">No gates found</div>
                        <button
                          className="sys-empty-link"
                          onClick={() => setIsProjectModalOpen(true)}
                        >
                          Open first gate →
                        </button>
                      </div>
                    )}
                  </div>

                  <button className="sys-add-gate" onClick={() => setIsProjectModalOpen(true)}>
                    ⊕ REGISTER NEW GATE
                  </button>
                  {recentProjects.length > 0 && (
                    <button className="sys-view-more" onClick={() => navigate("/projects")}>
                      VIEW ALL GATES <ArrowUpRight size={11} />
                    </button>
                  )}
                </>
              )}

              {/* ── Tasks List ── */}
              {activeView === "tasks" && (
                <>
                  <div className="sys-proj-list">
                    {upcomingTasksData.length > 0 ? (
                      upcomingTasksData.map((task: TaskSummary) => {
                        const rank = getProjectRank(task.priority ?? "medium");
                        const rs = getRankStyle(rank);
                        const ts = taskStatusStyle(task.status);

                        return (
                          <div
                            key={task.id}
                            className="sys-proj-row"
                            onClick={() => navigate(`/tasks/${task.id}`)}
                          >
                            <div className="sys-pr-corners">
                              <div className="prc-br" /><div className="prc-bl" />
                            </div>
                            <div className={`sys-rank-box ${rs.badge}`}>{rank}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="sys-pr-name">{task.title}</span>
                                <span className={`sys-quest-status ${ts.cls}`}>{ts.label}</span>
                              </div>
                              {task.projectName && (
                                <div className="sys-pr-desc">{task.projectName}</div>
                              )}
                              <div className="sys-pr-meta">
                                {task.dueDate && (
                                  <span className="sys-pr-meta-item">
                                    <Calendar size={10} />
                                    {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </span>
                                )}
                                <span className="sys-pr-meta-item">
                                  <Clock size={10} />
                                  {task.status === "inprogress" ? "In Progress" : task.status === "review" ? "Under Review" : "Standby"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="sys-empty">
                        <div className="sys-empty-icon">✦</div>
                        <div className="sys-empty-txt">Quest board is clear</div>
                        <div className="sys-act-time" style={{ textAlign: "center", marginTop: 6 }}>
                          All quests completed. Outstanding work, Hunter.
                        </div>
                      </div>
                    )}
                  </div>

                  {upcomingTasksData.length > 0 && (
                    <button className="sys-view-more" onClick={() => navigate("/tasks")}>
                      VIEW ALL QUESTS <ArrowUpRight size={11} />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* ── RIGHT SIDEBAR ─────────────────────────────────── */}
            <div className="flex flex-col gap-3">

              {/* System Stats */}
              <div className="sys-panel" style={{ animation: "fade-in-up .4s .28s ease both" }}>
                <div className="sys-panel-head">
                  <div className="sys-panel-head-left">
                    <div className="sys-panel-badge" style={{ background: "var(--sys-green)", boxShadow: "0 0 6px var(--sys-green)" }} />
                    <span className="sys-panel-title">SYSTEM METRICS</span>
                  </div>
                </div>
                <div className="sys-mini-stats">
                  {[
                    {
                      val: dashboardStats.totalProjects > 0 ? `${Math.round((dashboardStats.completedProjects / dashboardStats.totalProjects) * 100)}%` : "0%",
                      label: "Completion",
                      color: "var(--sys-blue)",
                    },
                    { val: `+${dashboardStats.activeProjects}`, label: "This Cycle", color: "var(--sys-green)" },
                    { val: `${upcomingTasksData.filter((t: TaskSummary) => t.status === "inprogress").length}`, label: "In Progress", color: "var(--sys-gold)" },
                    {
                      val: `${projectsData.filter((p: ProjectSummary) => p.priority === "urgent" || p.priority === "high").length}`,
                      label: "High Priority",
                      color: "var(--sys-red)",
                    },
                  ].map((m, i) => (
                    <div key={i} className="sys-ms-item">
                      <div className="sys-ms-val" style={{ color: m.color, textShadow: `0 0 14px ${m.color}66` }}>
                        {m.val}
                      </div>
                      <div className="sys-ms-label">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent quests when in projects view */}
              {activeView === "projects" && upcomingTasksData.length > 0 && (
                <div className="sys-panel" style={{ animation: "fade-in-up .4s .32s ease both" }}>
                  <div className="sys-panel-head">
                    <div className="sys-panel-head-left">
                      <div className="sys-panel-badge" style={{ background: "var(--sys-gold)", boxShadow: "0 0 6px var(--sys-gold)" }} />
                      <span className="sys-panel-title">PENDING QUESTS</span>
                    </div>
                    <span className="sys-panel-count" style={{ color: "rgba(255,213,79,0.5)", borderColor: "rgba(255,213,79,0.2)" }}>
                      {upcomingTasksData.length} ACTIVE
                    </span>
                  </div>
                  {upcomingTasksData.slice(0, 5).map((task: TaskSummary) => {
                    const rank = getProjectRank(task.priority ?? "medium");
                    const rs = getRankStyle(rank);
                    const ts = taskStatusStyle(task.status);
                    return (
                      <div
                        key={task.id}
                        className="sys-quest-item"
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className={`font-[Cinzel,serif] text-[13px] font-bold flex-shrink-0 mt-0.5 ${rs.text}`}>
                            {rank}
                          </span>
                          <span className="sys-quest-title">{task.title}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="sys-pr-meta-item">
                            {task.dueDate && (
                              <><Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
                            )}
                          </span>
                          <span className={`sys-quest-status ${ts.cls}`}>{ts.label}</span>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    className="sys-view-more"
                    style={{ color: "rgba(255,213,79,0.28)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sys-gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,213,79,0.28)")}
                    onClick={() => setActiveView("tasks")}
                  >
                    VIEW ALL QUESTS <ArrowUpRight size={11} />
                  </button>
                </div>
              )}

              {/* Activity log */}
              <div className="sys-panel" style={{ animation: "fade-in-up .4s .36s ease both" }}>
                <div className="sys-panel-head">
                  <div className="sys-panel-head-left">
                    <div className="sys-panel-badge" style={{ background: "rgba(79,195,247,0.5)" }} />
                    <span className="sys-panel-title">SYSTEM LOG</span>
                  </div>
                </div>
                {displayActivityLog.map((a, i) => (
                  <div key={i} className="sys-act-item">
                    <div className="sys-act-dot" style={{ background: a.color }} />
                    <div>
                      <div className="sys-act-txt">{a.text}</div>
                      <div className="sys-act-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ── BOTTOM BAR ──────────────────────────────────────── */}
          <div className="sys-bottom-bar" style={{ animation: "fade-in-up .4s .4s ease both" }}>
            <span>System v4.2.1 · All gates monitored</span>
            <span style={{ color: "rgba(79,230,160,0.5)" }}>⬡ Command center online</span>
            <span>Last sync: {new Date().toLocaleTimeString()}</span>
          </div>

        </div>
      </div>

      {isProjectModalOpen && (
        <CreateProjectModal
          onClose={() => setIsProjectModalOpen(false)}
        />
      )}
    </>
  );
}