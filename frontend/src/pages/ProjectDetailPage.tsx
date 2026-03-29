// frontend/src/features/projects/ProjectDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import { useTaskStore } from "../store/taskStore";
import { useState } from "react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderOpen,
  X,
} from "lucide-react";
import BoardPage from "../features/board/BoardPage";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(id!);
  
  const { getProjectById, updateProject } = useProjectStore();
  const { getProjectTasks } = useTaskStore();
  
  const project = getProjectById(projectId);
  const tasks = getProjectTasks(projectId);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project?.name || "");
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

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "done").length,
    inProgress: tasks.filter(t => t.status === "inprogress").length,
    todo: tasks.filter(t => t.status === "todo").length,
    highPriority: tasks.filter(t => t.priority === "high").length,
  };

  const completionRate = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0;

  const handleUpdateProject = () => {
    if (editName.trim() && editName !== project.name) {
      updateProject(projectId, editName);
    }
    setIsEditing(false);
  };

//   const handleDeleteProject = () => {
//     deleteProject(projectId);
//     navigate("/projects");
//   };

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
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdateProject()}
                  autoFocus
                  className="text-2xl font-bold px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleUpdateProject}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(project.name);
                  }}
                  className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {project.name}
                </h1>
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
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Created on {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <p className="text-xs text-slate-500 dark:text-slate-400">Todo</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{taskStats.todo}</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
              <Clock size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">High Priority</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{taskStats.highPriority}</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

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
      <div className="min-h-125">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Project Description */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">About this project</h3>
              <p className="text-slate-600 dark:text-slate-400">
                This is a sample project description. You can add more details about the project here,
                including goals, milestones, and key deliverables.
              </p>
            </div>

            {/* Team Members */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Team Members</h3>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
                  + Add Member
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 font-semibold">
                  JD
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 font-semibold">
                  SC
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 font-semibold">
                  MJ
                </div>
                <button className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-indigo-400 transition-colors">
                  <Plus size={16} className="text-slate-400" />
                </button>
              </div>
            </div>

            {/* Recent Tasks */}
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
                  onClick={() => {}}
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