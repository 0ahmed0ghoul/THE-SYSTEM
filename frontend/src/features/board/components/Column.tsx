// frontend/src/features/board/components/Column.tsx
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "../../../store/taskStore";

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  filterBy: string;
  onAddTask: (status: TaskStatus) => void;
}

const STATUS_CONFIG = {
  todo: {
    borderColor: "rgba(79,195,247,0.3)",
    icon: "◈",
    glowColor: "rgba(79,195,247,0.15)",
  },
  inprogress: {
    borderColor: "rgba(255,213,79,0.3)",
    icon: "⟳",
    glowColor: "rgba(255,213,79,0.15)",
  },
  review: {
    borderColor: "rgba(79,230,160,0.3)",
    icon: "◉",
    glowColor: "rgba(79,230,160,0.15)",
  },
  done: {
    borderColor: "rgba(79,195,247,0.15)",
    icon: "✓",
    glowColor: "rgba(79,195,247,0.08)",
  },
};

export default function Column({ title, status, tasks, onAddTask }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex-shrink-0 w-80 transition-all duration-200 hover:translate-y-[-2px]">
      <div 
        className="bg-[rgba(4,18,38,0.6)] border rounded-lg overflow-hidden transition-all duration-300"
        style={{ 
          borderColor: config.borderColor,
          borderTopWidth: '2px',
          boxShadow: `0 0 20px ${config.glowColor}`
        }}
      >
        {/* Column Header */}
        <div className="px-3 py-2 border-b border-[rgba(79,195,247,0.1)] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-60">{config.icon}</span>
            <span className="text-[10px] font-bold tracking-[2px] text-[rgba(79,195,247,0.6)]">
              {title}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 bg-[rgba(79,195,247,0.1)] rounded text-[rgba(79,195,247,0.5)] font-mono">
              {tasks.length}
            </span>
          </div>
          <button
            onClick={() => onAddTask(status)}
            className="p-1 rounded hover:bg-[rgba(79,195,247,0.1)] transition-all duration-200 hover:scale-110"
          >
            <Plus size={12} className="text-[rgba(79,195,247,0.5)] hover:text-[#4fc3f7]" />
          </button>
        </div>

        {/* Tasks Container */}
        <div
          ref={setNodeRef}
          className="p-2 min-h-[400px] max-h-[600px] overflow-y-auto space-y-2 custom-scrollbar"
        >
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
          
          {tasks.length === 0 && (
            <div className="text-center py-8">
              <div className="text-[rgba(79,195,247,0.2)] text-2xl mb-2 animate-pulse">
                {config.icon}
              </div>
              <p className="text-[10px] text-[rgba(79,195,247,0.3)] tracking-wider">NO QUESTS</p>
              <button
                onClick={() => onAddTask(status)}
                className="mt-2 text-[9px] text-[rgba(79,195,247,0.4)] hover:text-[rgba(79,195,247,0.6)] transition-all duration-200 hover:tracking-wider"
              >
                + ADD QUEST
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(79, 195, 247, 0.05);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(79, 195, 247, 0.3);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 195, 247, 0.5);
        }
      `}</style>
    </div>
  );
}