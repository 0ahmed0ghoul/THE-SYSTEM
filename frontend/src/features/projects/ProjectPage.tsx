import { useProjects } from "./hooks/useProjects";
import ProjectCard from "./components/ProjectCard";
import CreateProjectModal from "./components/CreateProjectModal";

export default function ProjectsPage() {
  const { projects, isLoading, createProject, isCreating } =
    useProjects();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>

        <CreateProjectModal
          onCreate={createProject}
          loading={isCreating}
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}