import { useState } from "react";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Search,
  Filter,
  Plus,
  UserPlus,
  Award,
  Calendar,
  MessageCircle,
  Star,
  Clock,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Send,
} from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  status: "active" | "away" | "busy" | "offline";
  joinDate: string;
  tasksCompleted: number;
  projects: number;
  skills: string[];
  location: string;
  phone: string;
}

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const departments = ["all", "Engineering", "Design", "Product", "Marketing", "Sales"];
  const statuses = ["all", "active", "away", "busy", "offline"];

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "Alex Morgan",
      email: "alex@thesystem.io",
      role: "Lead Product Designer",
      department: "Design",
      avatar: "AM",
      status: "active",
      joinDate: "2023-01-15",
      tasksCompleted: 127,
      projects: 8,
      skills: ["Figma", "UI/UX", "Prototyping", "User Research"],
      location: "San Francisco, CA",
      phone: "+1 (555) 123-4567",
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah@thesystem.io",
      role: "Senior Frontend Developer",
      department: "Engineering",
      avatar: "SC",
      status: "busy",
      joinDate: "2023-03-20",
      tasksCompleted: 89,
      projects: 12,
      skills: ["React", "TypeScript", "Tailwind", "Next.js"],
      location: "New York, NY",
      phone: "+1 (555) 234-5678",
    },
    {
      id: 3,
      name: "Marcus Johnson",
      email: "marcus@thesystem.io",
      role: "Product Manager",
      department: "Product",
      avatar: "MJ",
      status: "away",
      joinDate: "2022-11-10",
      tasksCompleted: 156,
      projects: 15,
      skills: ["Strategy", "Analytics", "Roadmapping", "Agile"],
      location: "Austin, TX",
      phone: "+1 (555) 345-6789",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily@thesystem.io",
      role: "Marketing Lead",
      department: "Marketing",
      avatar: "ER",
      status: "active",
      joinDate: "2023-06-01",
      tasksCompleted: 67,
      projects: 6,
      skills: ["SEO", "Content Strategy", "Analytics", "Social Media"],
      location: "Los Angeles, CA",
      phone: "+1 (555) 456-7890",
    },
    {
      id: 5,
      name: "David Kim",
      email: "david@thesystem.io",
      role: "Backend Engineer",
      department: "Engineering",
      avatar: "DK",
      status: "offline",
      joinDate: "2023-02-28",
      tasksCompleted: 112,
      projects: 9,
      skills: ["Python", "Django", "PostgreSQL", "AWS"],
      location: "Seattle, WA",
      phone: "+1 (555) 567-8901",
    },
    {
      id: 6,
      name: "Lisa Wang",
      email: "lisa@thesystem.io",
      role: "Sales Director",
      department: "Sales",
      avatar: "LW",
      status: "busy",
      joinDate: "2022-09-14",
      tasksCompleted: 203,
      projects: 18,
      skills: ["CRM", "Negotiation", "Client Relations", "Forecasting"],
      location: "Chicago, IL",
      phone: "+1 (555) 678-9012",
    },
  ]);

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-emerald-500",
      away: "bg-amber-500",
      busy: "bg-red-500",
      offline: "bg-slate-400",
    };
    return colors[status as keyof typeof colors] || "bg-slate-400";
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: "Active",
      away: "Away",
      busy: "Busy",
      offline: "Offline",
    };
    return texts[status as keyof typeof texts] || status;
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment;
    const matchesStatus = selectedStatus === "all" || member.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === "active").length,
    departments: new Set(teamMembers.map(m => m.department)).size,
    totalTasks: teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Members</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
              <Users size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Now</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stats.active}</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
              <UserCheck size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Departments</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stats.departments}</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
              <Award size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Tasks Completed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stats.totalTasks}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
              <CheckCircle2 size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : getStatusText(status)}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex items-center gap-2"
            >
              <UserPlus size={18} />
              <span className="hidden sm:inline">Invite Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${getStatusColor(member.status)}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {member.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(member)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal size={18} className="text-slate-400" />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Mail size={14} />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin size={14} />
                  <span>{member.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Calendar size={14} />
                  <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {member.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-lg">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{member.projects}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{member.tasksCompleted}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tasks</p>
                </div>
                <div className="text-center">
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(member.status)}/10 text-${getStatusColor(member.status).replace('bg-', '')}`}>
                    {getStatusText(member.status)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2">
                  <MessageCircle size={14} />
                  Message
                </button>
                <button className="flex-1 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-950 rounded-lg transition-colors text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2">
                  <Star size={14} />
                  Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Users size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No members found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <InviteMemberModal onClose={() => setIsInviteModalOpen(false)} />
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberDetailsModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </div>
  );
}

// Invite Member Modal Component
function InviteMemberModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Developer");
  const [department, setDepartment] = useState("Engineering");

  const handleInvite = () => {
    if (!email) return;
    // Handle invite logic here
    console.log("Invite sent to:", email, role, department);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Invite Team Member</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Developer</option>
                <option>Designer</option>
                <option>Product Manager</option>
                <option>Marketing Specialist</option>
                <option>Sales Representative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Engineering</option>
                <option>Design</option>
                <option>Product</option>
                <option>Marketing</option>
                <option>Sales</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Send size={16} />
              Send Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Member Details Modal Component
function MemberDetailsModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm">
                {member.avatar}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{member.name}</h3>
                <p className="text-slate-500 dark:text-slate-400">{member.role}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Contact Information</h4>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail size={14} />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Phone size={14} />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin size={14} />
                <span>{member.location}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Work Information</h4>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Award size={14} />
                <span>{member.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Calendar size={14} />
                <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                <span className="text-slate-600 dark:text-slate-400">{getStatusText(member.status)}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Skills & Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2">
              <MessageCircle size={16} />
              Send Message
            </button>
            <button className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusText(status: string): string {
  const texts = {
    active: "Active",
    away: "Away",
    busy: "Busy",
    offline: "Offline",
  };
  return texts[status as keyof typeof texts] || status;
}