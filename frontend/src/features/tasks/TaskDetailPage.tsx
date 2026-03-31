// frontend/src/features/tasks/TaskDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  MessageSquare,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  Send,
  Target,
  RefreshCw,
  Copy,
  CalendarDays,
  Users,
} from "lucide-react";
import { useTaskStore } from "../../store/taskStore";
import { useProjectStore } from "../../store/projectStore";

// ── Rank assignment helpers ──────────────────────────────────────────────────
function getTaskRank(priority: string): "S" | "A" | "B" | "C" | "D" {
  return (
    ({ urgent: "S", high: "A", medium: "B", low: "C" } as Record<string, any>)[
      priority
    ] ?? "D"
  );
}

function getRankStyle(rank: string) {
  return {
    S: "text-red-400 border-red-500/40 bg-red-500/5 shadow-[0_0_8px_rgba(255,100,100,0.4)]",
    A: "text-amber-400 border-amber-500/40 bg-amber-500/5 shadow-[0_0_8px_rgba(255,180,70,0.4)]",
    B: "text-sky-300 border-sky-400/40 bg-sky-400/5 shadow-[0_0_8px_rgba(79,195,247,0.4)]",
    C: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_8px_rgba(79,230,160,0.4)]",
    D: "text-sky-500/50 border-sky-500/20 bg-transparent",
  }[rank] ?? { badge: "text-sky-500/50 border-sky-500/20", text: "text-sky-500/50" };
}

