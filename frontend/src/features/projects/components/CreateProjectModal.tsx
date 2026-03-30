// frontend/src/features/projects/components/CreateProjectModal.tsx
import { useState } from "react";
import { X, Calendar, Users, Tag, Flag, Layers, Clock, AlertCircle } from "lucide-react";
import { useProjectStore } from "../../../store/projectStore";


export default function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const addProject = useProjectStore((state) => state.addProject);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
    priority: "medium" as const,
    status: "planning" as const,
    category: "",
    projectLead: "",
    teamMembers: [] as string[],
    estimatedHours: "",
    clientName: "",
    budget: "",
    tags: [] as string[],
    goals: [] as string[],
    visibility: "private" as const,
    requiresApproval: false,
    progress: 0,
  });

  const [tagInput, setTagInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [teamMemberInput, setTeamMemberInput] = useState("");

  const handleSubmit = async () => {
    if (!form.name) return;
    
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      addProject({
        name: form.name,
        description: form.description,
        startDate: form.startDate,
        dueDate: form.dueDate,
        priority: form.priority,
        status: form.status,
        category: form.category,
        progress: form.progress,
        estimatedHours: form.estimatedHours ? parseInt(form.estimatedHours) : undefined,
        budget: form.budget ? parseInt(form.budget) : undefined,
        projectLead: form.projectLead,
        clientName: form.clientName,
        teamMembers: form.teamMembers,
        tags: form.tags,
        goals: form.goals,
        visibility: form.visibility,
        requiresApproval: form.requiresApproval,
      });
      
      setLoading(false);
      onClose();
    }, 500);
  };

  const addTag = () => {
    if (tagInput && !form.tags.includes(tagInput)) {
      setForm({ ...form, tags: [...form.tags, tagInput] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  const addGoal = () => {
    if (goalInput && !form.goals.includes(goalInput)) {
      setForm({ ...form, goals: [...form.goals, goalInput] });
      setGoalInput("");
    }
  };

  const removeGoal = (goal: string) => {
    setForm({ ...form, goals: form.goals.filter(g => g !== goal) });
  };

  const addTeamMember = () => {
    if (teamMemberInput && !form.teamMembers.includes(teamMemberInput)) {
      setForm({ ...form, teamMembers: [...form.teamMembers, teamMemberInput] });
      setTeamMemberInput("");
    }
  };

  const removeTeamMember = (member: string) => {
    setForm({ ...form, teamMembers: form.teamMembers.filter(m => m !== member) });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Project</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Fill in all the details to manage your project effectively</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Form Content - Same as before */}
          <div className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5" /> Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Mobile App Development"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 
                    bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    text-gray-900 dark:text-white"
                    autoFocus
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the project goals, scope, and key deliverables..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 
                    bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Timeline
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 
                    bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500
                    text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 
                    bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500
                    text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={form.estimatedHours}
                    onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })}
                    placeholder="e.g., 120"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 
                    bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500
                    text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 
                    bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500
                    text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Rest of the form sections remain the same... */}
            {/* Team & Client Section, Categorization Section, Goals & Budget Section, etc. */}
            
            {/* Progress Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Flag className="w-5 h-5" /> Progress
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Initial Progress (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={(e) => setForm({ ...form, progress: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400 dark:text-slate-500">0%</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    {form.progress}%
                  </span>
                  <span className="text-xs text-gray-400 dark:text-slate-500">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-6 py-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg
              text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 
              transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !form.name || !form.dueDate}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg 
              font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              shadow-sm"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}