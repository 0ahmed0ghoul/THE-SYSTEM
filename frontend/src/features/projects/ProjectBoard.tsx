// pages/ProjectBoard.tsx
import { useParams } from "react-router-dom";

export default function ProjectBoard() {
  const { id } = useParams();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Project Board - Project #{id}
      </h1>
      {/* Add your Kanban board implementation here */}
    </div>
  );
}