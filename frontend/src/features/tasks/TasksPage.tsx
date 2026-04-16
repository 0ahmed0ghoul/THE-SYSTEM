// frontend/src/features/tasks/TasksPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Flag,
  User,
  MoreHorizontal,
  X,
  ChevronDown,
  ArrowUpRight,
  Target,
  Zap,
} from "lucide-react";
import { useProjectStore } from "../../store/projectStore";
import { useTaskStore } from "../../store/taskStore";

// ── Rank assignment helpers ──────────────────────────────────────────────────
function getTaskRank(priority: string): "S" | "A" | "B" | "C" | "D" {
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

function taskStatusStyle(status: string) {
  return (
    {
      todo: { 
        cls: "text-sky-400 border-sky-400/50 bg-sky-400/8 shadow-[0_0_12px_rgba(79,195,247,0.3)]", 
        label: "STANDBY", 
        icon: <Clock size={12} /> 
      },
      inprogress: { 
        cls: "text-amber-300 border-amber-400/60 bg-amber-400/12 shadow-[0_0_12px_rgba(255,180,70,0.4)]", 
        label: "IN PROGRESS", 
        icon: <AlertCircle size={12} /> 
      },
      done: { 
        cls: "text-emerald-400 border-emerald-500/60 bg-emerald-500/12 shadow-[0_0_12px_rgba(79,230,160,0.4)]", 
        label: "COMPLETE", 
        icon: <CheckCircle2 size={12} /> 
      },
    }[status] ?? { cls: "text-sky-400/50 border-sky-400/20", label: status.toUpperCase(), icon: <Clock size={12} /> }
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

export default function TasksPage() {
  const navigate = useNavigate();
  const { tasks, loadTasks, updateTask, deleteTask, addTask } = useTaskStore();
  const { projects, loadProjects } = useProjectStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "todo" | "inprogress" | "done">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high" | "urgent">("all");
  const [projectFilter, setProjectFilter] = useState<"all" | number>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProjectId, setNewTaskProjectId] = useState<number | "">(projects[0]?.id ?? "");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  useEffect(() => {
    void loadProjects();
    void loadTasks();
  }, [loadProjects, loadTasks]);

  useEffect(() => {
    if (projects.length > 0 && newTaskProjectId === "") {
      setNewTaskProjectId(projects[0].id);
    }
  }, [projects, newTaskProjectId]);

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || "Unknown Gate";
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesProject = projectFilter === "all" || task.projectId === projectFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    inprogress: tasks.filter(t => t.status === "inprogress").length,
    done: tasks.filter(t => t.status === "done").length,
  };

  const urgentCount = tasks.filter(t => t.priority === "urgent" && t.status !== "done").length;

  const handleStatusChange = (taskId: number, newStatus: "todo" | "inprogress" | "done") => {
    updateTask(taskId, { status: newStatus });
    setMenuOpen(null);
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this quest?")) {
      deleteTask(taskId);
      setMenuOpen(null);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim() || !newTaskProjectId) {
      alert("Please enter a quest title and select a gate");
      return;
    }

    try {
      await addTask({
        title: newTaskTitle,
        projectId: newTaskProjectId as number,
        dueDate: newTaskDueDate || undefined,
        status: "todo",
        priority: "medium",
      });
      
      setNewTaskTitle("");
      setNewTaskProjectId(projects[0]?.id ?? "");
      setNewTaskDueDate("");
      setShowCreateModal(false);
    } catch (error: any) {
      console.error("Full error:", error);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("Token:", localStorage.getItem("auth_token"));
      alert(`Failed to create quest: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="sys-tasks-page min-h-screen bg-[#020c1a] font-['Rajdhani',sans-serif] text-[#e0f7fa] relative">
      {/* Background Layers */}
      <div className="fixed inset-0 bg-[radial-gradient(circle,rgba(79,195,247,0.055)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0" />
      <div className="fixed w-[900px] h-[900px] top-[-300px] left-[-250px] bg-[radial-gradient(circle,rgba(2,80,160,0.13)_0%,transparent_70%)] rounded-full pointer-events-none z-0 blur-[20px]" />
      <div className="fixed w-[600px] h-[600px] bottom-[-200px] right-[-100px] bg-[radial-gradient(circle,rgba(79,195,247,0.07)_0%,transparent_70%)] rounded-full pointer-events-none z-0 blur-[20px]" />
      <div className="fixed inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(79,195,247,0.012)_2px,rgba(79,195,247,0.012)_4px)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[rgba(4,12,28,0.92)] border border-[rgba(79,195,247,0.2)] mb-6 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[rgba(79,195,247,0.4)] flex items-center justify-center font-['Cinzel',serif] text-sm font-bold text-[#4fc3f7] relative">
              S
              <div className="absolute inset-[-4px] border border-[rgba(79,195,247,0.13)]" />
            </div>
            <span className="font-['Cinzel',serif] text-base font-bold tracking-[3px] text-[#e0f7fa]">THE SYSTEM</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.35)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4fe6a0] animate-[dot-pulse_2s_ease-in-out_infinite]" />
              Command Active
            </div>
            <div className="font-['Cinzel',serif] text-[11px] font-bold tracking-[3px] text-[#ffd54f] border border-[rgba(255,213,79,0.35)] px-3 py-0.5">
              QUEST BOARD
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-6 px-0.5">
          <div className="font-['Cinzel',serif] text-3xl font-black tracking-[3px] bg-gradient-to-r from-[#e0f7fa] to-[#4fc3f7] bg-clip-text text-transparent">
            QUEST BOARD
          </div>
          <div className="text-[11px] tracking-[3px] uppercase text-[rgba(79,195,247,0.32)] mt-1">
            Hunter Operations · Active Quests Monitor
          </div>
          <div className="h-px mt-3 bg-gradient-to-r from-[#4fc3f7] via-[rgba(79,195,247,0.1)] to-transparent" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Total Quests"
            value={taskStats.total}
            sub="All registered quests"
            accent="#4fc3f7"
            icon="⬡"
            barWidth={Math.min((taskStats.total / 30) * 100, 100)}
            delay="0.08s"
          />
          <StatCard
            label="Active Quests"
            value={taskStats.todo + taskStats.inprogress}
            sub={`${taskStats.inprogress} in progress`}
            accent="#ffd54f"
            icon="◈"
            barWidth={Math.min(((taskStats.todo + taskStats.inprogress) / Math.max(taskStats.total, 1)) * 100, 100)}
            delay="0.12s"
          />
          <StatCard
            label="Completed"
            value={taskStats.done}
            sub="Quests cleared"
            accent="#4fe6a0"
            icon="✦"
            barWidth={Math.min((taskStats.done / Math.max(taskStats.total, 1)) * 100, 100)}
            delay="0.16s"
          />
          <StatCard
            label="Critical"
            value={urgentCount}
            sub="S-Rank priority"
            accent="#ff6b6b"
            icon="⚠"
            barWidth={Math.min((urgentCount / Math.max(taskStats.total, 1)) * 100, 100)}
            delay="0.2s"
          />
        </div>

        {/* Main Panel */}
        <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] overflow-hidden animate-[fade-in-up_0.5s_ease_both]">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(79,195,247,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-[#ffd54f] shadow-[0_0_6px_#ffd54f]" />
              <span className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa]">QUEST DATABASE</span>
              <span className="text-[10px] tracking-[2px] bg-[rgba(79,195,247,0.07)] border border-[rgba(79,195,247,0.2)] px-2 py-0.5 text-[rgba(79,195,247,0.55)]">
                {filteredTasks.length} QUESTS
              </span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[2px] uppercase text-[#4fc3f7] border border-[#4fc3f7]/60 bg-[#4fc3f7]/8 px-3 py-1.5 hover:bg-[#4fc3f7]/15 hover:border-[#4fc3f7] hover:shadow-[0_0_12px_#4fc3f78a] transition-all duration-200"
            >
              <Plus size={12} /> ADD QUEST
            </button>
          </div>

          {/* Urgent Alert */}
          {urgentCount > 0 && (
            <div className="flex items-center gap-3 px-5 py-2.5 bg-[rgba(255,107,107,0.04)] border-l-2 border-[rgba(255,107,107,0.6)]">
              <AlertCircle size={13} style={{ color: "#ff6b6b", flexShrink: 0 }} />
              <span className="font-['Cinzel',serif] text-[10px] font-bold tracking-[1px] text-red-400 border border-red-500/40 px-2 py-0.5 animate-[alert-pulse_2s_ease-in-out_infinite]">
                S-RANK
              </span>
              <span className="text-[11px] tracking-[1.5px] uppercase text-[rgba(255,107,107,0.65)]">
                {urgentCount} critical quest{urgentCount > 1 ? "s" : ""} requiring immediate action
              </span>
            </div>
          )}

          {/* Search and Filters */}
          <div className="p-4 border-b border-[rgba(79,195,247,0.07)]">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(79,195,247,0.35)]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search quests by title or description..."
                  className="w-full pl-9 pr-4 py-2 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-[rgba(79,195,247,0.2)] hover:border-[rgba(79,195,247,0.5)] transition-colors text-xs tracking-[1.5px] uppercase text-[rgba(79,195,247,0.5)]"
              >
                <Filter size={14} /> Filters
                <ChevronDown size={12} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-[rgba(79,195,247,0.1)]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="todo">Standby</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Complete</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">Rank</label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                    >
                      <option value="all">All Ranks</option>
                      <option value="urgent">S-Rank</option>
                      <option value="high">A-Rank</option>
                      <option value="medium">B-Rank</option>
                      <option value="low">C-Rank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">Gate</label>
                    <select
                      value={projectFilter}
                      onChange={(e) => setProjectFilter(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                    >
                      <option value="all">All Gates</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {(searchTerm || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all") && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setPriorityFilter("all");
                        setProjectFilter("all");
                      }}
                      className="text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:text-[#4fc3f7]"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tasks List */}
          <div className="max-h-[600px] overflow-y-auto">
            {filteredTasks.length > 0 ? (
              <div className="divide-y divide-[rgba(79,195,247,0.07)]">
                {filteredTasks.map((task) => {
                  const rank = getTaskRank(task.priority ?? "medium");
                  const rankStyle = getRankStyle(rank);
                  const statusStyle = taskStatusStyle(task.status);
                  
                  return (
                    <div
                      key={task.id}
                      className="group relative p-5 hover:bg-[rgba(79,195,247,0.04)] transition-all duration-200 cursor-pointer"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      {/* Hover corners */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[rgba(79,195,247,0.4)]" />
                        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[rgba(79,195,247,0.4)]" />
                        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[rgba(79,195,247,0.4)]" />
                        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[rgba(79,195,247,0.4)]" />
                      </div>

                      <div className="flex items-start gap-4">
                        {/* Rank Badge */}
                        <div className={`w-10 h-10 flex items-center justify-center font-['Cinzel',serif] text-lg font-black border flex-shrink-0 ${rankStyle.badge}`}>
                          {rank}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-base font-semibold tracking-wide text-[#e0f7fa] group-hover:text-[#4fc3f7] transition-colors">
                              {task.title}
                            </h3>
                            <span className={`text-[9px] font-semibold tracking-[1.5px] uppercase px-2.5 py-1 border flex items-center gap-1.5 rounded-sm transition-all ${statusStyle.cls}`}>
                              {statusStyle.icon}
                              {statusStyle.label}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-xs text-[rgba(79,195,247,0.5)] mb-3 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-[10px] tracking-[1px] text-[rgba(79,195,247,0.4)]">
                            <span className="flex items-center gap-1.5">
                              <Flag size={10} />
                              {getProjectName(task.projectId)}
                            </span>
                            
                            {task.dueDate && (
                              <span className="flex items-center gap-1.5">
                                <Calendar size={10} />
                                Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                            
                            {task.assignee && (
                              <span className="flex items-center gap-1.5">
                                <User size={10} />
                                {task.assignee.name}
                              </span>
                            )}

                            <span className={`text-[9px] font-semibold tracking-[1.5px] uppercase ${rankStyle.text}`}>
                              {rank}-Rank Quest
                            </span>
                          </div>
                        </div>

                        {/* Menu Button */}
                        <div className="relative flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(menuOpen === task.id ? null : task.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-[rgba(79,195,247,0.1)] transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal size={14} className="text-[rgba(79,195,247,0.5)]" />
                          </button>

                          {menuOpen === task.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                              <div className="absolute right-0 mt-2 w-44 bg-[rgba(4,12,28,0.98)] border border-[#4fc3f7]/40 backdrop-blur-sm z-20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                                <div className="py-1">
                                  <p className="text-[9px] font-semibold tracking-[1.5px] text-[#4fc3f7] px-3 py-2 uppercase border-b border-[#4fc3f7]/20">
                                    Update Status
                                  </p>
                                  {(["todo", "inprogress", "done"] as const).map((status) => {
                                    const sStyle = taskStatusStyle(status);
                                    return (
                                      <button
                                        key={status}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStatusChange(task.id, status);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs tracking-[1px] hover:bg-[${status === 'done' ? '#4fe6a0' : status === 'inprogress' ? '#ffb347' : '#4fc3f7'}/10] text-[#e0f7fa] flex items-center gap-2 transition-all border-l-2 ${status === 'done' ? 'border-emerald-500' : status === 'inprogress' ? 'border-amber-400' : 'border-sky-400'}`}
                                      >
                                        {sStyle.icon}
                                        <span className="font-semibold">{sStyle.label}</span>
                                      </button>
                                    );
                                  })}
                                  <div className="border-t border-[#4fc3f7]/20 my-1" />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTask(task.id);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs tracking-[1px] text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all flex items-center gap-2"
                                  >
                                    <X size={12} />
                                    Delete Quest
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl opacity-20 mb-4">✦</div>
                <h3 className="text-base font-['Cinzel',serif] tracking-[2px] text-[rgba(79,195,247,0.4)] mb-2">NO QUESTS FOUND</h3>
                <p className="text-xs tracking-[1.5px] text-[rgba(79,195,247,0.3)] mb-4">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all"
                    ? "Adjust your filters to locate quests"
                    : "Quest board is clear. Ready for new assignments."}
                </p>
                {(searchTerm || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all") ? (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setPriorityFilter("all");
                      setProjectFilter("all");
                    }}
                    className="text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:text-[#4fc3f7]"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] border border-[rgba(79,195,247,0.3)] px-4 py-2 hover:border-[#4fc3f7] hover:text-[#4fc3f7] transition-all"
                  >
                    <Plus size={12} /> Register New Quest
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between mt-4 px-4 py-2 bg-[rgba(4,12,28,0.85)] border border-[rgba(79,195,247,0.1)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.25)]">
          <span>Quest Board v1.0 · All Quests Monitored</span>
          <span className="text-[rgba(79,230,160,0.5)]">⬡ Command Center Online</span>
          <span>Last Sync: Just Now</span>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[rgba(4,18,38,0.98)] border border-[#4fc3f7]/40 backdrop-blur-sm relative overflow-hidden">
              {/* Accent lines */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent" />
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#4fc3f7]/20 relative">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-[#4fc3f7] to-[#ffd54f] shadow-[0_0_8px_#4fc3f7]" />
                  <h3 className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa]">
                    REGISTER QUEST
                  </h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 hover:bg-[#4fc3f7]/10 transition-colors rounded hover:text-[#4fc3f7]"
                >
                  <X size={16} className="text-[rgba(79,195,247,0.6)]" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-5 bg-[rgba(4,18,38,0.5)]">
                {/* Quest Title */}
                <div>
                  <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[#4fc3f7] mb-2.5">
                    Quest Title *
                  </label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter quest title..."
                    className="w-full px-3 py-2.5 bg-[rgba(4,12,28,0.8)] border border-[#4fc3f7]/30 focus:border-[#4fc3f7] focus:outline-none focus:shadow-[0_0_12px_#4fc3f730] text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)] transition-all"
                  />
                </div>

                {/* Gate Selection */}
                <div>
                  <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[#4fc3f7] mb-2.5">
                    Gate (Project) *
                  </label>
                  <select
                    value={newTaskProjectId}
                    onChange={(e) => setNewTaskProjectId(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 bg-[rgba(4,12,28,0.8)] border border-[#4fc3f7]/30 focus:border-[#4fc3f7] focus:outline-none focus:shadow-[0_0_12px_#4fc3f730] text-[#e0f7fa] text-sm transition-all"
                  >
                    <option value="">Select a gate...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {projects.length === 0 && (
                    <p className="text-[10px] text-amber-400 mt-2 flex items-center gap-1">
                      <AlertCircle size={10} /> No gates available. Create a project first.
                    </p>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[#4fc3f7] mb-2.5">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[rgba(4,12,28,0.8)] border border-[#4fc3f7]/30 focus:border-[#4fc3f7] focus:outline-none focus:shadow-[0_0_12px_#4fc3f730] text-[#e0f7fa] text-sm transition-all"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 px-5 py-4 border-t border-[#4fc3f7]/20 bg-[rgba(4,12,28,0.7)]">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-3 py-2.5 bg-[rgba(79,195,247,0.05)] border border-[#4fc3f7]/40 hover:bg-[#4fc3f7]/10 hover:border-[#4fc3f7]/60 text-[10px] font-semibold tracking-[1.5px] uppercase text-[#4fc3f7] transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleCreateTask}
                  disabled={!newTaskTitle.trim() || !newTaskProjectId}
                  className="flex-1 px-3 py-2.5 bg-gradient-to-r from-[#4fc3f7]/20 to-[#4fc3f7]/10 border border-[#4fc3f7] hover:from-[#4fc3f7]/30 hover:to-[#4fc3f7]/20 hover:shadow-[0_0_12px_#4fc3f78a] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none text-[10px] font-semibold tracking-[1.5px] uppercase text-[#4fc3f7] transition-all"
                >
                  REGISTER QUEST
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px #4fe6a0; }
          50% { opacity: 0.4; box-shadow: none; }
        }
        @keyframes alert-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.2); }
      `}</style>
    </div>
  );
}