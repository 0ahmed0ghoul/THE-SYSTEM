// pages/ProjectDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, Calendar, Users, Flag, Clock, DollarSign, 
  Tag, Target, Eye, CheckCircle2, Edit, MoreHorizontal,
  Briefcase, User, Mail, Phone, MapPin, Link2
} from "lucide-react";
import {type Project } from "../../../store/projectStore";
import { projectsData } from "../../../pages/data";


export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch project data - replace with actual API call
    const foundProject = projectsData.find((p: Project) => p.id === Number(id));
    setTimeout(() => {
      setProject(foundProject || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
      high: "bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      medium: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      low: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400",
      planning: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400",
      onHold: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400",
      completed: "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400",
      archived: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
    };
    return colors[status as keyof typeof colors] || colors.planning;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-slate-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h2>
        <p className="text-gray-500 dark:text-slate-400 mb-6">The project you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="flex gap-2">
          <button className="p-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <Edit size={18} />
          </button>
          <button className="p-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Project Title Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status || 'planning')}`}>
                {project.status?.charAt(0).toUpperCase()}{project.status?.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority || 'medium')}`}>
                {project.priority?.toUpperCase()} Priority
              </span>
              {project.category && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300">
                  {project.category}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {project.name}
            </h1>
            
            {project.description && (
              <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed">
                {project.description}
              </p>
            )}
          </div>
          
          {/* Progress Ring */}
          {typeof project.progress === 'number' && (
            <div className="text-center">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-slate-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - project.progress / 100)}`}
                    className="text-indigo-600 dark:text-indigo-400 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {project.progress}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Complete</p>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {project.dueDate && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} />
              <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Due Date</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date(project.dueDate).toLocaleDateString(undefined, { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
        )}
        
        {project.teamMembers && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-indigo-600 dark:text-indigo-400" size={20} />
              <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Team Size</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {project.teamMembers.length} Members
            </p>
          </div>
        )}
        
        {project.estimatedHours && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-indigo-600 dark:text-indigo-400" size={20} />
              <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Est. Hours</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {project.estimatedHours} hours
            </p>
          </div>
        )}
        
        {project.budget && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-indigo-600 dark:text-indigo-400" size={20} />
              <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Budget</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${project.budget.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Goals/Milestones */}
          {project.goals && project.goals.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target size={20} className="text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Goals & Milestones</h2>
              </div>
              <div className="space-y-3">
                {project.goals.map((goal, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <CheckCircle2 size={18} className="text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <span className="text-gray-700 dark:text-slate-300">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Members Detailed */}
          {project.teamMembers && project.teamMembers.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Members</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.teamMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {typeof member === 'string' ? member[0] : member.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {typeof member === 'string' ? member : member.name}
                      </p>
                      {typeof member !== 'string' && member.role && (
                        <p className="text-sm text-gray-500 dark:text-slate-400">{member.role}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Client Info */}
          {project.clientName && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Client Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase size={16} className="text-gray-400" />
                  <span className="text-gray-600 dark:text-slate-400">{project.clientName}</span>
                </div>
                {project.projectLead && (
                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-slate-400">Lead: {project.projectLead}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Visibility & Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={18} className="text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Visibility</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
              {project.visibility === 'private' && '🔒 Private - Only you can access'}
              {project.visibility === 'team' && '👥 Team - All team members can access'}
              {project.visibility === 'public' && '🌍 Public - Anyone can view'}
            </p>
            {project.requiresApproval && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-amber-600 dark:text-amber-400">Requires Approval</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}