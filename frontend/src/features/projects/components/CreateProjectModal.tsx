// frontend/src/features/projects/components/CreateProjectModal.tsx
import { useState } from "react";
import { X, Calendar, Users, Tag, Flag, Layers, Clock, AlertCircle, Plus, ChevronDown, User, Target, Briefcase, DollarSign, Eye, Shield } from "lucide-react";
import { useProjectStore } from "../../../store/projectStore";

export default function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const addProject = useProjectStore((state) => state.addProject);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
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

  const sections = [
    { id: "basic", label: "GATE IDENTITY", icon: Layers },
    { id: "timeline", label: "TEMPORAL DATA", icon: Calendar },
    { id: "team", label: "HUNTER ASSIGNMENT", icon: Users },
    { id: "categorization", label: "CLASSIFICATION", icon: Tag },
    { id: "goals", label: "OBJECTIVES", icon: Target },
    { id: "progress", label: "STABILITY METRICS", icon: Flag },
  ];

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "text-red-400 border-red-500/40 bg-red-500/5",
      high: "text-amber-400 border-amber-500/40 bg-amber-500/5",
      medium: "text-sky-300 border-sky-400/40 bg-sky-400/5",
      low: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const handleSubmit = async () => {
    if (!form.name) return;
    
    setLoading(true);
    
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="relative bg-[rgba(4,18,38,0.98)] border border-[rgba(79,195,247,0.3)] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-[fade-in-up_0.3s_ease]">
          {/* Modal corner accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[rgba(79,195,247,0.3)]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[rgba(79,195,247,0.3)]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[rgba(79,195,247,0.3)]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[rgba(79,195,247,0.3)]" />

          {/* Header */}
          <div className="sticky top-0 bg-[rgba(4,18,38,0.98)] border-b border-[rgba(79,195,247,0.15)] px-6 py-4 flex justify-between items-center z-10 backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-1 h-6 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
                <h2 className="font-['Cinzel',serif] text-xl font-bold tracking-[2px] bg-gradient-to-r from-[#e0f7fa] to-[#4fc3f7] bg-clip-text text-transparent">
                  REGISTER NEW GATE
                </h2>
              </div>
              <p className="text-[10px] tracking-[2px] text-[rgba(79,195,247,0.4)] ml-4">
                ENTER GATE MANIFEST DATA • ALL FIELDS CLASSIFIED
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-[rgba(79,195,247,0.1)] transition-colors rounded-sm"
            >
              <X className="w-5 h-5 text-[rgba(79,195,247,0.5)]" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 pt-4 border-b border-[rgba(79,195,247,0.1)]">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-4 py-2 text-[10px] font-semibold tracking-[2px] uppercase transition-all duration-200 whitespace-nowrap ${
                      activeSection === section.id
                        ? "text-[#4fc3f7] border-b-2 border-[#4fc3f7]"
                        : "text-[rgba(79,195,247,0.4)] hover:text-[rgba(79,195,247,0.7)]"
                    }`}
                  >
                    <Icon size={12} className="inline mr-2" />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information Section */}
            {activeSection === "basic" && (
              <div className="space-y-4 animate-[fade-in-up_0.3s_ease]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      GATE DESIGNATION *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter gate name / designation"
                      className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
                      autoFocus
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      COORDINATES / DESCRIPTION
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Gate details, threats, environmental conditions, or mission objectives..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      VISIBILITY
                    </label>
                    <select
                      value={form.visibility}
                      onChange={(e) => setForm({ ...form, visibility: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                    >
                      <option value="private">Private Gate</option>
                      <option value="public">Public Gate</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.requiresApproval}
                        onChange={(e) => setForm({ ...form, requiresApproval: e.target.checked })}
                        className="w-4 h-4 border border-[rgba(79,195,247,0.3)] bg-transparent focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)]">
                        Requires Hunter Approval
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Section */}
            {activeSection === "timeline" && (
              <div className="space-y-4 animate-[fade-in-up_0.3s_ease]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      GATE OPENING DATE
                    </label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      GATE CLOSURE DEADLINE *
                    </label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      ESTIMATED DURATION (HOURS)
                    </label>
                    <input
                      type="number"
                      value={form.estimatedHours}
                      onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })}
                      placeholder="e.g., 120"
                      className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      GATE PRIORITY RANK
                    </label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                      className={`w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border ${getPriorityColor(form.priority)} focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-sm`}
                    >
                      <option value="low">C-Rank Gate</option>
                      <option value="medium">B-Rank Gate</option>
                      <option value="high">A-Rank Gate</option>
                      <option value="urgent">S-Rank Gate</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Team & Client Section */}
            {activeSection === "team" && (
              <div className="space-y-4 animate-[fade-in-up_0.3s_ease]">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      HUNTER LEAD
                    </label>
                    <input
                      type="text"
                      value={form.projectLead}
                      onChange={(e) => setForm({ ...form, projectLead: e.target.value })}
                      placeholder="Lead Hunter designation"
                      className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      CLIENT / SPONSOR
                    </label>
                    <input
                      type="text"
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      placeholder="Guild or sponsor name"
                      className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      HUNTER TEAM
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={teamMemberInput}
                        onChange={(e) => setTeamMemberInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
                        placeholder="Enter hunter name"
                        className="flex-1 px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
                      />
                      <button
                        onClick={addTeamMember}
                        className="px-4 py-2 border border-[rgba(79,195,247,0.3)] hover:border-[#4fc3f7] text-[rgba(79,195,247,0.5)] hover:text-[#4fc3f7] transition-all text-xs"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.teamMembers.map((member) => (
                        <span
                          key={member}
                          className="inline-flex items-center gap-2 px-2 py-1 text-[10px] tracking-[1px] border border-[rgba(79,195,247,0.2)] bg-[rgba(79,195,247,0.05)] text-[rgba(79,195,247,0.7)]"
                        >
                          <User size={10} />
                          {member}
                          <button
                            onClick={() => removeTeamMember(member)}
                            className="hover:text-red-400"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Categorization Section */}
            {activeSection === "categorization" && (
              <div className="space-y-4 animate-[fade-in-up_0.3s_ease]">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      GATE CATEGORY
                    </label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g., Combat, Exploration, Resource"
                      className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      GATE TAGS
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Enter classification tag"
                        className="flex-1 px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 border border-[rgba(79,195,247,0.3)] hover:border-[#4fc3f7] text-[rgba(79,195,247,0.5)] hover:text-[#4fc3f7] transition-all text-xs"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 px-2 py-1 text-[10px] tracking-[1px] border border-[rgba(79,195,247,0.2)] bg-[rgba(79,195,247,0.05)] text-[rgba(79,195,247,0.7)]"
                        >
                          <Tag size={10} />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-400"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                      BUDGET ALLOCATION
                    </label>
                    <input
                      type="number"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      placeholder="Gate operation budget"
                      className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Goals Section */}
            {activeSection === "goals" && (
              <div className="space-y-4 animate-[fade-in-up_0.3s_ease]">
                <div>
                  <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                    MISSION OBJECTIVES
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                      placeholder="Enter objective"
                      className="flex-1 px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
                    />
                    <button
                      onClick={addGoal}
                      className="px-4 py-2 border border-[rgba(79,195,247,0.3)] hover:border-[#4fc3f7] text-[rgba(79,195,247,0.5)] hover:text-[#4fc3f7] transition-all text-xs"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.goals.map((goal) => (
                      <div
                        key={goal}
                        className="flex items-center justify-between px-3 py-2 border border-[rgba(79,195,247,0.15)] bg-[rgba(79,195,247,0.02)]"
                      >
                        <span className="text-xs text-[rgba(79,195,247,0.7)] flex items-center gap-2">
                          <Target size={12} />
                          {goal}
                        </span>
                        <button
                          onClick={() => removeGoal(goal)}
                          className="hover:text-red-400"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Progress Section */}
            {activeSection === "progress" && (
              <div className="space-y-4 animate-[fade-in-up_0.3s_ease]">
                <div>
                  <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                    INITIAL GATE STABILITY
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.progress}
                    onChange={(e) => setForm({ ...form, progress: parseInt(e.target.value) })}
                    className="w-full h-1 bg-[rgba(79,195,247,0.08)] appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4fc3f7] [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.3)]">0%</span>
                    <span className="text-sm font-['Cinzel',serif] text-[#4fc3f7] tracking-[2px]">
                      {form.progress}% STABLE
                    </span>
                    <span className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.3)]">100%</span>
                  </div>
                  <div className="mt-3 h-[2px] bg-[rgba(79,195,247,0.08)] overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300"
                      style={{ 
                        width: `${form.progress}%`, 
                        background: `linear-gradient(90deg, #4fc3f7, ${form.progress > 60 ? '#4fe6a0' : form.progress > 30 ? '#ffb347' : '#ff6b6b'})`,
                        boxShadow: `0 0 6px ${form.progress > 60 ? '#4fe6a0' : form.progress > 30 ? '#ffb347' : '#ff6b6b'}`
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                    GATE STATUS
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                  >
                    <option value="planning">Planning Phase</option>
                    <option value="active">Active Gate</option>
                    <option value="onHold">On Hold</option>
                    <option value="completed">Cleared</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 bg-[rgba(4,18,38,0.98)] border-t border-[rgba(79,195,247,0.15)] px-6 py-4 flex gap-3 backdrop-blur-sm">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-[rgba(79,195,247,0.2)] text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.5)] transition-all duration-200"
            >
              Cancel Registration
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !form.name || !form.dueDate}
              className="flex-1 px-4 py-2.5 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[10px] font-semibold tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "REGISTERING..." : "REGISTER GATE"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}