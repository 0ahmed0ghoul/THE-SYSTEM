// frontend/src/features/board/components/TaskCard.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { Calendar, AlertTriangle, GripVertical, Clock, CheckCircle2 } from "lucide-react";
import type { Task } from "../../../store/taskStore";

// Priority to Rank mapping
function getTaskRank(priority: string): "S" | "A" | "B" | "C" | "D" {
  return (
    ({ urgent: "S", high: "A", medium: "B", low: "C" } as Record<string, any>)[
      priority
    ] ?? "D"
  );
}

function getRankStyle(rank: string) {
  return {
    S: {
      badge: "text-red-400 border-red-500/40 bg-red-500/5 shadow-[0_0_8px_rgba(255,100,100,0.2)]",
      text: "text-red-400",
    },
    A: {
      badge: "text-amber-400 border-amber-500/40 bg-amber-500/5 shadow-[0_0_8px_rgba(255,180,70,0.2)]",
      text: "text-amber-400",
    },
    B: {
      badge: "text-sky-300 border-sky-400/40 bg-sky-400/5 shadow-[0_0_8px_rgba(79,195,247,0.2)]",
      text: "text-sky-300",
    },
    C: {
      badge: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_8px_rgba(79,230,160,0.2)]",
      text: "text-emerald-400",
    },
    D: {
      badge: "text-sky-500/50 border-sky-500/20 bg-transparent",
      text: "text-sky-500/50",
    },
  }[rank] ?? { 
    badge: "text-sky-500/50 border-sky-500/20 bg-transparent",
    text: "text-sky-500/50"
  };
}

function getStatusIcon(status: string) {
  switch(status) {
    case 'todo': return '◈';
    case 'inprogress': return '⟳';
    case 'review': return '◉';
    case 'done': return '✓';
    default: return '◈';
  }
}

export default function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    borderColor: isDragging ? 'rgba(79,195,247,0.6)' : 'rgba(79,195,247,0.2)',
  };

  const isOverdue = useMemo(() => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate).getTime() < Date.now();
  }, [task.dueDate]);

  const isDueSoon = useMemo(() => {
    if (!task.dueDate || isOverdue) return false;
    const daysLeft = Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3 && daysLeft >= 0;
  }, [task.dueDate, isOverdue]);

  const rank = getTaskRank(task.priority || "medium");
  const rankStyle = getRankStyle(rank);
  const statusIcon = getStatusIcon(task.status);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`
        relative bg-[rgba(4,18,38,0.9)] border rounded-lg p-3 
        cursor-grab active:cursor-grabbing
        transition-all duration-200
        hover:border-[rgba(79,195,247,0.4)] hover:translate-x-0.5
        group
        ${isDragging ? "shadow-2xl scale-105 rotate-1" : "shadow-lg"}
      `}

    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[rgba(79,195,247,0.2)]" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[rgba(79,195,247,0.2)]" />

      {/* Drag handle */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <GripVertical size={12} className="text-[rgba(79,195,247,0.3)]" />
      </div>

      <div className="ml-4">
        {/* Header with Rank and Title */}
        <div className="flex items-start gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs opacity-60">{statusIcon}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${rankStyle.badge}`}>
              {rank}
            </span>
          </div>
          <h4 className="flex-1 text-xs font-medium text-[#e0f7fa] leading-tight">
            {task.title}
          </h4>
        </div>

        {/* Description Preview */}
        {task.description && (
          <p className="text-[10px] text-[rgba(79,195,247,0.5)] line-clamp-2 mb-2 pl-1">
            {task.description}
          </p>
        )}

        {/* Footer with meta info */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[rgba(79,195,247,0.1)]">
          <div className="flex items-center gap-2">
            {/* Priority indicator */}
            {task.priority === "urgent" && (
              <span className="flex items-center gap-1 text-[9px] text-red-400">
                <AlertTriangle size={8} />
                CRITICAL
              </span>
            )}
            {task.priority === "high" && (
              <span className="flex items-center gap-1 text-[9px] text-amber-400">
                <AlertTriangle size={8} />
                HIGH
              </span>
            )}
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-[9px] font-mono ${
              isOverdue ? 'text-red-400' : isDueSoon ? 'text-amber-400' : 'text-[rgba(79,195,247,0.4)]'
            }`}>
              {isOverdue ? (
                <Clock size={8} />
              ) : isDueSoon ? (
                <AlertTriangle size={8} />
              ) : (
                <Calendar size={8} />
              )}
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Assignee indicator */}
        {task.assignee && (
          <div className="flex items-center gap-1 mt-2 pt-1 border-t border-[rgba(79,195,247,0.1)]">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#4fe6a0] flex items-center justify-center">
              <span className="text-[8px] font-bold text-[#0a0a0a]">
                {typeof task.assignee === 'string' ? task.assignee[0] : task.assignee.name?.[0] || 'H'}
              </span>
            </div>
            <span className="text-[9px] text-[rgba(79,195,247,0.5)]">
              {typeof task.assignee === 'string' ? task.assignee : task.assignee.name}
            </span>
          </div>
        )}
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 20px rgba(79,195,247,0.1)',
        }}
      />
    </div>
  );
}