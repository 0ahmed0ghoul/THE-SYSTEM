import { useDroppable } from "@dnd-kit/core";
import { useMemo, useState, useCallback } from "react";
import {
  Plus,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  Clock,
  Flame,
  Calendar,
} from "lucide-react";

import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import type { Task, TaskStatus, TaskPriority } from "../../../store/taskStore";

type FilterType = "all" | "assigned" | "due" | "highPriority";

type ColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  filterBy: FilterType;
  onAddTask: (status: TaskStatus, taskData?: Partial<Task>) => void;
};

export default function Column({
  title,
  status,
  tasks,
  filterBy,
  onAddTask,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Get status-specific styling
  const getStatusStyles = useCallback((status: TaskStatus) => {
    const styles = {
      todo: {
        bg: "bg-gray-50 dark:bg-gray-900/30",
        border: "border-gray-200 dark:border-gray-700",
        accent: "bg-gray-500",
        icon: "📋",
      },
      inprogress: {
        bg: "bg-blue-50 dark:bg-blue-950/20",
        border: "border-blue-200 dark:border-blue-800",
        accent: "bg-blue-500",
        icon: "🔄",
      },
      done: {
        bg: "bg-emerald-50 dark:bg-emerald-950/20",
        border: "border-emerald-200 dark:border-emerald-800",
        accent: "bg-emerald-500",
        icon: "✅",
      },
    };
    return styles[status];
  }, []);

  // Get status icon
  const getStatusIcon = useCallback((status: TaskStatus) => {
    const icons: Record<TaskStatus, string> = {
      todo: "📋",
      inprogress: "🔄",
      done: "✅",
    };
    return icons[status];
  }, []);

  // ✅ Memoized filtering with all filter types
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (filterBy === "assigned") {
      filtered = filtered.filter((t) => t.assignee);
    }

    if (filterBy === "due") {
      const today = new Date().toDateString();
      filtered = filtered.filter(
        (t) => t.dueDate && new Date(t.dueDate).toDateString() === today
      );
    }

    if (filterBy === "highPriority") {
      filtered = filtered.filter(
        (t) => t.priority === "high" || t.priority === "urgent"
      );
    }

    return filtered;
  }, [tasks, filterBy]);

  // ✅ Stats with detailed breakdown
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: filteredTasks.length,
      highPriority: filteredTasks.filter((t) => t.priority === "high" || t.priority === "urgent").length,
      mediumPriority: filteredTasks.filter((t) => t.priority === "medium").length,
      lowPriority: filteredTasks.filter((t) => t.priority === "low").length,
      overdue: filteredTasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < now
      ).length,
      dueToday: filteredTasks.filter(
        (t) => t.dueDate && new Date(t.dueDate).toDateString() === now.toDateString()
      ).length,
      completedSubtasks: filteredTasks.reduce(
        (acc, t) => acc + (t.subtasks?.filter((s) => s.completed).length || 0),
        0
      ),
      totalSubtasks: filteredTasks.reduce(
        (acc, t) => acc + (t.subtasks?.length || 0),
        0
      ),
    };
  }, [filteredTasks]);

  // ✅ Handlers with stable references
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const toggleMenu = useCallback(() => setShowMenu((prev) => !prev), []);
  const closeMenu = useCallback(() => setShowMenu(false), []);

  const handleSaveTask = useCallback(
    (taskData: Partial<Task>) => {
      onAddTask(status, taskData);
      closeModal();
    },
    [onAddTask, status, closeModal]
  );

  // ✅ Dynamic footer content
  const footerContent = useMemo(() => {
    switch (status) {
      case "todo":
        return (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {stats.total} tasks
            </span>
            {stats.highPriority > 0 && (
              <span className="flex items-center gap-1 text-red-500">
                <Flame size={12} />
                {stats.highPriority} high
              </span>
            )}
          </div>
        );
      case "inprogress":
        return (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <AlertCircle size={12} />
              {stats.total} in progress
            </span>
            {stats.overdue > 0 && (
              <span className="flex items-center gap-1 text-orange-500">
                <Calendar size={12} />
                {stats.overdue} overdue
              </span>
            )}
          </div>
        );
      case "done":
        return (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} />
              {stats.total} completed
            </span>
            {stats.totalSubtasks > 0 && (
              <span className="flex items-center gap-1">
                ✓ {stats.completedSubtasks}/{stats.totalSubtasks} subtasks
              </span>
            )}
          </div>
        );
      default:
        return null;
    }
  }, [status, stats]);

  const styles = getStatusStyles(status);

  return (
    <>
      <div
        ref={setNodeRef}
        className={`
          shrink-0 w-80 md:w-96 rounded-2xl 
          ${styles.bg} backdrop-blur-xl border ${styles.border}
          shadow-sm transition-all duration-300 flex flex-col
          ${isOver ? "ring-2 ring-black/10 dark:ring-white/10 scale-[1.02]" : ""}
        `}
      >
        {/* HEADER */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getStatusIcon(status)}</span>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                {title}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              <span>{stats.total} tasks</span>

              {stats.highPriority > 0 && status !== "done" && (
                <>
                  <span>•</span>
                  <span className="text-red-500 dark:text-red-400 flex items-center gap-1">
                    <Flame size={10} />
                    {stats.highPriority} high priority
                  </span>
                </>
              )}

              {stats.overdue > 0 && status === "inprogress" && (
                <>
                  <span>•</span>
                  <span className="text-orange-500 dark:text-orange-400 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {stats.overdue} overdue
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Menu Dropdown */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <MoreHorizontal size={16} className="text-gray-400" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={closeMenu}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <div className="p-1">
                    <button
                      onClick={() => {
                        // Handle clear all tasks
                        closeMenu();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      Clear all tasks
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* TASK LIST */}
        <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-2 opacity-50">{getStatusIcon(status)}</div>
              <p className="text-sm text-gray-400 dark:text-gray-500">No tasks</p>
              <button
                onClick={openModal}
                className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
              >
                + Add your first task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>

        {/* ADD TASK BUTTON */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={openModal}
            className="
              w-full flex items-center justify-center gap-2 
              text-sm text-gray-500 dark:text-gray-400 py-2 rounded-lg 
              hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300
              transition-all active:scale-[0.98]
            "
          >
            <Plus size={14} />
            Add task
          </button>
        </div>

        {/* FOOTER - Only show if there are tasks */}
        {stats.total > 0 && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
            {footerContent}
          </div>
        )}
      </div>

      {/* TASK MODAL */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveTask}
        status={status}
      />
    </>
  );
}