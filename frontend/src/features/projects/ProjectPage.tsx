// frontend/src/features/projects/ProjectsPage.tsx
import { useProjectStore } from "../../store/projectStore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  MoreHorizontal,
  X,
  ChevronDown,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Flag,
  Target,
  Briefcase,
} from "lucide-react";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, loadProjects, addProject, removeProject, updateProject, getProjectStats } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "planning" | "active" | "onHold" | "completed" | "archived">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high" | "urgent">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  // Load projects from API-backed store.
  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const stats = getProjectStats();

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "text-red-400 border-red-500/40 bg-red-500/5 shadow-[0_0_8px_rgba(255,100,100,0.2)]",
      high: "text-amber-400 border-amber-500/40 bg-amber-500/5 shadow-[0_0_8px_rgba(255,180,70,0.2)]",
      medium: "text-sky-300 border-sky-400/40 bg-sky-400/5 shadow-[0_0_8px_rgba(79,195,247,0.2)]",
      low: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_8px_rgba(79,230,160,0.2)]",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
      planning: "text-sky-400 border-sky-400/30 bg-sky-400/5",
      onHold: "text-amber-400 border-amber-500/30 bg-amber-500/5",
      completed: "text-purple-400 border-purple-500/30 bg-purple-500/5",
      archived: "text-slate-500 border-slate-500/20 bg-transparent",
    };
    return colors[status as keyof typeof colors] || colors.planning;
  };

  const getRank = (priority: string): "S" | "A" | "B" | "C" | "D" => {
    return (
      ({ urgent: "S", high: "A", medium: "B", low: "C" } as Record<string, any>)[
        priority
      ] ?? "D"
    );
  };

  const getRankStyle = (rank: string) => {
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
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    addProject({
      name: newProjectName,
      description: newProjectDescription,
      status: "planning",
      priority: "medium",
      progress: 0,
      visibility: "private",
      requiresApproval: false,
      teamMembers: [],
      tags: [],
      goals: [],
    });
    
    setNewProjectName("");
    setNewProjectDescription("");
    setShowCreateModal(false);
  };

  const handleDeleteProject = (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      removeProject(id);
    }
    setMenuOpen(null);
  };

  const handleStatusChange = (id: number, status: "planning" | "active" | "onHold" | "completed" | "archived") => {
    updateProject(id, { status });
    setMenuOpen(null);
  };

  return (
    <div className="sys-projects-page min-h-screen bg-[#020c1a] font-['Rajdhani',sans-serif] text-[#e0f7fa] relative">
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
              GATE DIRECTORY
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-6 px-0.5">
          <div className="font-['Cinzel',serif] text-3xl font-black tracking-[3px] bg-gradient-to-r from-[#e0f7fa] to-[#4fc3f7] bg-clip-text text-transparent">
            GATE REGISTRY
          </div>
          <div className="text-[11px] tracking-[3px] uppercase text-[rgba(79,195,247,0.32)] mt-1">
            Hunter Operations · All Gates Monitored
          </div>
          <div className="h-px mt-3 bg-gradient-to-r from-[#4fc3f7] via-[rgba(79,195,247,0.1)] to-transparent" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Gates", value: stats.total, sub: "All registered gates", accent: "#4fc3f7", icon: "⬡", barWidth: Math.min((stats.total / 20) * 100, 100) },
            { label: "Active Gates", value: stats.active + stats.planning, sub: `${stats.active} in progress`, accent: "#4fc3f7", icon: "◈", barWidth: Math.min(((stats.active + stats.planning) / Math.max(stats.total, 1)) * 100, 100) },
            { label: "Cleared", value: stats.completed, sub: "Gates cleared", accent: "#4fe6a0", icon: "✦", barWidth: Math.min((stats.completed / Math.max(stats.total, 1)) * 100, 100) },
            { label: "On Hold", value: stats.onHold, sub: "Suspended operations", accent: "#ff6b6b", icon: "⚠", barWidth: Math.min((stats.onHold / Math.max(stats.total, 1)) * 100, 100) },
          ].map((card, idx) => (
            <div key={idx} className="relative bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 overflow-hidden hover:border-[rgba(79,195,247,0.45)] transition-colors duration-300 animate-[fade-in-up_0.5s_ease_both]" style={{ animationDelay: `${0.08 + idx * 0.04}s` }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }} />
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[rgba(79,195,247,0.3)]" />
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[rgba(79,195,247,0.3)]" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-[rgba(79,195,247,0.45)]">{card.label}</span>
                <span className="text-lg opacity-40">{card.icon}</span>
              </div>
              <div className="font-['Cinzel',serif] text-4xl font-black leading-none mb-1" style={{ color: card.accent, textShadow: `0 0 20px ${card.accent}66` }}>
                {card.value}
              </div>
              <div className="text-[11px] tracking-[1px] text-[rgba(79,195,247,0.35)] mt-1">{card.sub}</div>
              <div className="h-[2px] mt-3 bg-[rgba(79,195,247,0.06)] overflow-hidden">
                <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${card.barWidth}%`, background: card.accent, boxShadow: `0 0 6px ${card.accent}` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Main Panel */}
        <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] overflow-hidden animate-[fade-in-up_0.5s_ease_both]">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(79,195,247,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
              <span className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa]">GATE DATABASE</span>
              <span className="text-[10px] tracking-[2px] bg-[rgba(79,195,247,0.07)] border border-[rgba(79,195,247,0.2)] px-2 py-0.5 text-[rgba(79,195,247,0.55)]">
                {filteredProjects.length} GATES
              </span>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.4)] border border-[rgba(79,195,247,0.2)] px-3 py-1.5 hover:border-[#4fc3f7] hover:text-[#4fc3f7] transition-all duration-200">
              <Plus size={12} /> OPEN GATE
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-4 border-b border-[rgba(79,195,247,0.07)]">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(79,195,247,0.35)]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search gates by designation or coordinates..."
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                    >
                      <option value="all">All Gates</option>
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="onHold">On Hold</option>
                      <option value="completed">Cleared</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">Rank Priority</label>
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
                </div>
                {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setPriorityFilter("all");
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

          {/* Projects Grid */}
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project, idx) => {
                const rank = getRank(project.priority ?? "medium");
                const rankStyle = getRankStyle(rank);
                const progColor = (project.progress ?? 0) > 60 ? "#4fe6a0" : (project.progress ?? 0) > 30 ? "#ffb347" : "#ff6b6b";
                
                return (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="group relative bg-[rgba(4,18,38,0.7)] border border-[rgba(79,195,247,0.15)] hover:border-[rgba(79,195,247,0.4)] transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    {/* Hover corners */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[rgba(79,195,247,0.4)]" />
                      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[rgba(79,195,247,0.4)]" />
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[rgba(79,195,247,0.4)]" />
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[rgba(79,195,247,0.4)]" />
                    </div>

                    {/* Top accent line */}
                    <div className={`h-1 w-full ${project.priority === 'urgent' ? 'bg-red-500' : project.priority === 'high' ? 'bg-amber-500' : project.priority === 'medium' ? 'bg-sky-500' : 'bg-emerald-500'}`} />

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 flex items-center justify-center font-['Cinzel',serif] text-lg font-black border ${rankStyle.badge}`}>
                            {rank}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold tracking-wide text-[#e0f7fa] group-hover:text-[#4fc3f7] transition-colors line-clamp-1">
                              {project.name}
                            </h3>
                            {project.clientName && (
                              <p className="text-[10px] tracking-[1px] text-[rgba(79,195,247,0.35)] mt-0.5">
                                {project.clientName}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(menuOpen === project.id ? null : project.id);
                            }}
                            className="p-1.5 hover:bg-[rgba(79,195,247,0.1)] transition-colors"
                          >
                            <MoreHorizontal size={14} className="text-[rgba(79,195,247,0.5)]" />
                          </button>
                          
                          {menuOpen === project.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                              <div className="absolute right-0 mt-2 w-44 bg-[rgba(4,12,28,0.98)] border border-[rgba(79,195,247,0.2)] backdrop-blur-sm z-20">
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/projects/${project.id}/board`);
                                      setMenuOpen(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-xs tracking-[1px] hover:bg-[#4fc3f7]/10 text-[#4fc3f7] font-semibold flex items-center gap-2"
                                  >
                                    📊 View Board
                                  </button>
                                  <div className="border-t border-[rgba(79,195,247,0.1)] my-1" />
                                  <button
                                    onClick={() => handleStatusChange(project.id, "active")}
                                    className="w-full text-left px-4 py-2 text-xs tracking-[1px] hover:bg-[rgba(79,195,247,0.1)] text-[rgba(79,195,247,0.7)]"
                                  >
                                    Activate Gate
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(project.id, "completed")}
                                    className="w-full text-left px-4 py-2 text-xs tracking-[1px] hover:bg-[rgba(79,195,247,0.1)] text-[rgba(79,195,247,0.7)]"
                                  >
                                    Mark Cleared
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(project.id, "onHold")}
                                    className="w-full text-left px-4 py-2 text-xs tracking-[1px] hover:bg-[rgba(79,195,247,0.1)] text-[rgba(79,195,247,0.7)]"
                                  >
                                    Suspend Operation
                                  </button>
                                  <div className="border-t border-[rgba(79,195,247,0.1)] my-1" />
                                  <button
                                    onClick={() => handleDeleteProject(project.id)}
                                    className="w-full text-left px-4 py-2 text-xs tracking-[1px] text-red-400 hover:bg-[rgba(255,100,100,0.1)]"
                                  >
                                    Delete Gate
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {project.description && (
                        <p className="text-xs text-[rgba(79,195,247,0.5)] mb-3 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.status && (
                          <span className={`text-[9px] font-semibold tracking-[1.5px] uppercase px-2 py-0.5 border ${getStatusColor(project.status)}`}>
                            {project.status === "active" ? "ACTIVE" : 
                             project.status === "planning" ? "PLANNING" : 
                             project.status === "onHold" ? "ON HOLD" : 
                             project.status === "completed" ? "CLEARED" : "ARCHIVED"}
                          </span>
                        )}
                        <span className={`text-[9px] font-semibold tracking-[1.5px] uppercase px-2 py-0.5 border ${rankStyle.badge}`}>
                          {rank}-RANK GATE
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-[9px] tracking-[1px] text-[rgba(79,195,247,0.4)] mb-1">
                          <span>GATE STABILITY</span>
                          <span style={{ color: progColor }}>{project.progress ?? 0}%</span>
                        </div>
                        <div className="h-1 bg-[rgba(79,195,247,0.08)] overflow-hidden">
                          <div 
                            className="h-full transition-all duration-700 ease-out"
                            style={{ 
                              width: `${project.progress ?? 0}%`, 
                              background: `linear-gradient(90deg, rgba(79,195,247,0.5), ${progColor})`,
                              boxShadow: `0 0 4px ${progColor}`
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[10px] text-[rgba(79,195,247,0.4)]">
                        {project.dueDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={10} />
                            <span className="tracking-[1px]">Due {new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>
                        )}
                        {project.teamMembers && project.teamMembers.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Users size={10} />
                            <span className="tracking-[1px]">{project.teamMembers.length} Hunters</span>
                          </div>
                        )}
                        {project.estimatedHours && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={10} />
                            <span className="tracking-[1px]">{project.estimatedHours}h</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl opacity-20 mb-4">⬡</div>
                <h3 className="text-base font-['Cinzel',serif] tracking-[2px] text-[rgba(79,195,247,0.4)] mb-2">NO GATES FOUND</h3>
                <p className="text-xs tracking-[1.5px] text-[rgba(79,195,247,0.3)] mb-4">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                    ? "Adjust your filters to locate gates"
                    : "No gates registered in the system"}
                </p>
                {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") ? (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setPriorityFilter("all");
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
                    <Plus size={12} /> Register New Gate
                  </button>
                )}
              </div>
            )}
          </div>

          {/* View All Button */}
          {filteredProjects.length > 0 && (
            <button
              onClick={() => navigate("/projects")}
              className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-semibold tracking-[3px] uppercase text-[rgba(79,195,247,0.3)] border-t border-[rgba(79,195,247,0.08)] hover:text-[#4fc3f7] transition-colors"
            >
              VIEW ALL GATES <ArrowUpRight size={12} />
            </button>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between mt-4 px-4 py-2 bg-[rgba(4,12,28,0.85)] border border-[rgba(79,195,247,0.1)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.25)]">
          <span>Gate Registry v1.0 · All Gates Monitored</span>
          <span className="text-[rgba(79,230,160,0.5)]">⬡ Command Center Online</span>
          <span>Last Sync: Just Now</span>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-[rgba(4,18,38,0.98)] border border-[rgba(79,195,247,0.3)] w-full max-w-md p-6 shadow-2xl animate-[fade-in-up_0.3s_ease]">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
                <h3 className="font-['Cinzel',serif] text-lg font-bold tracking-[2px] text-[#e0f7fa]">REGISTER NEW GATE</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-[rgba(79,195,247,0.1)] transition-colors">
                <X size={18} className="text-[rgba(79,195,247,0.5)]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">Gate Designation *</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter gate name"
                  className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">Coordinates / Description</label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Gate details, threats, or objectives..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 border border-[rgba(79,195,247,0.2)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.5)] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="flex-1 px-4 py-2.5 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[10px] tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Register Gate
              </button>
            </div>

            {/* Modal corner accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[rgba(79,195,247,0.3)]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[rgba(79,195,247,0.3)]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[rgba(79,195,247,0.3)]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[rgba(79,195,247,0.3)]" />
          </div>
        </div>
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
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.2); }
      `}</style>
    </div>
  );
}