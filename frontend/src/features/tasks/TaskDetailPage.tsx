// frontend/src/features/tasks/TaskDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Tag,
  Flag,
  Paperclip,
  MessageSquare,
  X,
  Save,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTaskStore } from "../../store/taskStore";
import { useProjectStore } from "../../store/projectStore";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const taskId = parseInt(id!);
  
  const { getTaskById, updateTask, deleteTask, addComment, toggleSubtask } = useTaskStore();
  const { projects } = useProjectStore();
  
  const task = getTaskById(taskId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [showAttachments, setShowAttachments] = useState(true);
  const [showComments, setShowComments] = useState(true);

  if (!task) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Task not found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-4">The task you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/tasks")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
      high: "bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      medium: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      low: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      todo: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
      inprogress: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400",
      done: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400",
    };
    return colors[status as keyof typeof colors] || colors.todo;
  };

  const handleUpdateTask = () => {
    if (editedTask && editedTask.title !== task.title) {
      updateTask(taskId, { title: editedTask.title });
    }
    setIsEditing(false);
  };

  const handleStatusChange = (status: "todo" | "inprogress" | "done") => {
    updateTask(taskId, { status });
  };

  const handlePriorityChange = (priority: "low" | "medium" | "high" | "urgent") => {
    updateTask(taskId, { priority });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(taskId, {
        id: Date.now(),
        taskId,
        userId: 1,
        userName: "Current User",
        content: newComment,
        createdAt: new Date().toISOString(),
      });
      setNewComment("");
    }
  };

  const handleToggleSubtask = (subtaskId: number) => {
    toggleSubtask(taskId, subtaskId);
  };

  const handleDeleteTask = () => {
    deleteTask(taskId);
    navigate("/tasks");
  };

  const getProjectName = () => {
    const project = projects.find(p => p.id === task.projectId);
    return project?.name || "Unknown Project";
  };

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/tasks")}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedTask?.title || ""}
                  onChange={(e) => setEditedTask({ ...editedTask!, title: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdateTask()}
                  autoFocus
                  className="text-2xl font-bold px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleUpdateTask}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm flex items-center gap-1"
                >
                  <Save size={14} /> Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedTask(task);
                  }}
                  className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {task.title}
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
            
            {/* Task Metadata */}
            <div className="flex gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Project:</span>
                <button
                  onClick={() => navigate(`/projects/${task.projectId}`)}
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {getProjectName()}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Created:</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status and Priority Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Status
          </label>
          <div className="flex gap-2">
            {(["todo", "inprogress", "done"] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  task.status === status
                    ? getStatusColor(status) + " ring-2 ring-offset-2 ring-indigo-500"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {status === "todo" && "To Do"}
                {status === "inprogress" && "In Progress"}
                {status === "done" && "Done"}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Priority
          </label>
          <div className="flex gap-2">
            {(["low", "medium", "high", "urgent"] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => handlePriorityChange(priority)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  task.priority === priority
                    ? getPriorityColor(priority)
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Task Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Description</h3>
            {task.description ? (
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {task.description}
              </p>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 italic">No description provided.</p>
            )}
          </div>

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                  </h3>
                </div>
                {showSubtasks ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {showSubtasks && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-3">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleSubtask(subtask.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          subtask.completed
                            ? "bg-indigo-600 border-indigo-600"
                            : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
                        }`}
                      >
                        {subtask.completed && <CheckCircle2 size={12} className="text-white" />}
                      </button>
                      <span className={`text-sm flex-1 ${
                        subtask.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-300"
                      }`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowAttachments(!showAttachments)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Paperclip size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Attachments ({task.attachments.length})
                  </h3>
                </div>
                {showAttachments ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {showAttachments && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                  <div className="space-y-2">
                    {task.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Paperclip size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{attachment.name}</span>
                        </div>
                        <span className="text-xs text-slate-400">{attachment.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comments */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setShowComments(!showComments)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Comments ({task.comments?.length || 0})
                </h3>
              </div>
              {showComments ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {showComments && (
              <div className="border-t border-slate-200 dark:border-slate-800">
                {/* Add Comment */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 text-xs font-bold">
                      CU
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {task.comments && task.comments.length > 0 ? (
                    task.comments.map((comment) => (
                      <div key={comment.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 text-xs font-bold">
                            {comment.userName[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {comment.userName}
                              </span>
                              <span className="text-xs text-slate-400">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <MessageSquare size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">No comments yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Task Info */}
        <div className="space-y-4">
          {/* Due Date */}
          {task.dueDate && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Due Date</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {new Date(task.dueDate).toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          )}

          {/* Assignee */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Assignee</h3>
            </div>
            {task.assignee ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                  {task.assignee.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{task.assignee.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{task.assignee.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">Not assigned</p>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Task ID */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Task ID</p>
            <p className="text-sm font-mono text-slate-700 dark:text-slate-300 mt-1">TASK-{task.id}</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteModal(false)} />
            
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Delete Task</h3>
                <button onClick={() => setShowDeleteModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}