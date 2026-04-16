import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { Calendar, AlertCircle } from "lucide-react";

import type { Task } from "../../../store/taskStore";

export default function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  });

  // ✅ Smooth transform
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  // ✅ Derived UI states
  const isOverdue = useMemo(() => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate).getTime() < Date.now();
  }, [task.dueDate]);

  const priorityColor = {
    low: "bg-gray-200 text-gray-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-600",
    urgent: "bg-red-200 text-red-700",
  }[task.priority || "medium"];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`
        bg-white rounded-xl p-3 mb-2 
        shadow-sm border border-gray-100
        cursor-grab active:cursor-grabbing
        transition-all duration-200
        hover:shadow-md hover:-translate-y-px
        ${isDragging ? "scale-105 shadow-lg" : ""}
      `}
    >
      {/* TITLE */}
      <p className="font-medium text-gray-800 text-sm">
        {task.title}
      </p>

      {/* DESCRIPTION (optional) */}
      {task.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* FOOTER */}
      <div className="flex items-center justify-between mt-3">
        {/* PRIORITY */}
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColor}`}
        >
          {task.priority || "medium"}
        </span>

        {/* DUE DATE */}
        {task.dueDate && (
          <span
            className={`flex items-center gap-1 text-[10px] ${
              isOverdue ? "text-red-500" : "text-gray-400"
            }`}
          >
            {isOverdue && <AlertCircle size={10} />}
            <Calendar size={10} />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}