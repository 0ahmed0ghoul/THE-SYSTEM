
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore, type Project } from "../store/projectStore";
import {
  Plus,
  Trash2,
  Edit3,
  AlertCircle,
  X,
  MoreVertical,
  ArrowRight,
  FolderOpen,
} from "lucide-react";

// ── Project Form Component ───────────────────────────────────────────────────
function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project?: Project;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: project?.name || "",
    description: project?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-[#0a1628] border border-[rgba(79,195,247,0.2)] rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(79,195,247,0.1)]">
          <h3 className="text-lg font-semibold text-[#e0f7fa] tracking-wide">
            {project ? "EDIT PROJECT" : "NEW PROJECT"}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={18} className="text-[rgba(79,195,247,0.5)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-medium text-[rgba(79,195,247,0.6)] uppercase tracking-wider mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name..."
              className="w-full px-4 py-3 bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.2)] rounded-lg text-[#e0f7fa] placeholder:text-[rgba(79,195,247,0.3)] focus:outline-none focus:border-[#4fc3f7] transition-colors"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[rgba(79,195,247,0.6)] uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add project details..."
              rows={3}
              className="w-full px-4 py-3 bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.2)] rounded-lg text-[#e0f7fa] placeholder:text-[rgba(79,195,247,0.3)] focus:outline-none focus:border-[#4fc3f7] transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-[rgba(79,195,247,0.2)] text-[rgba(79,195,247,0.6)] rounded-lg hover:bg-[rgba(79,195,247,0.05)] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#4fc3f7] text-[#0a1628] rounded-lg hover:bg-[#3db8ed] transition-colors font-semibold"
            >
              {project ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirmation ──────────────────────────────────────────────────────
function DeleteConfirm({
  project,
  onConfirm,
  onCancel,
}: {
  project: Project;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-[#0a1628] border border-[rgba(255,107,107,0.3)] rounded-lg shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[rgba(255,107,107,0.1)] flex items-center justify-center">
            <AlertCircle size={20} className="text-[#ff6b6b]" />
          </div>
          <h3 className="text-lg font-semibold text-[#e0f7fa]">Delete Project?</h3>
        </div>
        <p className="text-[rgba(224,247,250,0.6)] mb-6">
          Are you sure you want to delete <strong className="text-[#e0f7fa]">{project.name}</strong>? This will also remove all associated tasks.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-[rgba(79,195,247,0.2)] text-[rgba(79,195,247,0.6)] rounded-lg hover:bg-[rgba(79,195,247,0.05)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-[#ff6b6b] text-white rounded-lg hover:bg-[#ff5252] transition-colors font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onEdit,
  onDelete,
  onViewBoard,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onViewBoard: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative bg-linear-to-br from-[rgba(79,195,247,0.1)] to-[rgba(79,230,160,0.05)] border border-[rgba(79,195,247,0.2)] rounded-lg p-6 hover:border-[rgba(79,195,247,0.4)] transition-all hover:shadow-lg hover:shadow-[rgba(79,195,247,0.1)]">
      {/* Menu Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 hover:bg-[rgba(79,195,247,0.1)] rounded-lg transition-colors text-[rgba(79,195,247,0.5)] hover:text-[#4fc3f7]"
        >
          <MoreVertical size={18} />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#0a1628] border border-[rgba(79,195,247,0.2)] rounded-lg shadow-lg z-10 overflow-hidden">
            <button
              onClick={() => {
                onViewBoard();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-[#4fc3f7] font-medium hover:bg-[rgba(79,195,247,0.1)] transition-colors flex items-center gap-2 border-b border-[rgba(79,195,247,0.1)]"
            >
              <ArrowRight size={15} />
              View Board
            </button>
            <button
              onClick={() => {
                onEdit();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-[rgba(79,195,247,0.6)] hover:text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.05)] transition-colors flex items-center gap-2 border-b border-[rgba(79,195,247,0.1)]"
            >
              <Edit3 size={15} />
              Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-[#ff6b6b] hover:bg-[rgba(255,107,107,0.05)] transition-colors flex items-center gap-2"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-[rgba(79,195,247,0.1)] flex items-center justify-center mb-4">
        <FolderOpen size={24} className="text-[#4fc3f7]" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-[#e0f7fa] mb-2">{project.name}</h3>
      {project.description && (
        <p className="text-sm text-[rgba(224,247,250,0.5)] line-clamp-2 mb-4">
          {project.description}
        </p>
      )}

      {/* Open Board Button */}
      <button
        onClick={onViewBoard}
        className="w-full px-4 py-2.5 bg-[rgba(79,195,247,0.1)] border border-[rgba(79,195,247,0.3)] text-[#4fc3f7] rounded-lg hover:bg-[rgba(79,195,247,0.2)] transition-colors font-medium flex items-center justify-center gap-2 mt-4 group"
      >
        <span>Open Board</span>
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, loadProjects, addProject, updateProject, removeProject } = useProjectStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load data
  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  // Filter projects
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveProject = (data: Partial<Project>) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
    } else {
      addProject(data as Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">);
    }
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = () => {
    if (deletingProject) {
      removeProject(deletingProject.id);
      setDeletingProject(null);
    }
  };

  const handleViewBoard = (projectId: string | number) => {
    navigate(`/projects/${projectId}/board`);
  };

  return (
    <div className="min-h-screen bg-[#020c1a] text-[#e0f7fa] font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(79,195,247,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(79,230,160,0.05)_0%,transparent_40%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(79,195,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.5) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#e0f7fa] mb-1">
              Projects
            </h1>
            <p className="text-[rgba(79,195,247,0.5)] text-sm">
              Create and manage your projects
            </p>
          </div>
          <button
            onClick={() => {
              setEditingProject(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4fc3f7] text-[#0a1628] font-semibold rounded-lg hover:bg-[#3db8ed] transition-colors shadow-lg shadow-[rgba(79,195,247,0.2)]"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center px-4 py-3 bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.2)] rounded-lg">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#e0f7fa] placeholder:text-[rgba(79,195,247,0.4)] focus:outline-none"
          />
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.1)] flex items-center justify-center">
              <FolderOpen size={32} className="text-[rgba(79,195,247,0.3)]" />
            </div>
            <h3 className="text-lg font-medium text-[#e0f7fa] mb-2">
              {searchQuery ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-[rgba(79,195,247,0.5)] mb-6">
              {searchQuery ? "Try adjusting your search" : "Create your first project to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsFormOpen(true);
                }}
                className="px-5 py-2.5 border border-[rgba(79,195,247,0.3)] text-[#4fc3f7] rounded-lg hover:bg-[rgba(79,195,247,0.1)] transition-colors"
              >
                Create your first project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => {
                  setEditingProject(project);
                  setIsFormOpen(true);
                }}
                onDelete={() => setDeletingProject(project)}
                onViewBoard={() => handleViewBoard(project.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isFormOpen && (
        <ProjectForm
          project={editingProject || undefined}
          onSave={handleSaveProject}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProject(null);
          }}
        />
      )}

      {deletingProject && (
        <DeleteConfirm
          project={deletingProject}
          onConfirm={handleDeleteProject}
          onCancel={() => setDeletingProject(null)}
        />
      )}
    </div>
  );
}
