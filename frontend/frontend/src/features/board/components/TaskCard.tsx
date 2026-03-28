import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../types";

export default function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-white p-3 rounded shadow mb-2 cursor-grab"
    >
      {task.title}
    </div>
  );
}