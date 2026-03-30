import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tasksData } from "./data";
import {
  FolderOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  Users,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import CreateProjectModal from "../features/projects/components/CreateProjectModal";
import { useProjectStore, type Project } from "../store/projectStore";


export default function Dashboard() {
  const navigate = useNavigate();
  const [upcomingTasks] = useState(tasksData);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // Get projects and methods from store
  const { projects, addProject, getProjectStats } = useProjectStore();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  
  // Get project stats
  const stats = getProjectStats();
  
  // Filter active projects for display
  useEffect(() => {
    const activeProjects = projects.filter(p => p.status === "active" || p.status === "planning");
    setRecentProjects(activeProjects.slice(0, 5)); // Show only first 5 active projects
  }, [projects]);

  const handleAddProject = async (projectData: Partial<Project>) => {
    // Add project to store
    addProject({
      name: projectData.name!,
      description: projectData.description || "",
      startDate: projectData.startDate,
      dueDate: projectData.dueDate,
      priority: projectData.priority || "medium",
      status: projectData.status || "planning",
      category: projectData.category,
      progress: projectData.progress || 0,
      estimatedHours: projectData.estimatedHours,
      budget: projectData.budget,
      projectLead: projectData.projectLead,
      clientName: projectData.clientName,
      teamMembers: projectData.teamMembers || [],
      tags: projectData.tags || [],
      goals: projectData.goals || [],
      visibility: projectData.visibility || "private",
      requiresApproval: projectData.requiresApproval || false,
    });
    
    setIsProjectModalOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    return (
      {
        high: "text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-800",
        medium:
          "text-amber-500 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800",
        low: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800",
        urgent: "text-purple-500 bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800",
      }[priority] ||
      "text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  const getStatusColor = (status: string) => {
    return (
      {
        active:
          "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
        planning:
          "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
        onHold:
          "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
        completed:
          "bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
        archived:
          "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
        pending:
          "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
      }[status] ||
      "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">


          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="bg-black dark:bg-slate-800 text-white dark:text-slate-100 px-5 py-2.5 rounded-xl 
            hover:bg-gray-900 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-95 
            transition-all duration-200 font-medium flex items-center gap-2 shadow-sm dark:shadow-slate-800/50"
          >
            <FolderOpen size={18} />
            New Project
          </button>
        </div>

        {/* STATS - Now using real data from store */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              title: "Total Projects",
              value: stats.total,
              sub: `+${stats.active} active`,
              icon: <FolderOpen size={18} />,
            },
            {
              title: "Completed Projects",
              value: stats.completed,
              sub: "projects done",
              icon: <CheckCircle2 size={18} />,
            },
            {
              title: "Planning",
              value: stats.planning,
              sub: "in planning phase",
              icon: <Clock size={18} />,
            },
            {
              title: "On Hold",
              value: stats.onHold,
              sub: "waiting",
              icon: <Clock size={18} />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 
              hover:shadow-lg dark:hover:shadow-slate-800/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-600 dark:text-gray-400">
                  {item.icon}
                </div>
                <TrendingUp
                  size={16}
                  className="text-green-500 dark:text-green-400"
                />
              </div>

              <p className="text-gray-400 dark:text-slate-500 text-sm">
                {item.title}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-gray-800 dark:text-slate-100">
                  {item.value}
                </span>
                <span className="text-xs text-gray-400 dark:text-slate-500">
                  {item.sub}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PROJECTS */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 dark:text-slate-100">
                Active Projects
              </h2>
              <button 
                onClick={() => navigate("/projects")}
                className="text-sm text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
              >
                View All <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-200 hover:pl-8 cursor-pointer group"
                  >
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-gray-800 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-slate-100">
                        {project.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Open project options menu
                          console.log("Open menu for project:", project.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal
                          size={18}
                          className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                        />
                      </button>
                    </div>

                    {/* Project Description if available */}
                    {project.description && (
                      <p className="text-sm text-gray-500 dark:text-slate-400 mb-2 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    <div className="flex gap-2 text-xs mb-2 flex-wrap">
                      {project.status && (
                        <span
                          className={`px-2 py-1 rounded-full ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      )}
                      
                      {project.priority && (
                        <span
                          className={`px-2 py-1 rounded-full ${getPriorityColor(
                            project.priority
                          )}`}
                        >
                          {project.priority} priority
                        </span>
                      )}

                      {project.dueDate && (
                        <span className="text-gray-400 dark:text-slate-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(project.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {typeof project.progress === 'number' && (
                      <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-black dark:bg-slate-600 h-full rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    )}

                    {/* Team Members Preview */}
                    {project.teamMembers && project.teamMembers.length > 0 && (
                      <div className="flex -space-x-2 mt-3">
                        {project.teamMembers.slice(0, 3).map((member, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 
                            border-2 border-white dark:border-slate-900 flex items-center justify-center
                            text-indigo-600 dark:text-indigo-400 text-xs font-medium"
                            title={typeof member === 'string' ? member : member.name}
                          >
                            {typeof member === 'string' ? member[0] : member.name[0]}
                          </div>
                        ))}
                        {project.teamMembers.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 
                            border-2 border-white dark:border-slate-900 flex items-center justify-center
                            text-gray-600 dark:text-slate-300 text-xs font-medium">
                            +{project.teamMembers.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <FolderOpen size={48} className="mx-auto text-gray-300 dark:text-slate-700 mb-3" />
                  <p className="text-gray-500 dark:text-slate-400">No active projects</p>
                  <button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                  >
                    Create your first project →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* TASKS */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 dark:text-slate-100">
                Upcoming Tasks
              </h2>
              <button 
                onClick={() => navigate("/tasks")}
                className="text-sm text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
              >
                View All <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="p-5 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-slate-100">
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
                        {task.projectName}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-3 text-xs text-gray-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                    </span>
                    <span>•</span>
                    <span>2 days left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE PROJECT MODAL */}
      {isProjectModalOpen && (
        <CreateProjectModal
          onClose={() => setIsProjectModalOpen(false)}
        />
      )}
    </div>
  );
}