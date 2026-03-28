// frontend/src/features/projects/ProjectPage.tsx
import { useProjectStore } from "../../store/projectStore";
import { useState } from "react";

export default function ProjectsPage() {
  const { getUserProjects, addProject, removeProject } = useProjectStore();
  const projects = getUserProjects();

  const [name, setName] = useState("");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Projects</h1>

      <form onSubmit={(e) => { e.preventDefault(); addProject(name); setName(""); }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
          className="border p-2 mr-2"
        />
        <button className="bg-black text-white px-4 py-2 rounded">Add</button>
      </form>

      <ul className="mt-4">
        {projects.map(p => (
          <li key={p.id} className="flex justify-between border p-2 mb-2 rounded">
            {p.name}
            <button onClick={() => removeProject(p.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}