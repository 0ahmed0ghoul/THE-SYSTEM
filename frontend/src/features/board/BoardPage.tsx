// frontend/src/features/board/BoardPage.tsx
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useState, useMemo, useCallback } from "react";
import { Plus, Filter, X } from "lucide-react";



import Column from "./components/Column";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import { useTaskStore, type Task, type TaskStatus } from "../../store/taskStore";

type FilterType = "all" | "assigned" | "due" | "highPriority";

type ColumnType = {
  id: TaskStatus;
  title: string;
  icon: string;
  color: string;
};

const COLUMNS: ColumnType[] = [
  { id: "todo", title: "To Do", icon: "📋", color: "bg-gray-100 dark:bg-gray-800" },
  { id: "inprogress", title: "In Progress", icon: "🔄", color: "bg-blue-100 dark:bg-blue-950/30" },
  { id: "done", title: "Done", icon: "✅", color: "bg-emerald-100 dark:bg-emerald-950/30" },
];

export default function BoardPage({ projectId }: { projectId?: number }) {
  const { tasks, updateTask, addTask } = useTaskStore();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterType>("all");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("todo");
  const [showFilters, setShowFilters] = useState(false);

  // Get tasks based on projectId
  const projectTasks = useMemo(() => {
    if (projectId) {
      return tasks.filter(task => task.projectId === projectId);
    }
    return tasks;
  }, [tasks, projectId]);

  // Filter logic
  const filteredTasks = useMemo(() => {
    if (filterBy === "all") return projectTasks;

    if (filterBy === "assigned") {
      return projectTasks.filter((t) => t.assignee);
    }

    if (filterBy === "due") {
      const today = new Date().toDateString();
      return projectTasks.filter(
        (t) => t.dueDate && new Date(t.dueDate).toDateString() === today
      );
    }

    if (filterBy === "highPriority") {
      return projectTasks.filter((t) => t.priority === "high" || t.priority === "urgent");
    }

    return projectTasks;
  }, [projectTasks, filterBy]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      todo: [],
      inprogress: [],
      done: [],
    };

    filteredTasks.forEach((task) => {
      map[task.status].push(task);
    });

    return map;
  }, [filteredTasks]);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  // Drag start handler
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = projectTasks.find((t) => t.id === event.active.id);
      setActiveTask(task || null);
    },
    [projectTasks]
  );

  // Drag end handler - update task status
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const taskId = active.id as number;
      const newStatus = over.id as TaskStatus;

      const task = projectTasks.find((t) => t.id === taskId);

      if (!task || task.status === newStatus) return;

      // Update task status
      updateTask(taskId, { status: newStatus });
    },
    [projectTasks, updateTask]
  );

  // Add task handler
  const handleAddTask = useCallback((status: TaskStatus) => {
    setSelectedStatus(status);
    setIsAddingTask(true);
  }, []);

  // Save new task
  const handleSaveTask = useCallback(
    (taskData: Partial<Task>) => {
      if (!taskData.title) return;
      
      const newTask: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
        title: taskData.title,
        description: taskData.description || "",
        status: selectedStatus,
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
      setIsAddingTask(false);
    },
    [addTask, projectId, selectedStatus]
  );

  // Get column statistics
  const getColumnStats = useCallback(
    (status: TaskStatus) => {
      const tasks = tasksByStatus[status];
      const now = new Date();

      return {
        total: tasks.length,
        highPriority: tasks.filter((t) => t.priority === "high" || t.priority === "urgent").length,
        overdue: tasks.filter(
          (t) => t.dueDate && new Date(t.dueDate) < now
        ).length,
      };
    },
    [tasksByStatus]
  );

  // Clear all filters
  const clearFilters = () => {
    setFilterBy("all");
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Project Board
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Drag and drop tasks to update their status
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Filter size={16} />
              <span>Filters</span>
              {filterBy !== "all" && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-20">
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
                            ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                            : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
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
            onClick={() => handleAddTask("todo")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {filterBy !== "all" && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-slate-400">Active filter:</span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs flex items-center gap-1">
            {filterBy === "assigned" && "Assigned to Me"}
            {filterBy === "due" && "Due Today"}
            {filterBy === "highPriority" && "High Priority"}
            <button onClick={clearFilters} className="hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded p-0.5">
              <X size={12} />
            </button>
          </span>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {COLUMNS.map((col) => {
          const stats = getColumnStats(col.id);

          return (
            <div
              key={col.id}
              className={`${col.color} rounded-xl p-4 border border-gray-200 dark:border-slate-800 transition-all hover:shadow-md`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{col.icon}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {col.title}
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </span>
              </div>

              {(stats.highPriority > 0 || stats.overdue > 0) && (
                <div className="flex gap-3 mt-3 text-xs">
                  {stats.highPriority > 0 && (
                    <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                      🔥 {stats.highPriority} high priority
                    </span>
                  )}
                  {stats.overdue > 0 && (
                    <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      ⚠️ {stats.overdue} overdue
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Board Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4 min-h-[500px]">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              title={col.title}
              status={col.id}
              tasks={tasksByStatus[col.id]}
              filterBy={filterBy}
              onAddTask={handleAddTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
        </DragOverlay>
      </DndContext>

      {/* Add Task Modal */}
      <TaskModal
        isOpen={isAddingTask}
        onClose={() => setIsAddingTask(false)}
        onSave={handleSaveTask}
        status={selectedStatus}
      />
    </div>
  );
}