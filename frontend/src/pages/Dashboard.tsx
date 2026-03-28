import { useState } from "react";
import {
  FolderOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  Users,
  ArrowUpRight,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  const [stats] = useState({
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    totalTasks: 156,
    completedTasks: 98,
    pendingTasks: 58,
    completionRate: 62.8,
    upcomingDeadlines: 5,
    teamMembers: 3,
  });

  const [recentProjects] = useState([
    { id: 1, name: "E-commerce Platform", progress: 75, status: "active", deadline: "2026-04-15" },
    { id: 2, name: "Mobile App Redesign", progress: 45, status: "active", deadline: "2026-04-20" },
    { id: 3, name: "API Integration", progress: 90, status: "active", deadline: "2026-04-10" },
    { id: 4, name: "Documentation", progress: 30, status: "pending", deadline: "2026-04-25" },
  ]);

  const [upcomingTasks] = useState([
    { id: 1, title: "Review pull requests", project: "E-commerce Platform", priority: "high", dueDate: "2026-03-28" },
    { id: 2, title: "Design system updates", project: "Mobile App Redesign", priority: "medium", dueDate: "2026-03-29" },
    { id: 3, title: "Database optimization", project: "API Integration", priority: "high", dueDate: "2026-03-30" },
    { id: 4, title: "User testing session", project: "E-commerce Platform", priority: "low", dueDate: "2026-04-01" },
  ]);

  const getPriorityColor = (priority: string) => {
    return {
      high: "text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-800",
      medium: "text-amber-500 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800",
      low: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800",
    }[priority] || "text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400";
  };

  const getStatusColor = (status: string) => {
    return {
      active: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
      pending: "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
    }[status] || "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-slate-100 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-400 dark:text-slate-500 mt-1">
              Manage your projects and tasks
            </p>
          </div>

          <button className="bg-black dark:bg-slate-800 text-white dark:text-slate-100 px-5 py-2.5 rounded-xl 
            hover:bg-gray-900 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-95 
            transition-all duration-200 font-medium flex items-center gap-2 shadow-sm dark:shadow-slate-800/50">
            <FolderOpen size={18} />
            New Project
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[{
            title: "Total Projects",
            value: stats.totalProjects,
            sub: `+${stats.activeProjects} active`,
            icon: <FolderOpen size={18} />,
          },
          {
            title: "Completed Tasks",
            value: stats.completedTasks,
            sub: `/ ${stats.totalTasks}`,
            icon: <CheckCircle2 size={18} />,
          },
          {
            title: "Pending Tasks",
            value: stats.pendingTasks,
            sub: "needs attention",
            icon: <Clock size={18} />,
          },
          {
            title: "Team Members",
            value: stats.teamMembers,
            sub: "members",
            icon: <Users size={18} />,
          }].map((item, i) => (
            <div key={i} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 
              hover:shadow-lg dark:hover:shadow-slate-800/50 hover:-translate-y-1 transition-all duration-300">
              
              <div className="flex justify-between items-center mb-3">
                <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-600 dark:text-gray-400">
                  {item.icon}
                </div>
                <TrendingUp size={16} className="text-green-500 dark:text-green-400" />
              </div>

              <p className="text-gray-400 dark:text-slate-500 text-sm">{item.title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-gray-800 dark:text-slate-100">{item.value}</span>
                <span className="text-xs text-gray-400 dark:text-slate-500">{item.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* PROJECTS */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 dark:text-slate-100">Active Projects</h2>
              <button className="text-sm text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-slate-300 flex items-center gap-1 transition-colors">
                View All <ArrowUpRight size={14} />
              </button>
            </div>

            {recentProjects.map((project) => (
              <div key={project.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-200 hover:pl-8 cursor-pointer group">

                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-gray-800 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-slate-100">
                    {project.name}
                  </h3>
                  <MoreHorizontal size={18} className="text-gray-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex gap-2 text-xs mb-2">
                  <span className={`px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="text-gray-400 dark:text-slate-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-black dark:bg-slate-600 h-full rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* TASKS */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 dark:text-slate-100">Upcoming Tasks</h2>
              <button className="text-sm text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-slate-300 flex items-center gap-1 transition-colors">
                View All <ArrowUpRight size={14} />
              </button>
            </div>

            {upcomingTasks.map((task) => (
              <div key={task.id}
                className="p-5 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group">

                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-slate-100">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-slate-500">{task.project}</p>
                  </div>

                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="flex gap-3 mt-2 text-xs text-gray-400 dark:text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(task.dueDate).toLocaleDateString()}
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
  );
}