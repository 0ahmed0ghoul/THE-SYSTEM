import type { Project } from "../types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="font-bold text-lg">{project.name}</h3>
      <p className="text-sm text-gray-600">
        {project.description || "No description"}
      </p>
    </div>
  );
}