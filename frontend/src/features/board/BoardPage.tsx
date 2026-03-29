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
import { Plus } from "lucide-react";

import { useTaskStore } from "../../store/taskStore";
import type { Task, TaskStatus } from "../../store/taskStore";

import Column from "./components/Column";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";

type FilterType = "all" | "assigned" | "due";

type ColumnType = {
  id: TaskStatus;
  title: string;
  icon: string;
};

const COLUMNS: ColumnType[] = [
  { id: "todo", title: "To Do", icon: "📋" },
  { id: "inprogress", title: "In Progress", icon: "🔄" },
  { id: "done", title: "Done", icon: "✅" },
];

export default function BoardPage({ projectId = 1 }: { projectId?: number }) {
  const { getProjectTasks, updateTaskStatus, addTask } = useTaskStore();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterType>("all");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("todo");

  // ✅ Memoized tasks (performance boost)
  const projectTasks = useMemo(
    () => getProjectTasks(projectId),
    [getProjectTasks, projectId]
  );

  // ✅ Filter logic (ready for future expansion)
  const filteredTasks = useMemo(() => {
    if (filterBy === "all") return projectTasks;

    if (filterBy === "assigned") {
      return projectTasks.filter((t) => t.assignedTo); // adapt if needed
    }

    if (filterBy === "due") {
      const today = new Date().toDateString();
      return projectTasks.filter(
        (t) => t.dueDate && new Date(t.dueDate).toDateString() === today
      );
    }

    return projectTasks;
  }, [projectTasks, filterBy]);

  // ✅ Group tasks by status (O(n) instead of multiple filters)
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

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  // ✅ Drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = projectTasks.find((t) => t.id === event.active.id);
      setActiveTask(task || null);
    },
    [projectTasks]
  );

  // ✅ Drag end (optimized + safe)
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const taskId = active.id as number;
      const newStatus = over.id as TaskStatus;

      const task = projectTasks.find((t) => t.id === taskId);

      if (!task || task.status === newStatus) return;

      updateTaskStatus(taskId, newStatus);
    },
    [projectTasks, updateTaskStatus]
  );

  // Add task
  const handleAddTask = useCallback((status: TaskStatus) => {
    setSelectedStatus(status);
    setIsAddingTask(true);
  }, []);

  const handleSaveTask = useCallback(
    (taskData: Partial<Task>) => {
      addTask(
        projectId,
        taskData.title || "",
        taskData.description,
        taskData.priority
      );
      setIsAddingTask(false);
    },
    [addTask, projectId]
  );

  // ✅ Stats optimized
  const getColumnStats = useCallback(
    (status: TaskStatus) => {
      const tasks = tasksByStatus[status];

      const now = Date.now();

      return {
        total: tasks.length,
        highPriority: tasks.filter((t) => t.priority === "high").length,
        overdue: tasks.filter(
          (t) => t.dueDate && new Date(t.dueDate).getTime() < now
        ).length,
      };
    },
    [tasksByStatus]
  );

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Board</h2>
          <p className="text-gray-500 mt-1">
            Drag and drop tasks to update their status
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filters */}
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            {(["all", "assigned", "due"] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilterBy(type)}
                className={`px-3 py-1.5 text-sm rounded-md transition ${
                  filterBy === type
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {type === "all"
                  ? "All Tasks"
                  : type === "assigned"
                  ? "Assigned"
                  : "Due Today"}
              </button>
            ))}
          </div>

          {/* Add Task */}
          <button
            onClick={() => handleAddTask("todo")}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {COLUMNS.map((col) => {
          const stats = getColumnStats(col.id);

          return (
            <div key={col.id} className="bg-white rounded-xl p-3 border">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>{col.icon}</span>
                  <span className="font-semibold">{col.title}</span>
                </div>
                <span className="text-xl font-bold">{stats.total}</span>
              </div>

              <div className="flex gap-3 mt-2 text-xs">
                {stats.highPriority > 0 && (
                  <span className="text-red-600">🔥 {stats.highPriority}</span>
                )}
                {stats.overdue > 0 && (
                  <span className="text-orange-600">⚠️ {stats.overdue}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4 min-h-150">
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

      {/* Modal */}
      <TaskModal
        isOpen={isAddingTask}
        onClose={() => setIsAddingTask(false)}
        onSave={handleSaveTask} // your handleSaveTask has signature (task: Partial<Task>) => void
        status={selectedStatus} // selectedStatus is TaskStatus
      />
    </div>
  );
}
