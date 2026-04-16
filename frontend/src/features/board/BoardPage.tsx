// frontend/src/features/board/BoardPage.tsx
import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Filter, X, Edit, Trash2 } from "lucide-react";
import TaskModal from "./components/TaskModal";
import { useTaskStore, type Task, type TaskStatus } from "../../store/taskStore";

type FilterType = "all" | "assigned" | "due" | "highPriority";

const BoardPage = ({ projectId }: { projectId?: number }) => {
  const { tasks, loadTasks, updateTask, addTask, deleteTask } = useTaskStore();

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  useEffect(() => {
    void loadTasks(projectId);
  }, [loadTasks, projectId]);

  // Get tasks based on projectId
  const projectTasks = useMemo(() => {
    if (projectId) {
      return tasks.filter(task => task.projectId === projectId);
    }
    return tasks;
  }, [tasks, projectId]);

  // Filter logic
  const filteredTasks = useMemo(() => {
    let filtered = projectTasks;

    if (filterBy === "assigned") {
      filtered = filtered.filter((t) => t.assignee);
    } else if (filterBy === "due") {
      const today = new Date().toDateString();
      filtered = filtered.filter(
        (t) => t.dueDate && new Date(t.dueDate).toDateString() === today
      );
    } else if (filterBy === "highPriority") {
      filtered = filtered.filter((t) => t.priority === "high" || t.priority === "urgent");
    }

    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [projectTasks, filterBy, searchTerm]);

  // Get statistics
  const stats = useMemo(() => {
    return {
      total: projectTasks.length,
      todo: projectTasks.filter(t => t.status === "todo").length,
      inprogress: projectTasks.filter(t => t.status === "inprogress").length,
      done: projectTasks.filter(t => t.status === "done").length,
    };
  }, [projectTasks]);

  // Priority color helper
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
      low: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
    };
    return colors[priority] || colors.low;
  };

  // Status color helper
  const getStatusColor = (status: TaskStatus) => {
    const colors: Record<TaskStatus, string> = {
      todo: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
      inprogress: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
      done: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    };
    return colors[status];
  };

  // Format due date
  const formatDate = (date: string | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle status change
  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  // Handle save task
  const handleSaveTask = useCallback(
    (taskData: Partial<Task>) => {
      if (!taskData.title) return;

      if (editingTask) {
        updateTask(editingTask.id, taskData);
        setEditingTask(null);
      } else {
        const newTask: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
          title: taskData.title,
          description: taskData.description || "",
          status: "todo" as TaskStatus,
          priority: taskData.priority || "medium",
          projectId: projectId || 1,
          projectName: taskData.projectName,
          assignee: taskData.assignee,
          dueDate: taskData.dueDate,
          tags: taskData.tags || [],
          subtasks: [],
          attachments: [],
          comments: [],
        };
        addTask(newTask);
      }
      setIsAddingTask(false);
    },
    [addTask, updateTask, editingTask, projectId]
  );

  // Clear all filters
  const clearFilters = () => {
    setFilterBy("all");
    setSearchTerm("");
  };

  return (
    <div className="h-full flex flex-col p-6 bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Project Board
          </h2>
          <p className="text-gray-400 mt-1">
            Manage all tasks for this project
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              <Filter size={16} />
              <span>Filters</span>
              {filterBy !== "all" && (
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-white/20 z-20">
                  <div className="p-2">
                    {(["all", "assigned", "due", "highPriority"] as FilterType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setFilterBy(type);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          filterBy === type
                            ? "bg-blue-600/50 text-blue-200"
                            : "text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {type === "all" && "All Tasks"}
                        {type === "assigned" && "Assigned to Me"}
                        {type === "due" && "Due Today"}
                        {type === "highPriority" && "High Priority"}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => {
              setEditingTask(null);
              setIsAddingTask(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Tasks</div>
          <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
        </div>
        <div className="bg-sky-500/10 backdrop-blur-md border border-sky-500/20 rounded-lg p-4">
          <div className="text-sky-300 text-sm">To Do</div>
          <div className="text-2xl font-bold text-sky-200 mt-1">{stats.todo}</div>
        </div>
        <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 rounded-lg p-4">
          <div className="text-amber-300 text-sm">In Progress</div>
          <div className="text-2xl font-bold text-amber-200 mt-1">{stats.inprogress}</div>
        </div>
        <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-lg p-4">
          <div className="text-emerald-300 text-sm">Done</div>
          <div className="text-2xl font-bold text-emerald-200 mt-1">{stats.done}</div>
        </div>
      </div>

      {/* Active Filters */}
      {(filterBy !== "all" || searchTerm) && (
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-400">Active filters:</span>
          {filterBy !== "all" && (
            <span className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-lg text-xs border border-blue-500/30 flex items-center gap-2">
              {filterBy === "assigned" && "Assigned to Me"}
              {filterBy === "due" && "Due Today"}
              {filterBy === "highPriority" && "High Priority"}
            </span>
          )}
          {searchTerm && (
            <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-lg text-xs border border-purple-500/30">
              Search: "{searchTerm}"
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-white transition"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition"
        />
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-auto font-mono text-sm">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No tasks found. Create a new task to get started!
          </div>
        ) : (
          <div>
            {filteredTasks.map((task, index) => (
              <div key={task.id}>
                {/* Task Line */}
                <div className="flex items-center gap-2 py-2 hover:bg-white/5 px-2 transition-colors group">
                  {/* Title */}
                  <div className="flex-1 text-white truncate" style={{ minWidth: '200px' }}>
                    {task.title}
                  </div>

                  {/* Priority */}
                  <div className="shrink-0 w-12">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        task.priority === "urgent"
                          ? "bg-red-500/30 text-red-300"
                          : task.priority === "high"
                          ? "bg-orange-500/30 text-orange-300"
                          : task.priority === "medium"
                          ? "bg-yellow-500/30 text-yellow-300"
                          : "bg-blue-500/30 text-blue-300"
                      }`}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="shrink-0 w-20 text-gray-400 text-right">
                    {formatDate(task.dueDate)}
                  </div>

                  {/* Assignee */}
                  <div className="shrink-0 w-16 text-gray-400 text-right truncate">
                    {typeof task.assignee === 'string' ? task.assignee || "-" : task.assignee?.name || "-"}
                  </div>

                  {/* Status Buttons */}
                  <div className="shrink-0 flex gap-1">
                    <button
                      onClick={() =>
                        task.status !== "todo" &&
                        handleStatusChange(task.id, "todo")
                      }
                      className={`px-2 py-0.5 text-xs font-semibold rounded transition ${
                        task.status === "todo"
                          ? "bg-sky-500 text-white"
                          : "bg-sky-500/30 text-sky-300 hover:bg-sky-500/50"
                      }`}
                      title="To Do"
                    >
                      📋
                    </button>
                    <button
                      onClick={() =>
                        task.status !== "inprogress" &&
                        handleStatusChange(task.id, "inprogress")
                      }
                      className={`px-2 py-0.5 text-xs font-semibold rounded transition ${
                        task.status === "inprogress"
                          ? "bg-amber-500 text-white"
                          : "bg-amber-500/30 text-amber-300 hover:bg-amber-500/50"
                      }`}
                      title="In Progress"
                    >
                      ⚙️
                    </button>
                    <button
                      onClick={() =>
                        task.status !== "done" &&
                        handleStatusChange(task.id, "done")
                      }
                      className={`px-2 py-0.5 text-xs font-semibold rounded transition ${
                        task.status === "done"
                          ? "bg-emerald-500 text-white"
                          : "bg-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50"
                      }`}
                      title="Done"
                    >
                      ✅
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  <div className="shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setIsAddingTask(true);
                      }}
                      className="p-1 text-blue-400 hover:bg-blue-600/20 rounded transition"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => setDeletingTaskId(task.id)}
                      className="p-1 text-red-400 hover:bg-red-600/20 rounded transition"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Divider Line */}
                {index < filteredTasks.length - 1 && (
                  <div className="h-px bg-linear-to-r from-white/10 via-white/5 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isAddingTask}
        onClose={() => {
          setIsAddingTask(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask || undefined}
      />

      {/* Delete Confirmation */}
      {deletingTaskId && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setDeletingTaskId(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg border border-white/20 p-6 z-50 max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Delete Task?</h3>
            <p className="text-gray-300 mb-6">
              This action cannot be undone. The task will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingTaskId(null)}
                className="px-4 py-2 text-gray-300 hover:bg-white/10 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTask(deletingTaskId);
                  setDeletingTaskId(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BoardPage;