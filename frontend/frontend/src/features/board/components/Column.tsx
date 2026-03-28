import { useDroppable } from "@dnd-kit/core";

export default function Column({
  title,
  tasks,
}: any) {
  const { setNodeRef } = useDroppable({
    id: title.toLowerCase().replace(" ", "-"),
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-200 p-3 rounded w-80"
    >
      <h2 className="font-bold mb-3">{title}</h2>

      {tasks.map((task: any) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}