import { useDroppable } from "@dnd-kit/core";
import { useMemo, useState, useCallback } from "react";
import {
  Plus,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import type { Task, TaskStatus } from "../../../store/taskStore";

type FilterType = "all" | "assigned" | "due";

type ColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  filterBy: FilterType;
  onAddTask: (status: TaskStatus) => void;
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

  // ✅ Memoized filtering (important for big boards)
  const filteredTasks = useMemo(() => {
    if (filterBy === "assigned") {
      return tasks.filter((t) => t.assignedTo); // adapt to your schema
    }

    if (filterBy === "due") {
      const today = new Date().toDateString();
      return tasks.filter(
        (t) =>
          t.dueDate &&
          new Date(t.dueDate).toDateString() === today
      );
    }

    return tasks;
  }, [tasks, filterBy]);

  // ✅ Stats (memoized)
  const stats = useMemo(() => {
    return {
      total: filteredTasks.length,
      highPriority: filteredTasks.filter((t) => t.priority === "high").length,
    };
  }, [filteredTasks]);

  // ✅ Handlers (stable references)
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleSaveTask = useCallback(() => {
      onAddTask(status);
      closeModal();
    },
    [onAddTask, status, closeModal]
  );

  // ✅ Dynamic footer (cleaner)
  const footerContent = useMemo(() => {
    switch (status) {
      case "todo":
        return (
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {stats.total}
          </span>
        );
      case "inprogress":
        return (
          <span className="flex items-center gap-1">
            <AlertCircle size={10} />
            In progress
          </span>
        );
      case "done":
        return (
          <span className="flex items-center gap-1">
            <CheckCircle2 size={10} />
            Done
          </span>
        );
      default:
        return null;
    }
  }, [status, stats.total]);

  return (
    <>
      <div
        ref={setNodeRef}
        className={`
          shrink-0 w-80 rounded-2xl 
          bg-white/70 backdrop-blur-xl border border-gray-100
          shadow-sm transition-all duration-300
          ${isOver ? "ring-2 ring-black/10 scale-[1.02]" : ""}
        `}
      >
        {/* HEADER */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>

            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span>{stats.total} tasks</span>

              {stats.highPriority > 0 && (
                <>
                  <span>•</span>
                  <span className="text-red-500 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {stats.highPriority}
                  </span>
                </>
              )}
            </div>
          </div>

          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
        </div>

        {/* TASK LIST */}
        <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-gray-400">No tasks</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>

        {/* ADD TASK */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={openModal}
            className="
              w-full flex items-center justify-center gap-2 
              text-sm text-gray-400 py-2 rounded-lg 
              hover:bg-gray-100 hover:text-gray-700 
              transition active:scale-[0.98]
            "
          >
            <Plus size={14} />
            Add task
          </button>
        </div>

        {/* FOOTER */}
        {stats.total > 0 && (
          <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
            {footerContent}
          </div>
        )}
      </div>

      {/* MODAL */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveTask}
        status={status}
      />
    </>
  );
}