// frontend/src/features/projects/ProjectDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";
import { useTaskStore } from "../../store/taskStore";
import { useState } from "react";
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
} from "lucide-react";
import BoardPage from "../board/BoardPage";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(id!);
  
  const { getProjectById, updateProject } = useProjectStore();
  const { getProjectTasks } = useTaskStore();
  
  const project = getProjectById(projectId);
  const tasks = getProjectTasks(projectId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);
  const [activeTab, setActiveTab] = useState<"overview" | "board" | "activities">("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!project) {
    return (
      <div className="text-center py-12">
        <FolderOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Project not found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-4">The project you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/projects")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400",
      high: "bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400",
      medium: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400",
      low: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400",
      planning: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400",
      onHold: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400",
      completed: "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400",
      archived: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
    };
    return colors[status as keyof typeof colors] || colors.planning;
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "done").length,
    inProgress: tasks.filter(t => t.status === "inprogress").length,
    todo: tasks.filter(t => t.status === "todo").length,
    highPriority: tasks.filter(t => t.priority === "high").length,
  };

  const completionRate = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : (project.progress || 0);

  const handleUpdateProject = () => {
    if (editedProject && editedProject.name !== project.name) {
      updateProject(projectId, { name: editedProject.name });
    }
    setIsEditing(false);
  };

  const handleDeleteProject = () => {
    deleteProject(projectId);
    navigate("/projects");
  };

  const calculateDaysLeft = (dueDate?: string) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(project.dueDate);
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isDueSoon = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/projects")}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedProject?.name || ""}
                  onChange={(e) => setEditedProject({ ...editedProject!, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdateProject()}
                  autoFocus
                  className="text-2xl font-bold px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleUpdateProject}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm flex items-center gap-1"
                >
                  <Save size={14} /> Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProject(project);
                  }}
                  className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {project.name}
                </h1>
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 size={16} className="text-slate-400" />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Status and Priority Badges */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {project.status && (
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              )}
              {project.priority && (
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(project.priority)}`}>
                  {project.priority.toUpperCase()} Priority
                </span>
              )}
              {project.category && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300">
                  {project.category}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Created on {new Date(project.startDate || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid - Enhanced with more project metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{taskStats.total}</p>
            </div>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
              <CheckCircle2 size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{taskStats.completed}</p>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
              <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">In Progress</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{taskStats.inProgress}</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <Clock size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Team Size</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{project.teamMembers?.length || 0}</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <Users size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Project Progress and Timeline */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progress Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Overall Progress</h3>
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          
          {/* Additional Progress Info */}
          {(project.estimatedHours || project.budget) && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-4">
                {project.estimatedHours && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Estimated Hours</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{project.estimatedHours}h</p>
                  </div>
                )}
                {project.budget && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Budget</p>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      ${project.budget.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Timeline Section */}
        {project.dueDate && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              Timeline
            </h3>
            <div className="space-y-3">
              {project.startDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Start Date</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">Due Date</span>
                <span className={`text-sm font-medium ${
                  isOverdue ? 'text-red-600 dark:text-red-400' :
                  isDueSoon ? 'text-amber-600 dark:text-amber-400' :
                  'text-slate-900 dark:text-slate-100'
                }`}>
                  {new Date(project.dueDate).toLocaleDateString()}
                  {daysLeft && (
                    <span className="ml-2 text-xs">
                      ({isOverdue ? `Overdue by ${Math.abs(daysLeft)} days` : 
                        isDueSoon ? `${daysLeft} days left` : 
                        `${daysLeft} days remaining`})
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === "overview"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Overview
            {activeTab === "overview" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("board")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === "board"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Board
            {activeTab === "board" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("activities")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === "activities"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Activities
            {activeTab === "activities" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Project Description */}
            {project.description && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">About this project</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* Client Information */}
            {(project.clientName || project.projectLead) && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Briefcase size={18} className="text-indigo-600" />
                  Client Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.clientName && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Client Name</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{project.clientName}</p>
                    </div>
                  )}
                  {project.projectLead && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Project Lead</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{project.projectLead}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Goals/Milestones */}
            {project.goals && project.goals.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Target size={18} className="text-indigo-600" />
                  Goals & Milestones
                </h3>
                <div className="space-y-3">
                  {project.goals.map((goal, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <CheckCircle2 size={18} className="text-indigo-600 dark:text-indigo-400 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members */}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Users size={18} className="text-indigo-600" />
                    Team Members
                  </h3>
                  <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
                    <Plus size={14} /> Add Member
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.teamMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                        {typeof member === 'string' ? member[0] : member.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {typeof member === 'string' ? member : member.name}
                        </p>
                        {typeof member !== 'string' && member.role && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Tag size={18} className="text-indigo-600" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Visibility Settings */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Eye size={18} className="text-indigo-600" />
                Visibility & Settings
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {project.visibility === 'private' && '🔒 Private - Only you can access this project'}
                  {project.visibility === 'team' && '👥 Team - All team members can access this project'}
                  {project.visibility === 'public' && '🌍 Public - Anyone can view this project'}
                </p>
                {project.requiresApproval && (
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm text-amber-600 dark:text-amber-400">Requires approval for changes</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Tasks Preview */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Recent Tasks</h3>
                <button 
                  onClick={() => setActiveTab("board")}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Status: {task.status === "inprogress" ? "In Progress" : task.status}
                      </p>
                    </div>
                    {task.priority === "high" && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-950/30 text-red-600 text-xs rounded">High</span>
                    )}
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-4">No tasks yet. Create your first task!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "board" && (
          <BoardPage projectId={projectId} />
        )}

        {activeTab === "activities" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="space-y-4">
              {[
                { action: "Task completed", task: "API Integration", user: "Alex", time: "2 hours ago" },
                { action: "New task added", task: "Update Documentation", user: "Sarah", time: "5 hours ago" },
                { action: "Project updated", task: "Project renamed", user: "Marcus", time: "1 day ago" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 text-xs font-bold">
                    {activity.user[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                      <span className="font-medium">"{activity.task}"</span>
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteModal(false)} />
            
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Delete Project</h3>
                <button onClick={() => setShowDeleteModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete "{project.name}"? This action cannot be undone and all tasks will be lost.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function deleteProject(projectId: number) {
  throw new Error("Function not implemented.");
}
