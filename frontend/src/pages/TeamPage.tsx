// frontend/src/features/team/TeamPage.tsx
import { useState } from "react";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Search,
  UserPlus,
  Award,
  Calendar,
  MessageCircle,
  Star,
  CheckCircle2,
  X,
  UserCheck,
  Send,
  Shield,
  Target,
  TrendingUp,
  Clock,
  Zap,
  Crown,
} from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  rank: string;
  avatar: string;
  status: "active" | "away" | "busy" | "offline";
  joinDate: string;
  tasksCompleted: number;
  projects: number;
  skills: string[];
  location: string;
  phone: string;
  clearRate: number;
}

// ── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useState(() => {
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  });
  return value;
}

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRank, setSelectedRank] = useState("all");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const departments = ["all", "Engineering", "Design", "Product", "Marketing", "Sales", "Operations"];
  const statuses = ["all", "active", "away", "busy", "offline"];
  const ranks = ["all", "S", "A", "B", "C"];

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "Alex Morgan",
      email: "alex@system.io",
      role: "Lead Hunter",
      department: "Operations",
      rank: "S",
      avatar: "AM",
      status: "active",
      joinDate: "2023-01-15",
      tasksCompleted: 247,
      projects: 18,
      skills: ["Gate Analysis", "Tactical Command", "S-Rank Combat", "Strategy"],
      location: "Hunter's Guild HQ",
      phone: "+1 (555) 123-4567",
      clearRate: 98,
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah@system.io",
      role: "Strike Specialist",
      department: "Operations",
      rank: "A",
      avatar: "SC",
      status: "busy",
      joinDate: "2023-03-20",
      tasksCompleted: 189,
      projects: 14,
      skills: ["Rapid Response", "A-Rank Combat", "Intel Gathering"],
      location: "New York Outpost",
      phone: "+1 (555) 234-5678",
      clearRate: 94,
    },
    {
      id: 3,
      name: "Marcus Johnson",
      email: "marcus@system.io",
      role: "Tactical Analyst",
      department: "Intelligence",
      rank: "A",
      avatar: "MJ",
      status: "away",
      joinDate: "2022-11-10",
      tasksCompleted: 212,
      projects: 22,
      skills: ["Data Analysis", "Threat Assessment", "Strategic Planning"],
      location: "Austin Hub",
      phone: "+1 (555) 345-6789",
      clearRate: 91,
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily@system.io",
      role: "Support Specialist",
      department: "Logistics",
      rank: "B",
      avatar: "ER",
      status: "active",
      joinDate: "2023-06-01",
      tasksCompleted: 134,
      projects: 11,
      skills: ["Resource Management", "Supply Chain", "Coordination"],
      location: "Los Angeles Outpost",
      phone: "+1 (555) 456-7890",
      clearRate: 87,
    },
    {
      id: 5,
      name: "David Kim",
      email: "david@system.io",
      role: "Tech Specialist",
      department: "R&D",
      rank: "B",
      avatar: "DK",
      status: "offline",
      joinDate: "2023-02-28",
      tasksCompleted: 156,
      projects: 13,
      skills: ["System Architecture", "Gate Tech", "Research"],
      location: "Seattle Lab",
      phone: "+1 (555) 567-8901",
      clearRate: 89,
    },
    {
      id: 6,
      name: "Lisa Wang",
      email: "lisa@system.io",
      role: "Field Commander",
      department: "Operations",
      rank: "S",
      avatar: "LW",
      status: "busy",
      joinDate: "2022-09-14",
      tasksCompleted: 312,
      projects: 26,
      skills: ["Combat Leadership", "S-Rank Strategy", "Crisis Management"],
      location: "Chicago Command",
      phone: "+1 (555) 678-9012",
      clearRate: 99,
    },
    {
      id: 7,
      name: "James Wilson",
      email: "james@system.io",
      role: "Reconnaissance",
      department: "Intelligence",
      rank: "A",
      avatar: "JW",
      status: "active",
      joinDate: "2023-04-12",
      tasksCompleted: 178,
      projects: 16,
      skills: ["Scouting", "Stealth Ops", "Intel Collection"],
      location: "Denver Outpost",
      phone: "+1 (555) 789-0123",
      clearRate: 93,
    },
    {
      id: 8,
      name: "Nina Patel",
      email: "nina@system.io",
      role: "Medical Officer",
      department: "Support",
      rank: "C",
      avatar: "NP",
      status: "active",
      joinDate: "2023-08-01",
      tasksCompleted: 98,
      projects: 8,
      skills: ["Field Medicine", "Trauma Care", "Recovery Protocols"],
      location: "Medical Bay",
      phone: "+1 (555) 890-1234",
      clearRate: 85,
    },
  ]);

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-emerald-500",
      away: "bg-amber-500",
      busy: "bg-red-500",
      offline: "bg-slate-500",
    };
    return colors[status as keyof typeof colors] || "bg-slate-500";
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: "ACTIVE",
      away: "AWAY",
      busy: "ENGAGED",
      offline: "OFFLINE",
    };
    return texts[status as keyof typeof texts] || status.toUpperCase();
  };

  const getRankStyle = (rank: string) => {
    return {
      S: "text-red-400 border-red-500/40 bg-red-500/5 shadow-[0_0_8px_rgba(255,100,100,0.4)]",
      A: "text-amber-400 border-amber-500/40 bg-amber-500/5 shadow-[0_0_8px_rgba(255,180,70,0.4)]",
      B: "text-sky-300 border-sky-400/40 bg-sky-400/5 shadow-[0_0_8px_rgba(79,195,247,0.4)]",
      C: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_8px_rgba(79,230,160,0.4)]",
    }[rank] ?? "text-sky-500/50 border-sky-500/20";
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment;
    const matchesStatus = selectedStatus === "all" || member.status === selectedStatus;
    const matchesRank = selectedRank === "all" || member.rank === selectedRank;
    return matchesSearch && matchesDepartment && matchesStatus && matchesRank;
  });

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === "active").length,
    departments: new Set(teamMembers.map(m => m.department)).size,
    totalTasks: teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0),
    sRank: teamMembers.filter(m => m.rank === "S").length,
    avgClearRate: Math.round(teamMembers.reduce((sum, m) => sum + m.clearRate, 0) / teamMembers.length),
  };

  return (
    <div className="sys-team-page min-h-screen bg-[#020c1a] font-['Rajdhani',sans-serif] text-[#e0f7fa] relative">
      {/* Background Layers */}
      <div className="fixed inset-0 bg-[radial-gradient(circle,rgba(79,195,247,0.055)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0" />
      <div className="fixed w-[900px] h-[900px] top-[-300px] left-[-250px] bg-[radial-gradient(circle,rgba(2,80,160,0.13)_0%,transparent_70%)] rounded-full pointer-events-none z-0 blur-[20px]" />
      <div className="fixed w-[600px] h-[600px] bottom-[-200px] right-[-100px] bg-[radial-gradient(circle,rgba(79,195,247,0.07)_0%,transparent_70%)] rounded-full pointer-events-none z-0 blur-[20px]" />
      <div className="fixed inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(79,195,247,0.012)_2px,rgba(79,195,247,0.012)_4px)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[rgba(4,12,28,0.92)] border border-[rgba(79,195,247,0.2)] mb-6 relative overflow-hidden animate-[fade-in-up_0.4s_ease_both]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[rgba(79,195,247,0.4)] flex items-center justify-center font-['Cinzel',serif] text-sm font-bold text-[#4fc3f7] relative">
              S
              <div className="absolute inset-[-4px] border border-[rgba(79,195,247,0.13)]" />
            </div>
            <span className="font-['Cinzel',serif] text-base font-bold tracking-[3px] text-[#e0f7fa]">THE SYSTEM</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.35)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4fe6a0] animate-[dot-pulse_2s_ease-in-out_infinite]" />
              Command Active
            </div>
            <div className="font-['Cinzel',serif] text-[11px] font-bold tracking-[3px] text-[#ffd54f] border border-[rgba(255,213,79,0.35)] px-3 py-0.5">
              HUNTER ROSTER
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-6 px-0.5 animate-[fade-in-up_0.4s_0.06s_ease_both]">
          <div className="font-['Cinzel',serif] text-3xl font-black tracking-[3px] bg-gradient-to-r from-[#e0f7fa] to-[#4fc3f7] bg-clip-text text-transparent">
            HUNTER ROSTER
          </div>
          <div className="text-[11px] tracking-[3px] uppercase text-[rgba(79,195,247,0.32)] mt-1">
            Active Personnel · Hunter Registry
          </div>
          <div className="h-px mt-3 bg-gradient-to-r from-[#4fc3f7] via-[rgba(79,195,247,0.1)] to-transparent" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Active Hunters", value: stats.total, icon: <Users size={16} />, color: "#4fc3f7", sub: "Registered Personnel" },
            { label: "On Duty", value: stats.active, icon: <UserCheck size={16} />, color: "#4fe6a0", sub: "Currently Active" },
            { label: "S-Rank", value: stats.sRank, icon: <Crown size={16} />, color: "#ff6b6b", sub: "Elite Hunters" },
            { label: "Clear Rate", value: `${stats.avgClearRate}%`, icon: <Target size={16} />, color: "#ffd54f", sub: "Average Success" },
            { label: "Missions", value: stats.totalTasks, icon: <Zap size={16} />, color: "#ffb347", sub: "Total Completed" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="relative bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-4 overflow-hidden hover:border-[rgba(79,195,247,0.45)] transition-all duration-300 group animate-[fade-in-up_0.5s_ease_both]"
              style={{ animationDelay: `${0.08 + idx * 0.04}s` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} />
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[rgba(79,195,247,0.3)]" />
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[rgba(79,195,247,0.3)]" />
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.45)]">{stat.label}</span>
                <span className="opacity-60 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
              </div>
              
              <div className="font-['Cinzel',serif] text-2xl font-black leading-none" style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}66` }}>
                {typeof stat.value === "string" ? stat.value : useCountUp(stat.value)}
              </div>
              <div className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.35)] mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Main Panel */}
        <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] overflow-hidden animate-[fade-in-up_0.4s_0.24s_ease_both]">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(79,195,247,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
              <span className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa]">HUNTER DATABASE</span>
              <span className="text-[10px] tracking-[2px] bg-[rgba(79,195,247,0.07)] border border-[rgba(79,195,247,0.2)] px-2 py-0.5 text-[rgba(79,195,247,0.55)]">
                {filteredMembers.length} PERSONNEL
              </span>
            </div>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.4)] border border-[rgba(79,195,247,0.2)] px-3 py-1.5 hover:border-[#4fc3f7] hover:text-[#4fc3f7] transition-all duration-200"
            >
              <UserPlus size={12} /> RECRUIT HUNTER
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-4 border-b border-[rgba(79,195,247,0.07)]">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(79,195,247,0.35)]" />
                <input
                  type="text"
                  placeholder="Search by designation, rank, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm placeholder:text-[rgba(79,195,247,0.3)]"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] text-[#e0f7fa] text-xs tracking-[1px] focus:outline-none focus:border-[rgba(79,195,247,0.5)]"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === "all" ? "ALL DIVISIONS" : dept.toUpperCase()}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedRank}
                  onChange={(e) => setSelectedRank(e.target.value)}
                  className="px-3 py-2 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] text-[#e0f7fa] text-xs tracking-[1px] focus:outline-none focus:border-[rgba(79,195,247,0.5)]"
                >
                  {ranks.map(rank => (
                    <option key={rank} value={rank}>
                      {rank === "all" ? "ALL RANKS" : `${rank}-RANK`}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] text-[#e0f7fa] text-xs tracking-[1px] focus:outline-none focus:border-[rgba(79,195,247,0.5)]"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === "all" ? "ALL STATUS" : getStatusText(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Team Grid */}
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMembers.map((member, idx) => {
                const rankStyle = getRankStyle(member.rank);
                return (
                  <div
                    key={member.id}
                    className="group relative bg-[rgba(4,18,38,0.7)] border border-[rgba(79,195,247,0.15)] hover:border-[rgba(79,195,247,0.4)] transition-all duration-300 cursor-pointer overflow-hidden animate-[fade-in-up_0.4s_ease_both]"
                    style={{ animationDelay: `${0.28 + idx * 0.03}s` }}
                    onClick={() => setSelectedMember(member)}
                  >
                    {/* Hover corners */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[rgba(79,195,247,0.4)]" />
                      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[rgba(79,195,247,0.4)]" />
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[rgba(79,195,247,0.4)]" />
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[rgba(79,195,247,0.4)]" />
                    </div>

                    {/* Top accent line */}
                    <div className={`h-1 w-full ${
                      member.rank === "S" ? "bg-red-500" :
                      member.rank === "A" ? "bg-amber-500" :
                      member.rank === "B" ? "bg-sky-500" : "bg-emerald-500"
                    }`} />

                    <div className="p-5">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`relative w-14 h-14 rounded-lg border-2 ${rankStyle} flex items-center justify-center font-['Cinzel',serif] text-xl font-bold bg-[rgba(4,18,38,0.8)]`}>
                            {member.avatar}
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#020c1a] ${getStatusColor(member.status)}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#e0f7fa] group-hover:text-[#4fc3f7] transition-colors">
                              {member.name}
                            </h3>
                            <p className="text-xs text-[rgba(79,195,247,0.5)] tracking-wide">{member.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(member);
                          }}
                          className="p-1.5 rounded-lg hover:bg-[rgba(79,195,247,0.1)] transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal size={14} className="text-[rgba(79,195,247,0.5)]" />
                        </button>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-[rgba(79,195,247,0.5)]">
                          <Mail size={12} />
                          <span className="tracking-wide">{member.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[rgba(79,195,247,0.5)]">
                          <MapPin size={12} />
                          <span className="tracking-wide">{member.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[rgba(79,195,247,0.5)]">
                          <Calendar size={12} />
                          <span className="tracking-wide">Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {member.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.15)] text-[9px] tracking-[1px] text-[rgba(79,195,247,0.5)]"
                            >
                              {skill}
                            </span>
                          ))}
                          {member.skills.length > 3 && (
                            <span className="px-2 py-0.5 bg-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.15)] text-[9px] tracking-[1px] text-[rgba(79,195,247,0.5)]">
                              +{member.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex justify-between items-center pt-3 border-t border-[rgba(79,195,247,0.1)]">
                        <div className="text-center">
                          <p className="text-lg font-['Cinzel',serif] font-bold text-[#4fc3f7]">{member.projects}</p>
                          <p className="text-[8px] tracking-[1px] text-[rgba(79,195,247,0.4)]">GATES</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-['Cinzel',serif] font-bold text-[#4fe6a0]">{member.tasksCompleted}</p>
                          <p className="text-[8px] tracking-[1px] text-[rgba(79,195,247,0.4)]">QUESTS</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-['Cinzel',serif] font-bold text-[#ffd54f]">{member.clearRate}%</p>
                          <p className="text-[8px] tracking-[1px] text-[rgba(79,195,247,0.4)]">CLEAR</p>
                        </div>
                        <div className={`text-[9px] font-semibold tracking-[1.5px] uppercase px-2 py-0.5 border ${rankStyle}`}>
                          {member.rank}-RANK
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-3 flex justify-end">
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 border ${getStatusColor(member.status).replace('bg-', 'border-')}/30`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(member.status)}`} />
                          <span className="text-[8px] tracking-[1.5px] text-[rgba(79,195,247,0.5)]">{getStatusText(member.status)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredMembers.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl opacity-20 mb-4">⚔️</div>
                <h3 className="text-base font-['Cinzel',serif] tracking-[2px] text-[rgba(79,195,247,0.4)] mb-2">NO HUNTERS FOUND</h3>
                <p className="text-xs tracking-[1.5px] text-[rgba(79,195,247,0.3)]">Adjust your filters or recruit new hunters</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between mt-5 px-4 py-2 bg-[rgba(4,12,28,0.85)] border border-[rgba(79,195,247,0.1)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.25)] animate-[fade-in-up_0.4s_0.32s_ease_both]">
          <span>Hunter Registry v1.0 · Personnel Database</span>
          <span className="text-[rgba(79,230,160,0.5)]">⬡ Active Hunters: {stats.active}</span>
          <span>Last Sync: Just Now</span>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <InviteMemberModal onClose={() => setIsInviteModalOpen(false)} />
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberDetailsModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px #4fe6a0; }
          50% { opacity: 0.4; box-shadow: none; }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.2); }
      `}</style>
    </div>
  );
}

