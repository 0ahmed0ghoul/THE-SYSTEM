// frontend/src/pages/CreateProjectPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, Calendar, Users, Tag, Flag, Layers, Clock, AlertCircle, 
  Plus, User, Target, Briefcase, DollarSign, Eye, Shield,
  ChevronRight, ChevronLeft, CheckCircle, ArrowLeft
} from "lucide-react";
import { useProjectStore } from "../store/projectStore";

type Step = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
};

const steps: Step[] = [
  { id: "basic", title: "GATE IDENTITY", subtitle: "Basic information & designation", icon: Layers },
  { id: "timeline", title: "TEMPORAL DATA", subtitle: "Schedule & priority ranking", icon: Calendar },
  { id: "team", title: "HUNTER ASSIGNMENT", subtitle: "Team composition & leadership", icon: Users },
  { id: "categorization", title: "CLASSIFICATION", subtitle: "Tags, category & budget", icon: Tag },
  { id: "goals", title: "OBJECTIVES", subtitle: "Mission goals & targets", icon: Target },
  { id: "progress", title: "STABILITY METRICS", subtitle: "Initial status & progress", icon: Flag },
];

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const addProject = useProjectStore((state) => state.addProject);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Essential fields
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
    priority: "medium" as const,
    status: "planning" as const,
    progress: 0,
    visibility: "private" as const,
    requiresApproval: false,
  });

  // Extended fields
  const [extendedForm, setExtendedForm] = useState({
    category: "",
    projectLead: "",
    teamMembers: [] as string[],
    estimatedHours: "",
    clientName: "",
    budget: "",
    tags: [] as string[],
    goals: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [teamMemberInput, setTeamMemberInput] = useState("");

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "text-red-400 border-red-500/40 bg-red-500/5",
      high: "text-amber-400 border-amber-500/40 bg-amber-500/5",
      medium: "text-sky-300 border-sky-400/40 bg-sky-400/5",
      low: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!form.name) return;
    
    setLoading(true);
    
    await addProject({
      name: form.name,
      description: form.description,
      startDate: form.startDate,
      dueDate: form.dueDate,
      priority: form.priority,
      status: form.status,
      progress: form.progress,
      visibility: form.visibility,
      requiresApproval: form.requiresApproval,
    });
    
    setLoading(false);
    navigate('/projects');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return form.name.trim().length > 0;
      case 1: return form.dueDate.trim().length > 0;
      default: return true;
    }
  };

  const addTag = () => {
    if (tagInput && !extendedForm.tags.includes(tagInput)) {
      setExtendedForm({ ...extendedForm, tags: [...extendedForm.tags, tagInput] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setExtendedForm({ ...extendedForm, tags: extendedForm.tags.filter(t => t !== tag) });
  };

  const addGoal = () => {
    if (goalInput && !extendedForm.goals.includes(goalInput)) {
      setExtendedForm({ ...extendedForm, goals: [...extendedForm.goals, goalInput] });
      setGoalInput("");
    }
  };

  const removeGoal = (goal: string) => {
    setExtendedForm({ ...extendedForm, goals: extendedForm.goals.filter(g => g !== goal) });
  };

  const addTeamMember = () => {
    if (teamMemberInput && !extendedForm.teamMembers.includes(teamMemberInput)) {
      setExtendedForm({ ...extendedForm, teamMembers: [...extendedForm.teamMembers, teamMemberInput] });
      setTeamMemberInput("");
    }
  };

  const removeTeamMember = (member: string) => {
    setExtendedForm({ ...extendedForm, teamMembers: extendedForm.teamMembers.filter(m => m !== member) });
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case "basic":
        return (
          <div className="space-y-6">
            <div>
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

            <div>
              <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                COORDINATES / DESCRIPTION
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Gate details, threats, environmental conditions, or mission objectives..."
                rows={4}
                className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.requiresApproval}
                    onChange={(e) => setForm({ ...form, requiresApproval: e.target.checked })}
                    className="w-4 h-4 border border-[rgba(79,195,247,0.3)] bg-transparent focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)]">
                    Requires Approval
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case "timeline":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                  ESTIMATED DURATION (HOURS)
                </label>
                <input
                  type="number"
                  value={extendedForm.estimatedHours}
                  onChange={(e) => setExtendedForm({ ...extendedForm, estimatedHours: e.target.value })}
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
        );

      case "team":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                HUNTER LEAD
              </label>
              <input
                type="text"
                value={extendedForm.projectLead}
                onChange={(e) => setExtendedForm({ ...extendedForm, projectLead: e.target.value })}
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
                value={extendedForm.clientName}
                onChange={(e) => setExtendedForm({ ...extendedForm, clientName: e.target.value })}
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
                {extendedForm.teamMembers.map((member) => (
                  <span
                    key={member}
                    className="inline-flex items-center gap-2 px-2 py-1 text-[10px] tracking-[1px] border border-[rgba(79,195,247,0.2)] bg-[rgba(79,195,247,0.05)] text-[rgba(79,195,247,0.7)]"
                  >
                    <User size={10} />
                    {member}
                    <button onClick={() => removeTeamMember(member)} className="hover:text-red-400">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case "categorization":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">
                GATE CATEGORY
              </label>
              <input
                type="text"
                value={extendedForm.category}
                onChange={(e) => setExtendedForm({ ...extendedForm, category: e.target.value })}
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
                {extendedForm.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-2 py-1 text-[10px] tracking-[1px] border border-[rgba(79,195,247,0.2)] bg-[rgba(79,195,247,0.05)] text-[rgba(79,195,247,0.7)]"
                  >
                    <Tag size={10} />
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-400">
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
                value={extendedForm.budget}
                onChange={(e) => setExtendedForm({ ...extendedForm, budget: e.target.value })}
                placeholder="Gate operation budget"
                className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
              />
            </div>
          </div>
        );

      case "goals":
        return (
          <div className="space-y-6">
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
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {extendedForm.goals.map((goal) => (
                  <div
                    key={goal}
                    className="flex items-center justify-between px-3 py-2 border border-[rgba(79,195,247,0.15)] bg-[rgba(79,195,247,0.02)]"
                  >
                    <span className="text-xs text-[rgba(79,195,247,0.7)] flex items-center gap-2">
                      <Target size={12} />
                      {goal}
                    </span>
                    <button onClick={() => removeGoal(goal)} className="hover:text-red-400">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "progress":
        return (
          <div className="space-y-8">
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
        );

      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep];
  const CurrentIcon = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;
  const isValid = isStepValid();

  return (
    <div className="min-h-screen" >
      <style>{`
        :root {
          --sys-blue: #4fc3f7;
          --sys-gold: #ffd54f;
          --sys-green: #4fe6a0;
          --sys-red: #ff6b6b;
          --sys-amber: #ffb347;
          --sys-panel: rgba(4,18,38,0.98);
          --sys-border: rgba(79,195,247,0.18);
          --sys-bg: #0a0e27;
        }

        .sys-create-page {
          position: relative;
          min-height: 100vh;
        }

        .sys-create-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(transparent, transparent 2px, rgba(79,195,247,0.02) 2px, rgba(79,195,247,0.02) 4px);
          pointer-events: none;
        }

        .sys-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
        }

        .sys-orb-1 {
          top: -200px;
          right: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--sys-blue), transparent);
        }

        .sys-orb-2 {
          bottom: -200px;
          left: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--sys-gold), transparent);
        }

        .sys-scanlines {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0) 0px,
            rgba(0, 0, 0, 0) 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          );
          pointer-events: none;
          z-index: 1;
        }

        .sys-create-container {
          position: relative;
          z-index: 2;
        }

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

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>

      <div className="sys-create-page">
        <div className="sys-orb sys-orb-1" />
        <div className="sys-orb sys-orb-2" />
        <div className="sys-scanlines" />

        <div className="sys-create-container max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8" style={{ animation: "fade-in-up 0.4s ease both" }}>
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 text-[rgba(79,195,247,0.5)] hover:text-[#4fc3f7] transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              <span className="text-[10px] tracking-[2px] uppercase">Back to Gates</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
              <div>
                <h1 className="font-['Cinzel',serif] text-2xl font-bold tracking-[3px] bg-gradient-to-r from-[#e0f7fa] to-[#4fc3f7] bg-clip-text text-transparent">
                  REGISTER NEW GATE
                </h1>
                <p className="text-[11px] tracking-[2px] text-[rgba(79,195,247,0.4)] mt-1">
                  STEP {currentStep + 1} OF {steps.length} · {currentStepData.title}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-6 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.1)] p-4" style={{ animation: "fade-in-up 0.4s 0.06s ease both" }}>
            <div className="flex items-center gap-2">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isCurrent = idx === currentStep;
                const StepIcon = step.icon;
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <button
                      onClick={() => setCurrentStep(idx)}
                      className={`flex items-center gap-2 px-3 py-2 transition-all ${
                        isCurrent ? 'text-[#4fc3f7]' : 'text-[rgba(79,195,247,0.4)] hover:text-[rgba(79,195,247,0.7)]'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle size={14} className="text-emerald-400" />
                      ) : (
                        <StepIcon size={14} />
                      )}
                      <span className="text-[9px] font-semibold tracking-[1px] uppercase hidden lg:inline">
                        {step.title.split(' ')[0]}
                      </span>
                    </button>
                    {idx < steps.length - 1 && (
                      <div className="flex-1 h-px bg-[rgba(79,195,247,0.1)] mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.3)] shadow-2xl" style={{ animation: "fade-in-up 0.4s 0.12s ease both" }}>
            {/* Card Header */}
            <div className="border-b border-[rgba(79,195,247,0.15)] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
                <CurrentIcon size={18} className="text-[#4fc3f7]" />
                <h2 className="font-['Cinzel',serif] text-lg font-bold tracking-[2px] text-[#e0f7fa]">
                  {currentStepData.title}
                </h2>
              </div>
              <p className="text-[10px] tracking-[1px] text-[rgba(79,195,247,0.4)] ml-9 mt-1">
                {currentStepData.subtitle}
              </p>
            </div>

            {/* Form Content */}
            <div className="px-6 py-8 min-h-[450px]">
              {renderStepContent()}
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-[rgba(79,195,247,0.15)] px-6 py-4 flex gap-3">
              <button
                onClick={() => navigate('/projects')}
                className="flex-1 px-4 py-2.5 border border-[rgba(79,195,247,0.2)] text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.5)] transition-all"
              >
                Cancel Registration
              </button>
              
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-2.5 border border-[rgba(79,195,247,0.3)] text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.7)] hover:border-[#4fc3f7] transition-all flex items-center gap-2"
                >
                  <ChevronLeft size={12} />
                  Previous
                </button>
              )}
              
              {!isLastStep ? (
                <button
                  onClick={handleNext}
                  disabled={!isValid}
                  className="flex-1 px-4 py-2.5 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[10px] font-semibold tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Next Step
                  <ChevronRight size={12} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.name || !form.dueDate}
                  className="flex-1 px-4 py-2.5 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[10px] font-semibold tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "REGISTERING..." : "REGISTER GATE"}
                </button>
              )}
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="mt-6 flex justify-between items-center text-[9px] tracking-[2px] text-[rgba(79,195,247,0.3)] border-t border-[rgba(79,195,247,0.1)] pt-4">
            <span>System v4.2.1 · Gate Registration Protocol</span>
            <span style={{ color: "rgba(79,230,160,0.5)" }}>⬡ All fields classified</span>
            <span>Required fields marked with *</span>
          </div>
        </div>
      </div>
    </div>
  );
}