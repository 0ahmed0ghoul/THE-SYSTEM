// frontend/src/pages/ProjectsPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  MoreHorizontal, 
  Users, 
  Calendar, 
  Search,
  Filter,
  ChevronDown
} from "lucide-react";
import type { Project } from "../../store/projectStore";
import { projectsApi } from "../../api/projects.api";


// Rank assignment helpers (same as before)
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

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats from fetched projects
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "active").length,
    planning: projects.filter(p => p.status === "planning").length,
    completed: projects.filter(p => p.status === "completed").length,
    onHold: projects.filter(p => p.status === "onHold").length,
    archived: projects.filter(p => p.status === "archived").length,
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectsApi.getAll(); // Adjust based on your API
      setProjects(response);
    } catch (err: any) {
      console.error('Failed to fetch projects:', err);
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleOpenGate = () => {
    navigate('/projects/add');
  };

  if (loading) {
    return (
      <div className="sys-dashboard flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-[#4fc3f7] mb-4 font-[Rajdhani] tracking-wider">Loading gates...</div>
          <div className="w-8 h-8 border-2 border-[#4fc3f7] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sys-dashboard flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-400 mb-4 font-[Rajdhani] tracking-wider">Error loading gates</div>
          <div className="text-[rgba(79,195,247,0.5)] text-sm">{error}</div>
          <button 
            onClick={() => fetchProjects()}
            className="mt-4 px-4 py-2 border border-[rgba(79,195,247,0.3)] text-[#4fc3f7] text-sm hover:bg-[rgba(79,195,247,0.1)] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sys-dashboard">
      {/* Background Effects */}
      <div className="sys-bg-grid" />
      <div className="sys-bg-orb1" />
      <div className="sys-bg-orb2" />
      <div className="sys-scanlines" />
      <div className="sys-content">
        {/* Stats Cards */}
        <div className="sys-stats-grid" style={{ animation: "fade-in-up .4s .12s ease both" }}>
          <div className="relative bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #4fc3f7, transparent)" }} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-[rgba(79,195,247,0.45)]">TOTAL GATES</span>
              <span className="text-lg opacity-40">⬡</span>
            </div>
            <div className="font-['Cinzel',serif] text-4xl font-black leading-none mb-1 text-[#4fc3f7]">{stats.total}</div>
            <div className="text-[11px] tracking-[1px] text-[rgba(79,195,247,0.35)]">Registered gates</div>
          </div>

          <div className="relative bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #4fe6a0, transparent)" }} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-[rgba(79,195,247,0.45)]">ACTIVE</span>
              <span className="text-lg opacity-40">✦</span>
            </div>
            <div className="font-['Cinzel',serif] text-4xl font-black leading-none mb-1 text-[#4fe6a0]">{stats.active}</div>
            <div className="text-[11px] tracking-[1px] text-[rgba(79,195,247,0.35)]">Currently active</div>
          </div>

          <div className="relative bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #ffd54f, transparent)" }} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-[rgba(79,195,247,0.45)]">PLANNING</span>
              <span className="text-lg opacity-40">◈</span>
            </div>
            <div className="font-['Cinzel',serif] text-4xl font-black leading-none mb-1 text-[#ffd54f]">{stats.planning}</div>
            <div className="text-[11px] tracking-[1px] text-[rgba(79,195,247,0.35)]">In planning phase</div>
          </div>

          <div className="relative bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #ff6b6b, transparent)" }} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-[rgba(79,195,247,0.45)]">COMPLETED</span>
              <span className="text-lg opacity-40">✓</span>
            </div>
            <div className="font-['Cinzel',serif] text-4xl font-black leading-none mb-1 text-[#4fe6a0]">{stats.completed}</div>
            <div className="text-[11px] tracking-[1px] text-[rgba(79,195,247,0.35)]">Cleared gates</div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="sys-panel" style={{ animation: "fade-in-up .4s .18s ease both" }}>
          <div className="sys-panel-head">
            <div className="sys-panel-head-left">
              <div className="sys-panel-badge" style={{ background: "#4fc3f7", boxShadow: "0 0 6px #4fc3f7" }} />
              <span className="sys-panel-title">GATE MANIFEST</span>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgba(79,195,247,0.3)]" />
                <input
                  type="text"
                  placeholder="Search gates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-xs w-48"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-1.5 border border-[rgba(79,195,247,0.2)] text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.5)] transition-all flex items-center gap-2"
              >
                <Filter size={12} />
                Filters
                <ChevronDown size={10} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={handleOpenGate}
                className="px-3 py-1.5 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[10px] font-semibold tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all flex items-center gap-2"
              >
                <Plus size={12} />
                New Gate
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-b border-[rgba(79,195,247,0.15)] px-6 py-4 flex gap-4">
              <div className="flex-1">
                <label className="block text-[9px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-1">
                  STATUS
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-xs"
                >
                  <option value="all">All Status</option>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="onHold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-[9px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-1">
                  PRIORITY
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-xs"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">C-Rank (Low)</option>
                  <option value="medium">B-Rank (Medium)</option>
                  <option value="high">A-Rank (High)</option>
                  <option value="urgent">S-Rank (Urgent)</option>
                </select>
              </div>
              {(statusFilter !== "all" || priorityFilter !== "all") && (
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setPriorityFilter("all");
                  }}
                  className="px-3 py-2 text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:text-[#4fc3f7] transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Projects List */}
          <div className="sys-proj-list">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const rank = getProjectRank(project.priority);
                const rs = getRankStyle(rank);
                const prog = project.progress ?? 0;
                const progColor = prog > 60 ? "#4fe6a0" : prog > 30 ? "#ffd54f" : "#ff6b6b";

                return (
                  <div
                    key={project.id}
                    className="sys-proj-row cursor-pointer"
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
                        <div className="sys-pr-desc line-clamp-2">{project.description}</div>
                      )}

                      <div className="sys-pr-meta">
                        {project.dueDate && (
                          <span className="sys-pr-meta-item">
                            <Calendar size={10} />
                            Due: {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        )}
                        {project.teamMembers && project.teamMembers.length > 0 && (
                          <span className="sys-pr-meta-item">
                            <Users size={10} />
                            {typeof project.teamMembers[0] === 'string' 
                              ? `${project.teamMembers.length} hunters`
                              : `${project.teamMembers.length} members`}
                          </span>
                        )}
                        <span className={`sys-pr-meta-item font-semibold ${rs.text}`}>
                          {rank}-Rank Gate
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 transition-all"
                        >
                          <MoreHorizontal size={14} style={{ color: "rgba(79,195,247,0.35)" }} />
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="sys-pr-prog-label">
                          <span>STABILITY</span>
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
                <div className="text-[11px] text-[rgba(79,195,247,0.3)] mt-2">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "Create your first gate to get started"}
                </div>
                <button
                  className="sys-empty-link mt-4"
                  onClick={handleOpenGate}
                >
                  Open first gate →
                </button>
              </div>
            )}
          </div>

          {filteredProjects.length > 0 && (
            <div className="border-t border-[rgba(79,195,247,0.15)] px-6 py-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] tracking-[2px] text-[rgba(79,195,247,0.3)]">
                  Showing {filteredProjects.length} of {stats.total} gates
                </span>
                <button
                  onClick={handleOpenGate}
                  className="sys-add-gate"
                >
                  ⊕ REGISTER NEW GATE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="sys-bottom-bar" style={{ animation: "fade-in-up .4s .24s ease both" }}>
          <span>System v4.2.1 · Gate Registry</span>
          <span style={{ color: "rgba(79,230,160,0.5)" }}>⬡ {stats.total} gates monitored</span>
          <span>Last sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}