// Invite Member Modal Component
function InviteMemberModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Strike Specialist");
  const [rank, setRank] = useState("B");

  const handleInvite = () => {
    if (!email) return;
    console.log("Invite sent to:", email, role, rank);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[rgba(4,18,38,0.98)] border border-[rgba(79,195,247,0.3)] w-full max-w-md p-6 shadow-2xl animate-[fade-in-up_0.3s_ease]">
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[rgba(79,195,247,0.3)]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[rgba(79,195,247,0.3)]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[rgba(79,195,247,0.3)]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[rgba(79,195,247,0.3)]" />
        
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
            <h3 className="font-['Cinzel',serif] text-lg font-bold tracking-[2px] text-[#e0f7fa]">RECRUIT HUNTER</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[rgba(79,195,247,0.1)] transition-colors">
            <X size={18} className="text-[rgba(79,195,247,0.5)]" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">COMMS ADDRESS *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hunter@system.io"
              className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">ROLE</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
            >
              <option>Strike Specialist</option>
              <option>Tactical Analyst</option>
              <option>Field Commander</option>
              <option>Support Specialist</option>
              <option>Tech Specialist</option>
              <option>Reconnaissance</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">RANK</label>
            <select
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
            >
              <option value="S">S-Rank</option>
              <option value="A">A-Rank</option>
              <option value="B">B-Rank</option>
              <option value="C">C-Rank</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-[rgba(79,195,247,0.2)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.5)] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="flex-1 px-4 py-2.5 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[10px] tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all flex items-center justify-center gap-2"
          >
            <Send size={12} />
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

