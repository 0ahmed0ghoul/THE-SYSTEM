// frontend/src/features/projects/ProjectBoard.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";
import { useTaskStore, type TaskStatus, type Task } from "../../store/taskStore";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus,
  ArrowLeft,
  Trash2,
  Edit3,
  AlertCircle,
  X,
  Search,
  Filter,
  Flag,
  Calendar,
} from "lucide-react";

const COLUMNS = [
  { id: "todo" as TaskStatus, title: "TO DO", color: "text-sky-400", bgColor: "bg-sky-500" },
  { id: "inprogress" as TaskStatus, title: "IN PROGRESS", color: "text-amber-400", bgColor: "bg-amber-500" },
  { id: "done" as TaskStatus, title: "DONE", color: "text-emerald-400", bgColor: "bg-emerald-500" },
];

// ── Task Form Modal ──────────────────────────────────────────────────────────
function TaskFormModal({
  task,
  projectId,
  onSave,
  onCancel,
}: {
  task?: Task;
  projectId: number;
  onSave: (data: Partial<Task>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;
    onSave({
      ...formData,
      projectId,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-[#0a1628] border border-[rgba(79,195,247,0.2)] rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(79,195,247,0.1)]">
          <h3 className="text-lg font-semibold text-[#e0f7fa] tracking-wide">
            {task ? "EDIT TASK" : "NEW TASK"}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={18} className="text-[rgba(79,195,247,0.5)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[rgba(79,195,247,0.6)] uppercase tracking-wider mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title..."
              className="w-full px-4 py-3 bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.2)] rounded-lg text-[#e0f7fa] placeholder:text-[rgba(79,195,247,0.3)] focus:outline-none focus:border-[#4fc3f7] transition-colors"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[rgba(79,195,247,0.6)] uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details..."
              rows={3}
              className="w-full px-4 py-3 bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.2)] rounded-lg text-[#e0f7fa] placeholder:text-[rgba(79,195,247,0.3)] focus:outline-none focus:border-[#4fc3f7] transition-colors resize-none"
            />
          </div>

          {/* Grid: Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[rgba(79,195,247,0.6)] uppercase tracking-wider mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-3 bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.2)] rounded-lg text-[#e0f7fa] focus:outline-none focus:border-[#4fc3f7] transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234fc3f7' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🔵 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[rgba(79,195,247,0.6)] uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.2)] rounded-lg text-[#e0f7fa] focus:outline-none focus:border-[#4fc3f7] transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234fc3f7' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-medium text-[rgba(79,195,247,0.6)] uppercase tracking-wider mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.2)] rounded-lg text-[#e0f7fa] focus:outline-none focus:border-[#4fc3f7] transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-[rgba(79,195,247,0.2)] text-[rgba(79,195,247,0.6)] rounded-lg hover:bg-[rgba(79,195,247,0.05)] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#4fc3f7] text-[#0a1628] rounded-lg hover:bg-[#3db8ed] transition-colors font-semibold"
            >
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirmation ──────────────────────────────────────────────────────
function DeleteConfirm({
  task,
  onConfirm,
  onCancel,
}: {
  task: Task;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-[#0a1628] border border-[rgba(255,107,107,0.3)] rounded-lg shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[rgba(255,107,107,0.1)] flex items-center justify-center">
            <AlertCircle size={20} className="text-[#ff6b6b]" />
          </div>
          <h3 className="text-lg font-semibold text-[#e0f7fa]">Delete Task?</h3>
        </div>
        <p className="text-[rgba(224,247,250,0.6)] mb-6">
          Are you sure you want to delete <strong className="text-[#e0f7fa]">{task.title}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-[rgba(79,195,247,0.2)] text-[rgba(79,195,247,0.6)] rounded-lg hover:bg-[rgba(79,195,247,0.05)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-[#ff6b6b] text-white rounded-lg hover:bg-[#ff5252] transition-colors font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectBoard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = id ? parseInt(id) : null;

  const { projects, getProjectById } = useProjectStore();
  const { tasks, loadTasks, updateTask, deleteTask, addTask } = useTaskStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get project data
  const project = projectId ? getProjectById(projectId) : null;

  // Load tasks on mount
  useEffect(() => {
    if (projectId) {
      void loadTasks(projectId);
    }
  }, [projectId, loadTasks]);

  // Filter tasks for this project
  const projectTasks = useMemo(() => {
    if (!projectId) return [];
    return tasks
      .filter((task) => task.projectId === projectId)
      .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [tasks, projectId, searchQuery]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      todo: [],
      inprogress: [],
      done: [],
    };

    projectTasks.forEach((task) => {
      map[task.status].push(task);
    });

    return map;
  }, [projectTasks]);

  // Stats
  const stats = {
    total: projectTasks.length,
    todo: tasksByStatus.todo.length,
    inprogress: tasksByStatus.inprogress.length,
    done: tasksByStatus.done.length,
  };

  const handleSaveTask = (data: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data as Omit<Task, "id" | "createdAt" | "updatedAt">);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020c1a] text-[#e0f7fa]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-[#4fc3f7] text-[#0a1628] rounded hover:bg-[#3db8ed]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020c1a] text-[#e0f7fa] font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(79,195,247,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(79,230,160,0.05)_0%,transparent_40%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(79,195,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.5) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-[#4fc3f7]/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-[#4fc3f7]" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#e0f7fa] mb-1">
                {project.name}
              </h1>
              <p className="text-[rgba(79,195,247,0.5)] text-sm">
                Manage your project tasks
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4fc3f7] text-[#0a1628] font-semibold rounded-lg hover:bg-[#3db8ed] transition-colors shadow-lg shadow-[rgba(79,195,247,0.2)]"
          >
            <Plus size={18} />
            New Task
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, color: "#4fc3f7" },
            { label: "To Do", value: stats.todo, color: "#64748b" },
            { label: "In Progress", value: stats.inprogress, color: "#ffb347" },
            { label: "Done", value: stats.done, color: "#4fe6a0" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.1)] rounded-lg p-3 text-center hover:border-[rgba(79,195,247,0.2)] transition-colors"
            >
              <div className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[rgba(79,195,247,0.5)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center px-4 py-3 bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.2)] rounded-lg">
          <Search className="text-[rgba(79,195,247,0.4)] mr-3" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#e0f7fa] placeholder:text-[rgba(79,195,247,0.4)] focus:outline-none"
          />
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className="bg-[rgba(79,195,247,0.03)] rounded-lg border border-[rgba(79,195,247,0.1)] overflow-hidden flex flex-col"
            >
              {/* Column Header */}
              <div className="px-4 py-4 border-b border-[rgba(79,195,247,0.1)] bg-[rgba(4,12,28,0.8)]">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold tracking-wide text-[#e0f7fa] uppercase text-sm">
                    {col.title}
                  </h3>
                  <span
                    className={`text-xs font-bold ${col.color} bg-[rgba(79,195,247,0.1)] px-2.5 py-1 rounded`}
                  >
                    {tasksByStatus[col.id].length}
                  </span>
                </div>
              </div>

              {/* Tasks Container */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ maxHeight: "600px" }}>
                {tasksByStatus[col.id].length > 0 ? (
                  tasksByStatus[col.id].map((task) => (
                    <div
                      key={task.id}
                      className="group bg-linear-to-br from-[rgba(79,195,247,0.08)] to-[rgba(79,195,247,0.02)] border border-[rgba(79,195,247,0.2)] hover:border-[rgba(79,195,247,0.4)] rounded-lg p-4 transition-all hover:shadow-lg hover:shadow-[rgba(79,195,247,0.1)]"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-[#e0f7fa] flex-1 line-clamp-2 group-hover:text-[#4fc3f7]">
                          {task.title}
                        </h4>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 hover:bg-[rgba(79,195,247,0.1)] rounded transition-colors"
                          >
                            <Edit3 size={14} className="text-[rgba(79,195,247,0.6)]" />
                          </button>
                          <button
                            onClick={() => setDeletingTask(task)}
                            className="p-1.5 hover:bg-[rgba(255,107,107,0.1)] rounded transition-colors"
                          >
                            <Trash2 size={14} className="text-[#ff6b6b]" />
                          </button>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-xs text-[rgba(79,195,247,0.5)] mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        {task.priority && (
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                              task.priority === "urgent"
                                ? "text-red-400 bg-red-500/10 border border-red-500/20"
                                : task.priority === "high"
                                ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                                : task.priority === "medium"
                                ? "text-sky-400 bg-sky-500/10 border border-sky-500/20"
                                : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                            }`}
                          >
                            {task.priority}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="text-[10px] text-[rgba(79,195,247,0.5)] flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(task.dueDate).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>

                      {/* Status Change Buttons */}
                      <div className="flex gap-2 mt-4 pt-3 border-t border-[rgba(79,195,247,0.1)]">
                        {task.status !== "inprogress" && (
                          <button
                            onClick={() => updateTask(task.id, { status: "inprogress" })}
                            className="flex-1 text-[10px] font-semibold py-1.5 px-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded hover:bg-amber-500/20 transition-colors uppercase tracking-wider"
                          >
                            In Progress
                          </button>
                        )}
                        {task.status !== "done" && (
                          <button
                            onClick={() => updateTask(task.id, { status: "done" })}
                            className="flex-1 text-[10px] font-semibold py-1.5 px-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded hover:bg-emerald-500/20 transition-colors uppercase tracking-wider"
                          >
                            Done
                          </button>
                        )}
                        {task.status !== "todo" && (
                          <button
                            onClick={() => updateTask(task.id, { status: "todo" })}
                            className="flex-1 text-[10px] font-semibold py-1.5 px-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded hover:bg-sky-500/20 transition-colors uppercase tracking-wider"
                          >
                            To Do
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-[rgba(79,195,247,0.3)]">
                    <div className="text-3xl mb-2 opacity-50">✦</div>
                    <p className="text-xs tracking-[1px] text-center">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <TaskFormModal
          task={editingTask || undefined}
          projectId={projectId || 0}
          onSave={handleSaveTask}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
        />
      )}

      {deletingTask && (
        <DeleteConfirm
          task={deletingTask}
          onConfirm={handleDeleteTask}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
}