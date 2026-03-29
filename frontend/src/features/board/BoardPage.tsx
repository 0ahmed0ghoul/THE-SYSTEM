import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { useState } from "react";
import { Plus } from "lucide-react";

import { useTaskStore } from "../../store/taskStore";
import type { TaskStatus, Task } from "../../store/taskStore";
import Column from "./components/Column";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";

export default function BoardPage({ projectId = 1 }: { projectId?: number }) {
  const { getProjectTasks, updateTaskStatus, tasks, addTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filterBy, setFilterBy] = useState<'all' | 'assigned' | 'due'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>('todo');

  const projectTasks = getProjectTasks(projectId);

  const getTasksByStatus = (status: TaskStatus) =>
    projectTasks.filter((t) => t.status === status);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id as number;
    const newStatus = over.id as TaskStatus;
    const currentTask = projectTasks.find(t => t.id === taskId);

    if (currentTask && currentTask.status !== newStatus) {
      updateTaskStatus(taskId, newStatus);
    }
  };

  const handleDragStart = (event: any) => {
    const task = projectTasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleAddTask = (status: TaskStatus) => {
    setSelectedStatus(status);
    setIsAddingTask(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    addTask(projectId, taskData.title || "", taskData.description, taskData.priority);
    setIsAddingTask(false);
  };

  type ColumnType = {
    id: string;
    title: string;
    status: TaskStatus;
    icon: string;
  };
  
  const columns = [
    { id: "todo", title: "To Do", status: "todo" as TaskStatus, icon: "📋" },
    { id: "inprogress", title: "In Progress", status: "inprogress" as TaskStatus, icon: "🔄" },
    { id: "done", title: "Done", status: "done" as TaskStatus, icon: "✅" },
  ];

  const getColumnStats = (status: TaskStatus) => {
    const tasks = getTasksByStatus(status);
    const total = tasks.length;
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length;
    return { total, highPriority, overdue };
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Board</h2>
          <p className="text-gray-500 mt-1">Drag and drop tasks to update their status</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Buttons */}
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setFilterBy('all')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                filterBy === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilterBy('assigned')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                filterBy === 'assigned' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Assigned
            </button>
            <button
              onClick={() => setFilterBy('due')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                filterBy === 'due' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Due Today
            </button>
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => handleAddTask('todo')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* Column Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {columns.map((column: { id: string; title: string; status: TaskStatus; icon: string }) => {
          const stats = getColumnStats(column.status);
          return (
            <div key={column.id} className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{column.icon}</span>
                  <span className="font-semibold text-gray-900">{column.title}</span>
                </div>
                <span className="text-2xl font-bold text-gray-700">{stats.total}</span>
              </div>
              <div className="flex gap-3 mt-2 text-xs">
                {stats.highPriority > 0 && <span className="text-red-600">🔥 {stats.highPriority} high priority</span>}
                {stats.overdue > 0 && <span className="text-orange-600">⚠️ {stats.overdue} overdue</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-nowrap items-start gap-6 overflow-x-auto pb-4 min-h-[600px] w-full">
          {columns.map((column: ColumnType) => (
            <Column
              key={column.id}
              title={column.title}
              status={column.status}
              tasks={getTasksByStatus(column.status)}
              filterBy={filterBy}
              onAddTask={handleAddTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      <TaskModal
        isOpen={isAddingTask}
        onClose={() => setIsAddingTask(false)}
        onSave={handleSaveTask}
        status={selectedStatus}
      />
    </div>
  );
}