function taskStatusStyle(status: string) {
  return {
    todo: { cls: "text-sky-400/50 border-sky-400/20", label: "STANDBY", icon: <Clock size={12} />, color: "#4fc3f7" },
    inprogress: { cls: "text-amber-400 border-amber-400/35", label: "IN PROGRESS", icon: <AlertCircle size={12} />, color: "#ffb347" },
    done: { cls: "text-emerald-400 border-emerald-400/35", label: "COMPLETE", icon: <CheckCircle2 size={12} />, color: "#4fe6a0" },
  }[status] ?? { cls: "text-sky-400/50 border-sky-400/20", label: status.toUpperCase(), icon: <Clock size={12} />, color: "#4fc3f7" };
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const taskId = parseInt(id!);
  
  const { getTaskById, updateTask, deleteTask, addComment, toggleSubtask } = useTaskStore();
  const { projects } = useProjectStore();
  
  const task = getTaskById(taskId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task?.title || "");
  const [editedDescription, setEditedDescription] = useState(task?.description || "");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || "");
    }
  }, [task]);

  if (!task) {
    return (
      <div className="sys-task-not-found min-h-screen bg-[#020c1a] font-['Rajdhani',sans-serif] text-[#e0f7fa] relative">
        <div className="fixed inset-0 bg-[radial-gradient(circle,rgba(79,195,247,0.055)_1px,transparent_1px)] bg-size-[30px_30px] pointer-events-none" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center animate-[fade-in-up_0.5s_ease]">
            <AlertCircle size={64} className="mx-auto text-[rgba(79,195,247,0.3)] mb-4" />
            <h2 className="text-2xl font-['Cinzel',serif] font-bold text-[#e0f7fa] mb-2">QUEST NOT FOUND</h2>
            <p className="text-sm text-[rgba(79,195,247,0.5)] mb-6">The requested operation does not exist in the database.</p>
            <button
              onClick={() => navigate("/tasks")}
              className="px-6 py-2.5 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[11px] tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all"
            >
              RETURN TO QUEST BOARD
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rank = getTaskRank(task.priority);
  const rankStyle = getRankStyle(rank);
  const statusStyle = taskStatusStyle(task.status);
  const project = projects.find(p => p.id === task.projectId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  const handleUpdateTask = async () => {
    if (editedTitle !== task.title || editedDescription !== task.description) {
      setIsSaving(true);
      updateTask(taskId, { title: editedTitle, description: editedDescription });
      setTimeout(() => setIsSaving(false), 500);
    }
    setIsEditing(false);
  };

  const handleStatusChange = (status: "todo" | "inprogress" | "done") => {
    updateTask(taskId, { status });
    setShowStatusMenu(false);
  };

  const handlePriorityChange = (priority: "low" | "medium" | "high" | "urgent") => {
    updateTask(taskId, { priority });
    setShowPriorityMenu(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(taskId, {
              id: Date.now(),
              taskId,
              userId: 1,
              userName: "Hunter",
              content: newComment,
              createdAt: new Date().toISOString(),
            });
      setNewComment("");
      setIsTyping(false);
    }
  };

  const handleToggleSubtask = (subtaskId: number) => {
    toggleSubtask(taskId, subtaskId);
  };

  const handleDeleteTask = () => {
    deleteTask(taskId);
    navigate("/tasks");
  };

  const copyTaskId = () => {
    navigator.clipboard.writeText(`TASK-${task.id}`);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <div className="sys-task-detail min-h-screen bg-[#020c1a] font-['Rajdhani',sans-serif] text-[#e0f7fa] relative">
      {/* Background Layers */}
      <div className="fixed inset-0 bg-[radial-gradient(circle,rgba(79,195,247,0.055)_1px,transparent_1px)] bg-size-[30px_30px] pointer-events-none z-0" />
      <div className="fixed w-225 h-225 -top-75 -left-62.5 bg-[radial-gradient(circle,rgba(2,80,160,0.13)_0%,transparent_70%)] rounded-full pointer-events-none z-0 blur-[20px]" />
      <div className="fixed w-150 h-150 -bottom-50 -right-25 bg-[radial-gradient(circle,rgba(79,195,247,0.07)_0%,transparent_70%)] rounded-full pointer-events-none z-0 blur-[20px]" />
      <div className="fixed inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(79,195,247,0.012)_2px,rgba(79,195,247,0.012)_4px)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {/* Copy Success Toast */}
        {showCopySuccess && (
          <div className="fixed top-20 right-4 z-50 animate-[slide-in_0.3s_ease]">
            <div className="bg-[rgba(4,18,38,0.98)] border-l-2 border-emerald-400 px-4 py-2 shadow-lg flex items-center gap-2 backdrop-blur-sm">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span className="text-[10px] tracking-[1.5px] text-[#e0f7fa]">Quest ID copied</span>
            </div>
          </div>
        )}

        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-6 animate-[fade-in-up_0.4s_ease_both]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tasks")}
              className="p-2 hover:bg-[rgba(79,195,247,0.1)] transition-all duration-200 group"
            >
              <ArrowLeft size={20} className="text-[rgba(79,195,247,0.5)] group-hover:text-[#4fc3f7]" />
            </button>
            
            <div>
              {isEditing ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdateTask()}
                    autoFocus
                    className="text-2xl font-['Cinzel',serif] font-bold px-3 py-1 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.3)] focus:border-[rgba(79,195,247,0.6)] focus:outline-none text-[#e0f7fa]"
                  />
                  <button
                    onClick={handleUpdateTask}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[10px] tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all"
                  >
                    {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                    {isSaving ? "SAVING" : "SAVE"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedTitle(task.title);
                      setEditedDescription(task.description || "");
                    }}
                    className="px-3 py-1.5 border border-[rgba(79,195,247,0.3)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.6)] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-['Cinzel',serif] font-bold text-[#e0f7fa]">
                    {task.title}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 hover:bg-[rgba(79,195,247,0.1)] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 size={14} className="text-[rgba(79,195,247,0.5)]" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] tracking-[2px] text-[rgba(79,195,247,0.45)]">GATE:</span>
                  <button
                    onClick={() => navigate(`/projects/${task.projectId}`)}
                    className="text-xs font-medium text-[#4fc3f7] hover:text-[#4fc3f7]/80 transition-colors"
                  >
                    {project?.name || "Unknown Gate"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] tracking-[2px] text-[rgba(79,195,247,0.45)]">CREATED:</span>
                  <span className="text-xs text-[rgba(79,195,247,0.6)]">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={copyTaskId}
                  className="flex items-center gap-1.5 text-[9px] tracking-[2px] text-[rgba(79,195,247,0.4)] hover:text-[#4fc3f7] transition-colors"
                >
                  <Copy size={10} />
                  TASK-{task.id}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 hover:bg-[rgba(255,100,100,0.1)] transition-colors"
            >
              <Trash2 size={16} className="text-red-400" />
            </button>
          </div>
        </div>

        {/* Status and Priority Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-[fade-in-up_0.4s_0.06s_ease_both]">
          {/* Status */}
          <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-4 relative group">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#4fc3f7] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <label className="block text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">STATUS</label>
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="w-full flex items-center justify-between px-3 py-2 border border-[rgba(79,195,247,0.2)] hover:border-[rgba(79,195,247,0.5)] transition-all"
              >
                <div className="flex items-center gap-2">
                  {statusStyle.icon}
                  <span className={`text-xs tracking-[1.5px] ${statusStyle.cls}`}>{statusStyle.label}</span>
                </div>
                <ChevronDown size={12} className={`transition-transform ${showStatusMenu ? "rotate-180" : ""}`} />
              </button>
              {showStatusMenu && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[rgba(4,12,28,0.98)] border border-[rgba(79,195,247,0.2)] z-10 animate-[fade-in-up_0.2s_ease]">
                  {(["todo", "inprogress", "done"] as const).map((status) => {
                    const sStyle = taskStatusStyle(status);
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[rgba(79,195,247,0.1)] transition-colors"
                      >
                        {sStyle.icon}
                        <span className={sStyle.cls}>{sStyle.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-4 relative group">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#ffd54f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <label className="block text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">RANK</label>
            <div className="relative">
              <button
                onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                className="w-full flex items-center justify-between px-3 py-2 border border-[rgba(79,195,247,0.2)] hover:border-[rgba(79,195,247,0.5)] transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-['Cinzel',serif] text-sm font-bold ${typeof rankStyle === 'object' ? rankStyle.text : ''}`}>{rank}</span>
                  <span className="text-xs text-[rgba(79,195,247,0.6)]">- Rank</span>
                </div>
                <ChevronDown size={12} className={`transition-transform ${showPriorityMenu ? "rotate-180" : ""}`} />
              </button>
              {showPriorityMenu && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[rgba(4,12,28,0.98)] border border-[rgba(79,195,247,0.2)] z-10 animate-[fade-in-up_0.2s_ease]">
                  {(["urgent", "high", "medium", "low"] as const).map((priority) => {
                    const pRank = getTaskRank(priority);
                    const pStyle = getRankStyle(pRank);
                    return (
                      <button
                        key={priority}
                        onClick={() => handlePriorityChange(priority)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[rgba(79,195,247,0.1)] transition-colors"
                      >
                        <span className={`font-['Cinzel',serif] text-sm font-bold ${typeof pStyle === 'object' ? pStyle.text : ''}`}>{pRank}</span>
                        <span className="text-[rgba(79,195,247,0.6)] capitalize">- {priority}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Task Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Description */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 animate-[fade-in-up_0.4s_0.12s_ease_both]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
                <h3 className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa]">QUEST BRIEFING</h3>
              </div>
              {isEditing ? (
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm resize-none"
                />
              ) : (
                <p className="text-sm text-[rgba(79,195,247,0.5)] leading-relaxed">
                  {task.description || "No briefing provided for this operation."}
                </p>
              )}
            </div>

            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] overflow-hidden animate-[fade-in-up_0.4s_0.18s_ease_both]">
                <button
                  onClick={() => setShowSubtasks(!showSubtasks)}
                  className="w-full flex items-center justify-between p-4 hover:bg-[rgba(79,195,247,0.04)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#ffd54f] shadow-[0_0_6px_#ffd54f]" />
                    <h3 className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa]">
                      OBJECTIVES ({completedSubtasks}/{totalSubtasks})
                    </h3>
                  </div>
                  {showSubtasks ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {showSubtasks && (
                  <div className="border-t border-[rgba(79,195,247,0.1)] p-4 space-y-3">
                    {subtaskProgress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-[9px] tracking-[1px] text-[rgba(79,195,247,0.4)] mb-1">
                          <span>COMPLETION</span>
                          <span>{Math.round(subtaskProgress)}%</span>
                        </div>
                        <div className="h-1 bg-[rgba(79,195,247,0.08)] overflow-hidden">
                          <div className="h-full transition-all duration-700" style={{ width: `${subtaskProgress}%`, background: "linear-gradient(90deg, #4fc3f7, #4fe6a0)" }} />
                        </div>
                      </div>
                    )}
                    {task.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-3 group">
                        <button
                          onClick={() => handleToggleSubtask(subtask.id)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            subtask.completed
                              ? "bg-[#4fe6a0] border-[#4fe6a0]"
                              : "border-[rgba(79,195,247,0.3)] hover:border-[#4fc3f7]"
                          }`}
                        >
                          {subtask.completed && <CheckCircle2 size={10} className="text-[#020c1a]" />}
                        </button>
                        <span className={`text-xs flex-1 transition-all ${
                          subtask.completed ? "line-through text-[rgba(79,195,247,0.3)]" : "text-[rgba(79,195,247,0.7)]"
                        }`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comments */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] overflow-hidden animate-[fade-in-up_0.4s_0.24s_ease_both]">
              <button
                onClick={() => setShowComments(!showComments)}
                className="w-full flex items-center justify-between p-4 hover:bg-[rgba(79,195,247,0.04)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#4fe6a0] shadow-[0_0_6px_#4fe6a0]" />
                  <h3 className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa]">
                    OPERATION LOG ({task.comments?.length || 0})
                  </h3>
                </div>
                {showComments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {showComments && (
                <div className="border-t border-[rgba(79,195,247,0.1)]">
                  {/* Add Comment */}
                  <div className="p-4 border-b border-[rgba(79,195,247,0.1)]">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg border border-[rgba(79,195,247,0.3)] flex items-center justify-center font-['Cinzel',serif] text-xs font-bold text-[#4fc3f7]">
                        H
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => {
                            setNewComment(e.target.value);
                            setIsTyping(e.target.value.length > 0);
                          }}
                          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddComment()}
                          placeholder="Add mission log entry..."
                          rows={2}
                          className="w-full px-3 py-2 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm resize-none"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] tracking-[2px] uppercase transition-all ${
                              newComment.trim()
                                ? "bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)]"
                                : "border border-[rgba(79,195,247,0.2)] text-[rgba(79,195,247,0.3)] cursor-not-allowed"
                            }`}
                          >
                            <Send size={10} />
                            POST LOG
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="divide-y divide-[rgba(79,195,247,0.07)] max-h-100 overflow-y-auto">
                    {task.comments && task.comments.length > 0 ? (
                      task.comments.map((comment) => (
                        <div key={comment.id} className="p-4 hover:bg-[rgba(79,195,247,0.02)] transition-colors">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg border border-[rgba(79,195,247,0.2)] flex items-center justify-center font-['Cinzel',serif] text-xs font-bold text-[#4fc3f7]">
                              {comment.userName[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-[#e0f7fa]">{comment.userName}</span>
                                <span className="text-[8px] tracking-[1px] text-[rgba(79,195,247,0.3)]">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs text-[rgba(79,195,247,0.5)] leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <MessageSquare size={32} className="mx-auto text-[rgba(79,195,247,0.2)] mb-2" />
                        <p className="text-[10px] tracking-[2px] text-[rgba(79,195,247,0.3)]">No mission logs recorded</p>
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
              <div className={`bg-[rgba(4,18,38,0.95)] border p-4 animate-[fade-in-up_0.4s_0.12s_ease_both] ${isOverdue ? "border-red-500/30" : "border-[rgba(79,195,247,0.2)]"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays size={14} className="text-[#ffd54f]" />
                  <h3 className="text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)]">DEADLINE</h3>
                </div>
                <p className={`text-sm font-['Cinzel',serif] ${isOverdue ? "text-red-400" : "text-[#e0f7fa]"}`}>
                  {new Date(task.dueDate).toLocaleDateString(undefined, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                {isOverdue && (
                  <div className="flex items-center gap-1.5 mt-2 text-[9px] text-red-400">
                    <AlertCircle size={10} />
                    <span>OVERDUE</span>
                  </div>
                )}
              </div>
            )}

            {/* Assignee */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-4 animate-[fade-in-up_0.4s_0.18s_ease_both]">
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-[#4fc3f7]" />
                <h3 className="text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)]">ASSIGNED HUNTER</h3>
              </div>
              {task.assignee ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-[rgba(79,195,247,0.3)] flex items-center justify-center font-['Cinzel',serif] text-sm font-bold text-[#4fc3f7]">
                    {task.assignee.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#e0f7fa]">{task.assignee.name}</p>
                    <p className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.4)]">{task.assignee.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[rgba(79,195,247,0.4)] italic">Unassigned</p>
              )}
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-4 animate-[fade-in-up_0.4s_0.24s_ease_both]">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={14} className="text-[#4fe6a0]" />
                  <h3 className="text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)]">CLASSIFICATION</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 border border-[rgba(79,195,247,0.2)] text-[9px] tracking-[1px] text-[rgba(79,195,247,0.6)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Ring */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-4 animate-[fade-in-up_0.4s_0.3s_ease_both]">
              <div className="flex items-center gap-2 mb-3">
                <Target size={14} className="text-[#ffd54f]" />
                <h3 className="text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)]">QUEST PROGRESS</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="rgba(79,195,247,0.1)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke={task.status === "done" ? "#4fe6a0" : task.status === "inprogress" ? "#ffb347" : "#4fc3f7"}
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - (task.status === "done" ? 100 : task.status === "inprogress" ? 50 : 0) / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-['Cinzel',serif] font-bold text-[#e0f7fa]">
                      {task.status === "done" ? "100" : task.status === "inprogress" ? "50" : "0"}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#4fc3f7]" />
                    <span className="text-[9px] text-[rgba(79,195,247,0.5)]">Standby</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#ffb347]" />
                    <span className="text-[9px] text-[rgba(79,195,247,0.5)]">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#4fe6a0]" />
                    <span className="text-[9px] text-[rgba(79,195,247,0.5)]">Complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quest Rank Badge */}
            <div className={`bg-[rgba(4,18,38,0.95)] border p-4 text-center animate-[fade-in-up_0.4s_0.36s_ease_both] ${typeof rankStyle === 'object' ? rankStyle.badge : ''}`}>
              <div className="font-['Cinzel',serif] text-4xl font-black mb-1">{rank}</div>
              <div className="text-[9px] tracking-[2px] uppercase">Quest Rank</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between mt-6 px-4 py-2 bg-[rgba(4,12,28,0.85)] border border-[rgba(79,195,247,0.1)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.25)] animate-[fade-in-up_0.4s_0.42s_ease_both]">
          <span>Quest Detail v1.0 · Active Operation</span>
          <span className="text-[rgba(79,230,160,0.5)]">⬡ {statusStyle.label}</span>
          <span>Last Update: Just Now</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-[rgba(4,18,38,0.98)] border border-[rgba(79,195,247,0.3)] w-full max-w-md p-6 shadow-2xl animate-[fade-in-up_0.3s_ease]">
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[rgba(79,195,247,0.3)]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[rgba(79,195,247,0.3)]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[rgba(79,195,247,0.3)]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[rgba(79,195,247,0.3)]" />
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-red-400 shadow-[0_0_6px_#ff6b6b]" />
                <h3 className="font-['Cinzel',serif] text-lg font-bold tracking-[2px] text-[#e0f7fa]">TERMINATE QUEST</h3>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="p-1 hover:bg-[rgba(79,195,247,0.1)] transition-colors">
                <X size={18} className="text-[rgba(79,195,247,0.5)]" />
              </button>
            </div>

            <p className="text-sm text-[rgba(79,195,247,0.5)] mb-6 leading-relaxed">
              Are you sure you want to terminate <span className="text-[#ff6b6b]">"{task.title}"</span>? This action is irreversible and all mission data will be purged.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-[rgba(79,195,247,0.2)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.5)] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="flex-1 px-4 py-2.5 bg-red-600/20 border border-red-500 text-[10px] tracking-[2px] uppercase text-red-400 hover:bg-red-600/30 transition-all"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.2); }
      `}</style>
    </div>
  );
}