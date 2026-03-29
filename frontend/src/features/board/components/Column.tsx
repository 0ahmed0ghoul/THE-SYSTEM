import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "../../../store/taskStore";
import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import TaskModal from "./TaskModal";

export default function Column({
  title,
  status,
  tasks,
  filterBy,
  onAddTask,
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  filterBy: "all" | "assigned" | "due";
  onAddTask: (status: TaskStatus) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter tasks based on filterBy prop
  const filteredTasks = tasks.filter(task => {
    if (filterBy === 'assigned') {
      // Add your assigned filter logic here
      return true;
    }
    if (filterBy === 'due') {
      // Add your due today filter logic here
      return task.dueDate === new Date().toISOString().split('T')[0];
    }
    return true;
  });

  const taskStats = {
    total: filteredTasks.length,
    highPriority: filteredTasks.filter((t) => t.priority === "high").length,
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    onAddTask(status);
    // The actual task creation will be handled by the parent
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className={`
          flex-shrink-0 w-80 rounded-2xl 
          bg-white/70 backdrop-blur-xl border border-gray-100
          shadow-sm transition-all duration-300
          ${isOver ? "ring-2 ring-black/10 scale-[1.01]" : ""}
        `}
      >
        {/* HEADER */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span>{taskStats.total} tasks</span>
              {taskStats.highPriority > 0 && (
                <>
                  <span>•</span>
                  <span className="text-red-500 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {taskStats.highPriority}
                  </span>
                </>
              )}
            </div>
          </div>

          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
        </div>

        {/* TASKS */}
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

        {/* ADD TASK BUTTON */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleAddClick}
            className="w-full flex items-center justify-center gap-2 
            text-sm text-gray-400 py-2 rounded-lg 
            hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <Plus size={14} />
            Add task
          </button>
        </div>

        {/* FOOTER */}
        {taskStats.total > 0 && (
          <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
            {status === "todo" && (
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {taskStats.total}
              </span>
            )}
            {status === "inprogress" && (
              <span className="flex items-center gap-1">
                <AlertCircle size={10} />
                In progress
              </span>
            )}
            {status === "done" && (
              <span className="flex items-center gap-1">
                <CheckCircle2 size={10} />
                Done
              </span>
            )}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveTask}
        status={status}
      />
    </>
  );
}