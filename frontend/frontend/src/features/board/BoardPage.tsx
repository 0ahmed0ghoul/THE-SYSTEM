import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./components/Column";
import { initialTasks } from "./data";
import type { Task, Status } from "./types";

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const getTasksByStatus = (status: Status) =>
    tasks.filter((t) => t.status === status);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id as Status;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4">
        <Column
          title="Todo"
          tasks={getTasksByStatus("todo")}
        />
        <Column
          title="In Progress"
          tasks={getTasksByStatus("in-progress")}
        />
        <Column
          title="Done"
          tasks={getTasksByStatus("done")}
        />
      </div>
    </DndContext>
  );
}