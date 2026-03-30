// frontend/src/features/tasks/TasksPage.tsx
import { useState } from "react";
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
} from "lucide-react";
import { tasksData } from "../../pages/data";
import { useProjectStore } from "../../store/projectStore";
import { useTaskStore } from "../../store/taskStore";


export default function TasksPage() {
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask } = useTaskStore();
  const { projects } = useProjectStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "todo" | "inprogress" | "done">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high" | "urgent">("all");
  const [projectFilter, setProjectFilter] = useState<"all" | number>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
      high: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      medium: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      low: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      todo: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
      inprogress: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400",
      done: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
    };
    return colors[status as keyof typeof colors] || colors.todo;
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "todo": return <Clock size={14} />;
      case "inprogress": return <AlertCircle size={14} />;
      case "done": return <CheckCircle2 size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case "todo": return "To Do";
      case "inprogress": return "In Progress";
      case "done": return "Done";
      default: return status;
    }
  };

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || "Unknown Project";
  };

  // Filter tasks
  const filteredTasks = tasksData.filter(task => {
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

  const handleStatusChange = (taskId: number, newStatus: "todo" | "inprogress" | "done") => {
    updateTask(taskId, { status: newStatus });
    setMenuOpen(null);
  };

  const handlePriorityChange = (taskId: number, newPriority: "low" | "medium" | "high" | "urgent") => {
    updateTask(taskId, { priority: newPriority });
    setMenuOpen(null);
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId);
      setMenuOpen(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <button
          onClick={() => navigate("/tasks/new")}
          className="bg-black dark:bg-slate-800 text-white dark:text-slate-100 px-5 py-2.5 rounded-xl 
          hover:bg-gray-900 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-95 
          transition-all duration-200 font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{taskStats.total}</p>
            </div>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
              <Flag size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">To Do</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{taskStats.todo}</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Clock size={20} className="text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">In Progress</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{taskStats.inprogress}</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <AlertCircle size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Done</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{taskStats.done}</p>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
              <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 
              bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              text-gray-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Filter Toggle Button */}
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

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Status Filter */}
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
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Priority Filter */}
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

              {/* Project Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Project
                </label>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 
                  bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all") && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPriorityFilter("all");
                    setProjectFilter("all");
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

      {/* Tasks List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {filteredTasks.length > 0 ? (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => navigate(`/tasks/${task.id}`)}>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-medium text-gray-800 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-slate-100">
                        {task.title}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {getStatusText(task.status)}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-500 dark:text-slate-400 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Flag size={12} />
                        {getProjectName(task.projectId)}
                      </span>
                      
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      
                      {task.assignee && (
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {task.assignee.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu Button */}
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === task.id ? null : task.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <MoreHorizontal size={18} className="text-gray-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen === task.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20">
                          <div className="p-2">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 py-1">
                              Change Status
                            </p>
                            {(["todo", "inprogress", "done"] as const).map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(task.id, status)}
                                className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                              >
                                {getStatusIcon(status)}
                                {getStatusText(status)}
                              </button>
                            ))}
                            
                            <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
                            
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 py-1">
                              Change Priority
                            </p>
                            {(["low", "medium", "high", "urgent"] as const).map((priority) => (
                              <button
                                key={priority}
                                onClick={() => handlePriorityChange(task.id, priority)}
                                className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              >
                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                              </button>
                            ))}
                            
                            <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
                            
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="w-full text-left px-3 py-1.5 text-sm text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            >
                              Delete Task
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle2 size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No tasks found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first task"}
            </p>
            {(searchTerm || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all") ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setProjectFilter("all");
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                Clear all filters
              </button>
            ) : (
              <button
                onClick={() => navigate("/tasks/new")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                Create New Task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}