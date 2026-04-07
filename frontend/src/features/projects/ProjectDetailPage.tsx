// frontend/src/features/projects/ProjectDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useTaskStore } from "../../store/taskStore";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
  FolderOpen,
  X,
  Calendar,
  Users,
  Tag,
  Target,
  Eye,
  Briefcase,
  Save,
  AlertTriangle,
  ArrowUpRight,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import BoardPage from "../board/BoardPage";
import { projectsApi } from "../../api/projects.api";
import type { Project } from "../../store/projectStore";

// ── Rank assignment helpers (matching dashboard) ──────────────────────────────
function getProjectRank(priority: string = "medium"): "S" | "A" | "B" | "C" | "D" {
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

function getStatusTag(status: string = "planning") {
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

function statusLabel(status: string = "planning") {
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

// ── Stat Card Component (matching dashboard) ─────────────────────────────────
function DetailStatCard({
  label,
  value,
  sub,
  accent,
  icon,
  delay,
}: {
  label: string;
  value: number;
  sub: string;
  accent: string;
  icon: string;
  delay: string;
}) {
  const count = useCountUp(value);
  return (
    <div
      className="relative bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 overflow-hidden
                 hover:border-[rgba(79,195,247,0.45)] transition-colors duration-300"
      style={{ animationDelay: delay, animation: "fade-in-up 0.5s ease both" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
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
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(id!);
  
  const { getProjectTasks } = useTaskStore();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "board" | "activities">("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);

  // Fetch project data
  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const projectData = await projectsApi.getById(projectId);
      setProject(projectData);
      setEditedProject(projectData);
      
      const projectTasks = getProjectTasks(projectId);
      setTasks(projectTasks);
      
    } catch (err: any) {
      console.error('Failed to fetch project:', err);
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const handleUpdateProject = async () => {
    if (!editedProject || !project) return;
    
    try {
      const updatedProject = await projectsApi.update(projectId, {
        name: editedProject.name,
        description: editedProject.description,
        status: editedProject.status,
        priority: editedProject.priority,
        dueDate: editedProject.dueDate,
        startDate: editedProject.startDate,
        category: editedProject.category,
        progress: editedProject.progress,
        estimatedHours: editedProject.estimatedHours,
        budget: editedProject.budget,
        projectLead: editedProject.projectLead,
        clientName: editedProject.clientName,
        visibility: editedProject.visibility,
        requiresApproval: editedProject.requiresApproval,
        teamMembers: editedProject.teamMembers,
        tags: editedProject.tags,
        goals: editedProject.goals,
      });
      
      setProject(updatedProject);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Failed to update project:', err);
      alert('Failed to update project: ' + err.message);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await projectsApi.delete(projectId);
      navigate("/projects");
    } catch (err: any) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project: ' + err.message);
    }
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "done").length,
    inProgress: tasks.filter(t => t.status === "inprogress").length,
    todo: tasks.filter(t => t.status === "todo").length,
    review: tasks.filter(t => t.status === "review").length,
    highPriority: tasks.filter(t => t.priority === "high" || t.priority === "urgent").length,
  };

  const completionRate = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : (project?.progress || 0);

  const calculateDaysLeft = (dueDate?: string) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(project?.dueDate);
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isDueSoon = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

  if (loading) {
    return (
      <div className="sys-dashboard flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-[#4fc3f7] mb-4 font-[Rajdhani] tracking-wider">Loading gate data...</div>
          <div className="w-8 h-8 border-2 border-[#4fc3f7] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="sys-dashboard flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FolderOpen size={48} className="mx-auto text-[rgba(79,195,247,0.3)] mb-4" />
          <h2 className="text-xl font-semibold text-[#e0f7fa] mb-2 font-[Cinzel,serif]">Gate Not Found</h2>
          <p className="text-[rgba(79,195,247,0.5)] text-sm mb-4">
            {error || "The gate you're looking for doesn't exist or has been decommissioned."}
          </p>
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-2 border border-[rgba(79,195,247,0.3)] text-[#4fc3f7] text-sm hover:bg-[rgba(79,195,247,0.1)] transition-colors"
          >
            RETURN TO GATE MANIFEST
          </button>
        </div>
      </div>
    );
  }

  const rank = getProjectRank(project.priority);
  const rs = getRankStyle(rank);

  return (
    <div className="sys-dashboard">
      <div className="sys-bg-grid" />
      <div className="sys-bg-orb1" />
      <div className="sys-bg-orb2" />
      <div className="sys-scanlines" />

      <div className="sys-content">
        {/* Header with breadcrumb */}
        <div className="flex items-center justify-between mb-6" style={{ animation: "fade-in-up 0.4s ease both" }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/projects")}
              className="p-2 rounded-lg hover:bg-[rgba(79,195,247,0.1)] transition-colors border border-[rgba(79,195,247,0.2)]"
            >
              <ArrowLeft size={18} className="text-[#4fc3f7]" />
            </button>
            
            <div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedProject?.name || ""}
                    onChange={(e) => setEditedProject({ ...editedProject!, name: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdateProject()}
                    autoFocus
                    className="text-2xl font-bold px-3 py-1 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.3)] rounded-lg focus:outline-none focus:border-[#4fc3f7] text-[#e0f7fa] font-[Cinzel,serif]"
                  />
                  <button
                    onClick={handleUpdateProject}
                    className="px-3 py-1 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[#4fc3f7] rounded-lg text-xs font-semibold tracking-wider flex items-center gap-1"
                  >
                    <Save size={12} /> SAVE
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedProject(project);
                    }}
                    className="px-3 py-1 border border-[rgba(79,195,247,0.3)] text-[rgba(79,195,247,0.5)] rounded-lg text-xs font-semibold tracking-wider"
                  >
                    CANCEL
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className={`sys-rank-box ${rs.badge} text-sm px-3 py-1`}>{rank}</div>
                  <h1 className="text-2xl font-bold text-[#e0f7fa] font-[Cinzel,serif] tracking-wide">
                    {project.name}
                  </h1>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded-lg hover:bg-[rgba(79,195,247,0.1)] transition-colors"
                    >
                      <Edit2 size={14} className="text-[rgba(79,195,247,0.5)]" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 mt-2 flex-wrap">
                {project.status && (
                  <span className={`text-[10px] px-2 py-1 rounded-full border ${getStatusTag(project.status)} font-semibold tracking-wider`}>
                    {statusLabel(project.status)}
                  </span>
                )}
                {project.category && (
                  <span className="text-[10px] px-2 py-1 rounded-full border border-[rgba(79,195,247,0.2)] bg-[rgba(79,195,247,0.05)] text-[rgba(79,195,247,0.6)] font-semibold tracking-wider">
                    {project.category}
                  </span>
                )}
                <span className="text-[10px] text-[rgba(79,195,247,0.35)] tracking-wider">
                  GATE ID: {project.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Matching dashboard style */}
        <div className="sys-stats-grid">
          <DetailStatCard
            label="Total Quests"
            value={taskStats.total}
            sub="Active missions"
            accent="#4fc3f7"
            icon="⬡"
            delay="0.08s"
          />
          <DetailStatCard
            label="Completed"
            value={taskStats.completed}
            sub="Missions cleared"
            accent="#4fe6a0"
            icon="✦"
            delay="0.12s"
          />
          <DetailStatCard
            label="In Progress"
            value={taskStats.inProgress}
            sub="Active operations"
            accent="#ffd54f"
            icon="◈"
            delay="0.16s"
          />
          <DetailStatCard
            label="Team Size"
            value={project.teamMembers?.length || 0}
            sub="Hunters assigned"
            accent="#ff6b6b"
            icon="👥"
            delay="0.2s"
          />
        </div>

        {/* Main Content Grid */}
        <div className="sys-content-grid">
          {/* Left Panel - Overview or Board */}
          <div className="sys-panel" style={{ animation: "fade-in-up .4s .22s ease both" }}>
            <div className="sys-panel-head">
              <div className="sys-panel-head-left">
                <div className="sys-panel-badge" style={{ background: "var(--sys-blue)", boxShadow: "0 0 6px var(--sys-blue)" }} />
                <button
                  onClick={() => setActiveTab("overview")}
                  className="sys-tab"
                  style={activeTab === "overview" ? { color: "#e0f7fa", fontFamily: "'Cinzel', serif", fontSize: "13px", letterSpacing: "2px", fontWeight: "700" } : { opacity: 0.4 }}
                >
                  GATE OVERVIEW
                </button>
                <span style={{ color: "rgba(79,195,247,0.2)", fontSize: 12 }}>|</span>
                <button
                  onClick={() => setActiveTab("board")}
                  className="sys-tab"
                  style={activeTab === "board" ? { color: "#e0f7fa", fontFamily: "'Cinzel', serif", fontSize: "13px", letterSpacing: "2px", fontWeight: "700" } : { opacity: 0.4 }}
                >
                  QUEST BOARD
                </button>
                <span className="sys-panel-count">
                  {activeTab === "overview" ? "GATE DETAILS" : `${taskStats.total} QUESTS`}
                </span>
              </div>
              {activeTab === "board" && (
                <button className="sys-new-btn" onClick={() => {/* Open create task modal */}}>
                  <Plus size={12} />
                  ADD QUEST
                </button>
              )}
            </div>

            {/* Urgent Alert */}
            {taskStats.highPriority > 0 && activeTab === "overview" && (
              <div className="sys-gate-alert">
                <AlertTriangle size={13} style={{ color: "var(--sys-red)", flexShrink: 0 }} />
                <span className="sys-alert-tag">HIGH PRIORITY</span>
                <span className="sys-alert-txt">
                  {taskStats.highPriority} high-risk quest{taskStats.highPriority > 1 ? "s" : ""} requiring immediate attention
                </span>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                {/* Description */}
                {project.description && (
                  <div className="p-4 border border-[rgba(79,195,247,0.15)] rounded-lg bg-[rgba(4,18,38,0.5)]">
                    <h3 className="text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      GATE DESCRIPTION
                    </h3>
                    <p className="text-sm text-[rgba(79,195,247,0.7)] leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                )}

                {/* Progress Section */}
                <div className="p-4 border border-[rgba(79,195,247,0.15)] rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)]">
                      GATE STABILITY
                    </span>
                    <span className="text-sm font-bold" style={{ color: completionRate > 60 ? "#4fe6a0" : completionRate > 30 ? "#ffd54f" : "#ff6b6b" }}>
                      {completionRate}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[rgba(79,195,247,0.06)] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${completionRate}%`,
                        background: `linear-gradient(90deg, rgba(79,195,247,0.3), ${completionRate > 60 ? "#4fe6a0" : completionRate > 30 ? "#ffd54f" : "#ff6b6b"})`,
                        boxShadow: `0 0 6px ${completionRate > 60 ? "#4fe6a0" : completionRate > 30 ? "#ffd54f" : "#ff6b6b"}`
                      }}
                    />
                  </div>
                  
                  {(project.estimatedHours || project.budget) && (
                    <div className="mt-4 pt-3 border-t border-[rgba(79,195,247,0.1)] grid grid-cols-2 gap-4">
                      {project.estimatedHours && (
                        <div>
                          <p className="text-[9px] tracking-[2px] text-[rgba(79,195,247,0.35)]">EST. HOURS</p>
                          <p className="text-lg font-bold text-[#e0f7fa] font-[Cinzel,serif]">{project.estimatedHours}h</p>
                        </div>
                      )}
                      {project.budget && (
                        <div>
                          <p className="text-[9px] tracking-[2px] text-[rgba(79,195,247,0.35)]">BUDGET</p>
                          <p className="text-lg font-bold text-emerald-400 font-[Cinzel,serif]">${project.budget.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Timeline */}
                {project.dueDate && (
                  <div className="p-4 border border-[rgba(79,195,247,0.15)] rounded-lg">
                    <h3 className="text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-3 flex items-center gap-2">
                      <Calendar size={12} /> TIMELINE
                    </h3>
                    <div className="space-y-2">
                      {project.startDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[rgba(79,195,247,0.5)]">Operation Start</span>
                          <span className="text-xs font-mono text-[rgba(79,195,247,0.7)]">
                            {new Date(project.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[rgba(79,195,247,0.5)]">Deadline</span>
                        <span className={`text-xs font-mono font-semibold ${
                          isOverdue ? 'text-red-400' : isDueSoon ? 'text-amber-400' : 'text-[rgba(79,195,247,0.7)]'
                        }`}>
                          {new Date(project.dueDate).toLocaleDateString()}
                          {daysLeft && (
                            <span className="ml-2 text-[10px]">
                              ({isOverdue ? `OVERDUE by ${Math.abs(daysLeft)}d` : isDueSoon ? `${daysLeft}d left` : `${daysLeft}d remaining`})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Client Info */}
                {(project.clientName || project.projectLead) && (
                  <div className="p-4 border border-[rgba(79,195,247,0.15)] rounded-lg">
                    <h3 className="text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-3 flex items-center gap-2">
                      <Briefcase size={12} /> CLIENT INTELLIGENCE
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {project.clientName && (
                        <div>
                          <p className="text-[9px] tracking-[2px] text-[rgba(79,195,247,0.35)]">CLIENT</p>
                          <p className="text-sm text-[rgba(79,195,247,0.7)]">{project.clientName}</p>
                        </div>
                      )}
                      {project.projectLead && (
                        <div>
                          <p className="text-[9px] tracking-[2px] text-[rgba(79,195,247,0.35)]">GATE LEAD</p>
                          <p className="text-sm text-[rgba(79,195,247,0.7)]">{project.projectLead}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Team Members */}
                {project.teamMembers && project.teamMembers.length > 0 && (
                  <div className="p-4 border border-[rgba(79,195,247,0.15)] rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] flex items-center gap-2">
                        <Users size={12} /> HUNTER SQUAD
                      </h3>
                      <button className="text-[10px] text-[rgba(79,195,247,0.5)] hover:text-[#4fc3f7] transition-colors flex items-center gap-1">
                        <UserPlus size={10} /> ASSIGN
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.teamMembers.map((member, idx) => {
                        const memberName = typeof member === 'string' ? member : member.name;
                        const memberRole = typeof member === 'string' ? undefined : member.role;
                        return (
                          <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.15)] rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#4fe6a0] flex items-center justify-center text-[10px] font-bold text-[#0a0a0a]">
                              {memberName[0]}
                            </div>
                            <div>
                              <p className="text-xs text-[#e0f7fa]">{memberName}</p>
                              {memberRole && <p className="text-[9px] text-[rgba(79,195,247,0.5)]">{memberRole}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Goals */}
                {project.goals && project.goals.length > 0 && (
                  <div className="p-4 border border-[rgba(79,195,247,0.15)] rounded-lg">
                    <h3 className="text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-3 flex items-center gap-2">
                      <Target size={12} /> OBJECTIVES
                    </h3>
                    <div className="space-y-2">
                      {project.goals.map((goal, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 bg-[rgba(79,195,247,0.03)] rounded-lg">
                          <CheckCircle2 size={12} className="text-[rgba(79,195,247,0.3)] mt-0.5" />
                          <span className="text-xs text-[rgba(79,195,247,0.7)]">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="p-4 border border-[rgba(79,195,247,0.15)] rounded-lg">
                    <h3 className="text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2 flex items-center gap-2">
                      <Tag size={12} /> CLASSIFICATION TAGS
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="text-[9px] px-2 py-1 border border-[rgba(79,195,247,0.2)] rounded-full text-[rgba(79,195,247,0.5)]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visibility */}
                <div className="p-4 border border-[rgba(79,195,247,0.15)] rounded-lg">
                  <h3 className="text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2 flex items-center gap-2">
                    <Eye size={12} /> CLEARANCE LEVEL
                  </h3>
                  <p className="text-xs text-[rgba(79,195,247,0.7)]">
                    {project.visibility === 'private' && '🔒 CLASSIFIED - Restricted access'}
                    {project.visibility === 'team' && '👥 TEAM - Squad access only'}
                    {project.visibility === 'public' && '🌍 PUBLIC - Unrestricted access'}
                  </p>
                  {project.requiresApproval && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[rgba(79,195,247,0.1)]">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      <span className="text-[10px] text-amber-400">Requires approval for modifications</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "board" && (
              <BoardPage projectId={projectId} />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-3">
            {/* Quest Progress */}
            <div className="sys-panel" style={{ animation: "fade-in-up .4s .28s ease both" }}>
              <div className="sys-panel-head">
                <div className="sys-panel-head-left">
                  <div className="sys-panel-badge" style={{ background: "var(--sys-green)", boxShadow: "0 0 6px var(--sys-green)" }} />
                  <span className="sys-panel-title">QUEST METRICS</span>
                </div>
              </div>
              <div className="sys-mini-stats">
                {[
                  { val: `${taskStats.completed}/${taskStats.total}`, label: "Completed", color: "var(--sys-blue)" },
                  { val: `${taskStats.inProgress}`, label: "Active", color: "var(--sys-green)" },
                  { val: `${taskStats.review || 0}`, label: "Review", color: "var(--sys-gold)" },
                  { val: `${taskStats.highPriority}`, label: "Critical", color: "var(--sys-red)" },
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

            {/* Recent Quests Preview */}
            {tasks.length > 0 && (
              <div className="sys-panel" style={{ animation: "fade-in-up .4s .32s ease both" }}>
                <div className="sys-panel-head">
                  <div className="sys-panel-head-left">
                    <div className="sys-panel-badge" style={{ background: "var(--sys-gold)", boxShadow: "0 0 6px var(--sys-gold)" }} />
                    <span className="sys-panel-title">RECENT QUESTS</span>
                  </div>
                  <button className="text-[10px] text-[rgba(79,195,247,0.5)]" onClick={() => setActiveTab("board")}>
                    VIEW ALL <ArrowUpRight size={10} />
                  </button>
                </div>
                {tasks.slice(0, 4).map((task) => {
                  const taskRank = getProjectRank(task.priority);
                  const taskRs = getRankStyle(taskRank);
                  return (
                    <div
                      key={task.id}
                      className="sys-quest-item cursor-pointer"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      <div className="flex items-start gap-2 mb-1">
                        <span className={`font-[Cinzel,serif] text-[11px] font-bold ${taskRs.text}`}>
                          {taskRank}
                        </span>
                        <span className="sys-quest-title text-xs">{task.title}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[rgba(79,195,247,0.4)]">
                        <span className="flex items-center gap-1">
                          <Clock size={8} />
                          {task.status === "inprogress" ? "In Progress" : task.status === "review" ? "Review" : "Pending"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Activity Log */}
            <div className="sys-panel" style={{ animation: "fade-in-up .4s .36s ease both" }}>
              <div className="sys-panel-head">
                <div className="sys-panel-head-left">
                  <div className="sys-panel-badge" style={{ background: "rgba(79,195,247,0.5)" }} />
                  <span className="sys-panel-title">OPERATION LOG</span>
                </div>
              </div>
              {activities.length > 0 ? (
                activities.slice(0, 4).map((activity, i) => (
                  <div key={i} className="sys-act-item">
                    <div className="sys-act-dot" style={{ background: "var(--sys-blue)" }} />
                    <div>
                      <div className="sys-act-txt text-xs">{activity.description}</div>
                      <div className="sys-act-time text-[10px]">{new Date(activity.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <div className="text-[rgba(79,195,247,0.3)] text-xs">No recent activities</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="sys-bottom-bar" style={{ animation: "fade-in-up .4s .4s ease both" }}>
          <span>System v4.2.1 · Gate {project.id} monitored</span>
          <span style={{ color: "rgba(79,230,160,0.5)" }}>⬡ {rank}-Rank Gate</span>
          <span>Last sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-70" onClick={() => setShowDeleteModal(false)} />
            
            <div className="relative bg-[rgba(4,18,38,0.98)] border border-[rgba(79,195,247,0.3)] rounded-lg max-w-md w-full p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#e0f7fa] font-[Cinzel,serif]">Terminate Gate?</h3>
                <button onClick={() => setShowDeleteModal(false)} className="p-1 rounded-lg hover:bg-[rgba(79,195,247,0.1)]">
                  <X size={18} className="text-[rgba(79,195,247,0.5)]" />
                </button>
              </div>

              <div className="flex items-start gap-3 mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-400">
                  WARNING: This action is irreversible. All quest data will be lost.
                </p>
              </div>

              <p className="text-sm text-[rgba(79,195,247,0.6)] mb-6">
                Are you sure you want to terminate gate <span className="text-[#e0f7fa] font-semibold">"{project.name}"</span>?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-[rgba(79,195,247,0.3)] text-[rgba(79,195,247,0.7)] text-sm hover:bg-[rgba(79,195,247,0.05)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="flex-1 px-4 py-2 bg-red-600/20 border border-red-500 text-red-400 text-sm hover:bg-red-600/30 transition-colors"
                >
                  Terminate Gate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}