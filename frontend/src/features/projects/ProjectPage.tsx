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
  Flag,
  MoreHorizontal,
  X,
  ChevronDown,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { projectsData } from "../../pages/data";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, addProject, removeProject, updateProject, getProjectStats } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "planning" | "active" | "onHold" | "completed" | "archived">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high" | "urgent">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  // Initialize with sample data if no projects exist
  useEffect(() => {
    if (projects.length === 0) {
      projectsData.forEach(project => {
        addProject(project);
      });
    }
  }, []);

  const stats = getProjectStats();

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400",
      high: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400",
      medium: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
      low: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
      planning: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400",
      onHold: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
      completed: "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400",
      archived: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
    };
    return colors[status as keyof typeof colors] || colors.planning;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: <CheckCircle2 size={14} />,
      planning: <Clock size={14} />,
      onHold: <AlertCircle size={14} />,
      completed: <CheckCircle2 size={14} />,
      archived: <FolderOpen size={14} />,
    };
    return icons[status as keyof typeof icons] || <Clock size={14} />;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-slate-100 tracking-tight">
            Projects
          </h1>
          <p className="text-gray-400 dark:text-slate-500 mt-1">
            Manage and track all your projects
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-black dark:bg-slate-800 text-white dark:text-slate-100 px-5 py-2.5 rounded-xl 
          hover:bg-gray-900 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-95 
          transition-all duration-200 font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Projects</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
            </div>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
              <FolderOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Active Projects</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.active}</p>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
              <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Planning</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.planning}</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <Clock size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.completed}</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <CheckCircle2 size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects by name or description..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 
              bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              text-gray-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 
            hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Filter size={16} />
            <span>Filters</span>
            <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 
                  bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="onHold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 
                  bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
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
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 
            hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group"
          >
            {/* Progress Bar at top */}
            <div className={`h-1 w-full ${
              project.priority === 'urgent' ? 'bg-red-500' :
              project.priority === 'high' ? 'bg-orange-500' :
              project.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 
                  group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {project.name}
                </h3>
                
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === project.id ? null : project.id);
                    }}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <MoreHorizontal size={16} className="text-gray-400" />
                  </button>
                  
                  {menuOpen === project.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20">
                        <div className="p-1">
                          <button
                            onClick={() => handleStatusChange(project.id, "active")}
                            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            Set Active
                          </button>
                          <button
                            onClick={() => handleStatusChange(project.id, "completed")}
                            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            Mark Complete
                          </button>
                          <button
                            onClick={() => handleStatusChange(project.id, "onHold")}
                            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            Put on Hold
                          </button>
                          <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            Delete Project
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {project.description && (
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-3 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="flex gap-2 mb-3 flex-wrap">
                {project.status && (
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                )}
                {project.priority && (
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(project.priority)}`}>
                    {project.priority.toUpperCase()} Priority
                  </span>
                )}
              </div>

              {typeof project.progress === 'number' && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                {project.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                {project.teamMembers && project.teamMembers.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{project.teamMembers.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No projects found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by creating your first project"}
          </p>
          {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") ? (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              Clear all filters
            </button>
          ) : (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
              Create New Project
            </button>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCreateModal(false)} />
            
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create New Project</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 
                    bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    text-gray-900 dark:text-white"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Project description (optional)"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 
                    bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg
                  text-gray-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 
                  transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg 
                  font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}