// Member Details Modal Component
function MemberDetailsModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const rankStyle = member.rank === "S" ? "text-red-400" : member.rank === "A" ? "text-amber-400" : member.rank === "B" ? "text-sky-300" : "text-emerald-400";
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[rgba(4,18,38,0.98)] border border-[rgba(79,195,247,0.3)] w-full max-w-2xl p-6 shadow-2xl animate-[fade-in-up_0.3s_ease]">
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[rgba(79,195,247,0.3)]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[rgba(79,195,247,0.3)]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[rgba(79,195,247,0.3)]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[rgba(79,195,247,0.3)]" />
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-lg border-2 ${member.rank === "S" ? "border-red-500/40" : member.rank === "A" ? "border-amber-500/40" : "border-sky-500/40"} flex items-center justify-center font-['Cinzel',serif] text-2xl font-bold bg-[rgba(4,18,38,0.8)] text-[#e0f7fa]`}>
              {member.avatar}
            </div>
            <div>
              <h3 className="text-xl font-['Cinzel',serif] font-bold text-[#e0f7fa]">{member.name}</h3>
              <p className="text-sm text-[rgba(79,195,247,0.5)] tracking-wide">{member.role}</p>
              <div className={`text-[10px] font-bold tracking-[2px] mt-1 ${rankStyle}`}>{member.rank}-RANK HUNTER</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[rgba(79,195,247,0.1)] transition-colors">
            <X size={18} className="text-[rgba(79,195,247,0.5)]" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">CONTACT DATA</h4>
            <div className="flex items-center gap-2 text-sm text-[rgba(79,195,247,0.6)]">
              <Mail size={14} />
              <span>{member.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[rgba(79,195,247,0.6)]">
              <Phone size={14} />
              <span>{member.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[rgba(79,195,247,0.6)]">
              <MapPin size={14} />
              <span>{member.location}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">OPERATIONAL DATA</h4>
            <div className="flex items-center gap-2 text-sm text-[rgba(79,195,247,0.6)]">
              <Award size={14} />
              <span>{member.department} Division</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[rgba(79,195,247,0.6)]">
              <Calendar size={14} />
              <span>Active since {new Date(member.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : member.status === 'away' ? 'bg-amber-500' : member.status === 'busy' ? 'bg-red-500' : 'bg-slate-500'}`} />
              <span className="text-[rgba(79,195,247,0.6)]">{member.status === 'active' ? 'ACTIVE' : member.status === 'away' ? 'AWAY' : member.status === 'busy' ? 'ENGAGED' : 'OFFLINE'}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">SPECIALIZATIONS</h4>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 border border-[rgba(79,195,247,0.2)] text-xs text-[rgba(79,195,247,0.6)] tracking-wide">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 border border-[rgba(79,195,247,0.1)]">
            <p className="text-2xl font-['Cinzel',serif] font-bold text-[#4fc3f7]">{member.projects}</p>
            <p className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.4)]">GATES CLEARED</p>
          </div>
          <div className="text-center p-3 border border-[rgba(79,195,247,0.1)]">
            <p className="text-2xl font-['Cinzel',serif] font-bold text-[#4fe6a0]">{member.tasksCompleted}</p>
            <p className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.4)]">QUESTS COMPLETED</p>
          </div>
          <div className="text-center p-3 border border-[rgba(79,195,247,0.1)]">
            <p className="text-2xl font-['Cinzel',serif] font-bold text-[#ffd54f]">{member.clearRate}%</p>
            <p className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.4)]">CLEAR RATE</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[10px] tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all flex items-center justify-center gap-2">
            <MessageCircle size={12} />
            Send Message
          </button>
          <button className="flex-1 px-4 py-2 border border-[rgba(79,195,247,0.2)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.5)] transition-all">
            Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}