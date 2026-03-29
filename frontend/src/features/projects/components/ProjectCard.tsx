import { ArrowUpRight } from "lucide-react";
import type { Project } from "../types";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const { id, name } = project;
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3
        onClick={() => navigate(`/projects/${id}`)} // This line is already there
        className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        {name}
      </h3>
      // Also update the "View Board" button:
      <button
        onClick={() => navigate(`/projects/${id}`)} // Change from /board to /projects/${id}
        className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
      >
        View Board
        <ArrowUpRight size={12} />
      </button>
    </div>
  );
}
