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
import { Plus, Filter, X, Calendar, AlertTriangle, Users, Clock } from "lucide-react";

import Column from "./components/Column";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import { useTaskStore, type Task, type TaskStatus } from "../../store/taskStore";

type FilterType = "all" | "assigned" | "due" | "highPriority";

type ColumnType = {
  id: TaskStatus;
  title: string;
  icon: string;
  badgeColor: string;
};

const COLUMNS: ColumnType[] = [
  { id: "todo", title: "STANDBY", icon: "◈", badgeColor: "rgba(79,195,247,0.3)" },
  { id: "inprogress", title: "IN PROGRESS", icon: "⟳", badgeColor: "rgba(255,213,79,0.3)" },
  { id: "done", title: "CLEARED", icon: "✓", badgeColor: "rgba(79,195,247,0.15)" },
];

// Priority rank helper
function getTaskRank(priority: string): "S" | "A" | "B" | "C" | "D" {
  return (
    ({ urgent: "S", high: "A", medium: "B", low: "C" } as Record<string, any>)[
      priority
    ] ?? "D"
  );
}

function getRankStyle(rank: string) {
  return {
    S: "text-red-400 border-red-500/40 bg-red-500/5",
    A: "text-amber-400 border-amber-500/40 bg-amber-500/5",
    B: "text-sky-300 border-sky-400/40 bg-sky-400/5",
    C: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5",
    D: "text-sky-500/50 border-sky-500/20 bg-transparent",
  }[rank] ?? "text-sky-500/50 border-sky-500/20";
}

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

  // Group tasks by status (including review)
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
    async (taskData: Partial<Task>): Promise<boolean> => {
      if (!taskData.title) return false;
  
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
  
      try {
        await addTask(newTask); // in case it's async
        setIsAddingTask(false);
        return true; // ✅ success
      } catch (error) {
        console.error(error);
        return false; // ❌ failure
      }
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

  const getFilterLabel = () => {
    if (filterBy === "assigned") return "ASSIGNED TO ME";
    if (filterBy === "due") return "DUE TODAY";
    if (filterBy === "highPriority") return "HIGH PRIORITY";
    return "ALL QUESTS";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#e0f7fa] font-[Cinzel,serif] tracking-wider">
            QUEST BOARD
          </h2>
          <p className="text-[10px] tracking-[1px] text-[rgba(79,195,247,0.45)] mt-1">
            DRAG & DROP TO UPDATE QUEST STATUS
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] rounded-lg hover:border-[rgba(79,195,247,0.4)] transition-all text-xs font-semibold tracking-wider text-[rgba(79,195,247,0.7)]"
            >
              <Filter size={12} />
              FILTER
              {filterBy !== "all" && (
                <span className="w-1.5 h-1.5 bg-[#4fc3f7] rounded-full shadow-[0_0_6px_#4fc3f7]"></span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-[rgba(4,18,38,0.98)] border border-[rgba(79,195,247,0.3)] rounded-lg shadow-2xl z-20 backdrop-blur-sm">
                  <div className="p-2">
                    {(["all", "assigned", "due", "highPriority"] as FilterType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setFilterBy(type);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold tracking-wider rounded-md transition-all ${
                          filterBy === type
                            ? "bg-[rgba(79,195,247,0.1)] text-[#4fc3f7] border-l-2 border-[#4fc3f7]"
                            : "text-[rgba(79,195,247,0.5)] hover:bg-[rgba(79,195,247,0.05)] hover:text-[rgba(79,195,247,0.7)]"
                        }`}
                      >
                        {type === "all" && "ALL QUESTS"}
                        {type === "assigned" && "ASSIGNED TO ME"}
                        {type === "due" && "DUE TODAY"}
                        {type === "highPriority" && "HIGH PRIORITY"}
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
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] rounded-lg hover:bg-[rgba(79,195,247,0.2)] transition-all text-xs font-semibold tracking-wider text-[#4fc3f7]"
          >
            <Plus size={12} />
            ADD QUEST
          </button>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {filterBy !== "all" && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[10px] tracking-[1px] text-[rgba(79,195,247,0.45)]">ACTIVE FILTER:</span>
          <span className="px-2 py-1 bg-[rgba(79,195,247,0.1)] border border-[rgba(79,195,247,0.3)] text-[#4fc3f7] rounded text-[10px] font-semibold tracking-wider flex items-center gap-1">
            {getFilterLabel()}
            <button onClick={clearFilters} className="hover:bg-[rgba(79,195,247,0.2)] rounded p-0.5 transition-colors">
              <X size={10} />
            </button>
          </span>
        </div>
      )}

      {/* Stats Row - Cyberpunk Style */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {COLUMNS.map((col) => {
          const stats = getColumnStats(col.id);

          return (
            <div
              key={col.id}
              className="relative bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.15)] rounded-lg p-3 overflow-hidden hover:border-[rgba(79,195,247,0.3)] transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-1 h-full" style={{ background: col.badgeColor }} />
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-60">{col.icon}</span>
                  <span className="text-[9px] font-bold tracking-[2px] text-[rgba(79,195,247,0.6)]">
                    {col.title}
                  </span>
                </div>
                <span className="text-xl font-bold text-[#e0f7fa] font-[Cinzel,serif]">
                  {stats.total}
                </span>
              </div>

              {(stats.highPriority > 0 || stats.overdue > 0) && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-[rgba(79,195,247,0.1)]">
                  {stats.highPriority > 0 && (
                    <span className="text-[9px] text-red-400 flex items-center gap-1">
                      <AlertTriangle size={8} /> {stats.highPriority} CRITICAL
                    </span>
                  )}
                  {stats.overdue > 0 && (
                    <span className="text-[9px] text-amber-400 flex items-center gap-1">
                      <Clock size={8} /> {stats.overdue} OVERDUE
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
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
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

        <DragOverlay dropAnimation={null}>
          {activeTask && (
            <div className="transform rotate-3 scale-105">
              <TaskCard task={activeTask} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Add Task Modal */}
      <TaskModal
        isOpen={isAddingTask}
        onClose={() => setIsAddingTask(false)}
        onSave={handleSaveTask}
        status={selectedStatus}
      />

      <style>{`
        /* Custom scrollbar for board columns */
        .flex.overflow-x-auto::-webkit-scrollbar {
          height: 4px;
        }
        
        .flex.overflow-x-auto::-webkit-scrollbar-track {
          background: rgba(79, 195, 247, 0.05);
          border-radius: 4px;
        }
        
        .flex.overflow-x-auto::-webkit-scrollbar-thumb {
          background: rgba(79, 195, 247, 0.3);
          border-radius: 4px;
        }
        
        .flex.overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 195, 247, 0.5);
        }
      `}</style>
    </div>
  );
}