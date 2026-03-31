// frontend/src/features/profile/ProfilePage.tsx
import { useState, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit2,
  Save,
  X,
  Camera,
  Lock,
  Bell,
  Moon,
  Globe,
  Shield,
  LogOut,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Users,
  Target,
  Award,
  Globe2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "Hunter Alex",
    email: user?.email || "hunter.alex@system.io",
    phone: user?.phone || "+1 (555) 847-2367",
    location: user?.location || "Hunter's Guild, Sector 7",
    position: user?.position || "S-Rank Hunter",
    department: user?.department || "Special Operations",
    rank: "S",
    bio: user?.bio || "Elite S-Rank hunter specializing in high-level gate clearance. 127 successful missions completed. Currently leading the Vanguard Division in operations against A-Rank and above gates.",
    website: user?.website || "https://hunter-guild.system.io",
    github: user?.github || "https://github.com/hunteralex",
    linkedin: user?.linkedin || "https://linkedin.com/in/hunteralex",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatar, setAvatar] = useState(
    user?.avatar || `https://ui-avatars.com/api/?name=${formData.name.replace(" ", "+")}&background=4fc3f7&color=fff&bold=true&length=2`
  );

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    setSuccessMessage("Hunter profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("Authorization codes don't match");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setErrorMessage("Security code must be at least 6 characters");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    setSuccessMessage("Security credentials updated!");
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const stats = {
    missions: 127,
    clears: 112,
    sRank: 8,
    teamSize: 12,
  };

  const countMissions = useCountUp(stats.missions);
  const countClears = useCountUp(stats.clears);
  const countSRank = useCountUp(stats.sRank);
  const countTeam = useCountUp(stats.teamSize);

  const getRankStyle = (rank: string) => {
    return {
      S: "text-red-400 border-red-500/40 bg-red-500/5 shadow-[0_0_8px_rgba(255,100,100,0.4)]",
      A: "text-amber-400 border-amber-500/40 bg-amber-500/5 shadow-[0_0_8px_rgba(255,180,70,0.4)]",
      B: "text-sky-300 border-sky-400/40 bg-sky-400/5 shadow-[0_0_8px_rgba(79,195,247,0.4)]",
      C: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_8px_rgba(79,230,160,0.4)]",
    }[rank] ?? "text-sky-500/50 border-sky-500/20 bg-transparent";
  };

  return (
    <div className="sys-profile-page min-h-screen bg-[#020c1a] font-['Rajdhani',sans-serif] text-[#e0f7fa] relative">
      {/* Background Layers */}
      <div className="fixed inset-0 bg-[radial-gradient(circle,rgba(79,195,247,0.055)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0" />
      <div className="fixed w-[900px] h-[900px] top-[-300px] left-[-250px] bg-[radial-gradient(circle,rgba(2,80,160,0.13)_0%,transparent_70%)] rounded-full pointer-events-none z-0 blur-[20px]" />
      <div className="fixed w-[600px] h-[600px] bottom-[-200px] right-[-100px] bg-[radial-gradient(circle,rgba(79,195,247,0.07)_0%,transparent_70%)] rounded-full pointer-events-none z-0 blur-[20px]" />
      <div className="fixed inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(79,195,247,0.012)_2px,rgba(79,195,247,0.012)_4px)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-6">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="fixed top-20 right-4 z-50 animate-[slide-in_0.3s_ease]">
            <div className="bg-[rgba(4,18,38,0.98)] border-l-2 border-emerald-400 px-4 py-3 shadow-lg flex items-center gap-3 backdrop-blur-sm">
              <CheckCircle size={16} className="text-emerald-400" />
              <span className="text-xs tracking-[1.5px] uppercase text-[#e0f7fa]">{successMessage}</span>
            </div>
          </div>
        )}
        
        {errorMessage && (
          <div className="fixed top-20 right-4 z-50 animate-[slide-in_0.3s_ease]">
            <div className="bg-[rgba(4,18,38,0.98)] border-l-2 border-red-400 px-4 py-3 shadow-lg flex items-center gap-3 backdrop-blur-sm">
              <AlertCircle size={16} className="text-red-400" />
              <span className="text-xs tracking-[1.5px] uppercase text-[#e0f7fa]">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[rgba(4,12,28,0.92)] border border-[rgba(79,195,247,0.2)] mb-6 relative overflow-hidden">
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
            <div className={`font-['Cinzel',serif] text-[11px] font-bold tracking-[3px] border px-3 py-0.5 ${getRankStyle(formData.rank)}`}>
              {formData.rank}-RANK HUNTER
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-6 px-0.5">
          <div className="font-['Cinzel',serif] text-3xl font-black tracking-[3px] bg-gradient-to-r from-[#e0f7fa] to-[#4fc3f7] bg-clip-text text-transparent">
            HUNTER PROFILE
          </div>
          <div className="text-[11px] tracking-[3px] uppercase text-[rgba(79,195,247,0.32)] mt-1">
            System Authentication · Classified Hunter Data
          </div>
          <div className="h-px mt-3 bg-gradient-to-r from-[#4fc3f7] via-[rgba(79,195,247,0.1)] to-transparent" />
        </div>

        {/* Profile Header Card */}
        <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] overflow-hidden mb-6 animate-[fade-in-up_0.5s_ease_both]">
          {/* Cover with rank gradient */}
          <div className="h-28 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${
              formData.rank === "S" ? "from-red-900/30 via-red-800/20 to-transparent" :
              formData.rank === "A" ? "from-amber-900/30 via-amber-800/20 to-transparent" :
              "from-sky-900/30 via-sky-800/20 to-transparent"
            }`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(79,195,247,0.08)_0%,transparent_50%)]" />
          </div>
          
          {/* Avatar and Basic Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-6 -mt-12 mb-6">
              <div className="relative">
                <div className={`w-28 h-28 rounded-lg border-2 ${getRankStyle(formData.rank)} flex items-center justify-center text-white text-3xl font-bold shadow-lg bg-[rgba(4,18,38,0.95)] overflow-hidden`}>
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-['Cinzel',serif] text-4xl">{formData.name.charAt(0)}</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-1.5 bg-[#4fc3f7] rounded-lg text-[#020c1a] hover:bg-[#4fc3f7]/80 transition-colors shadow-sm"
                >
                  <Camera size={12} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="text-2xl font-['Cinzel',serif] font-bold px-3 py-1 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.3)] focus:border-[rgba(79,195,247,0.6)] focus:outline-none text-[#e0f7fa]"
                      />
                    ) : (
                      <h1 className="text-2xl font-['Cinzel',serif] font-bold text-[#e0f7fa]">{formData.name}</h1>
                    )}
                    <p className="text-xs tracking-[2px] text-[rgba(79,195,247,0.5)] mt-1 flex items-center gap-2">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                        formData.rank === "S" ? "bg-red-400" : formData.rank === "A" ? "bg-amber-400" : "bg-sky-400"
                      }`} />
                      {formData.position} · {formData.department}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[10px] tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all"
                        >
                          <Save size={12} /> Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-1.5 px-4 py-2 border border-[rgba(79,195,247,0.3)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.6)] transition-all"
                        >
                          <X size={12} /> Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 px-4 py-2 border border-[rgba(79,195,247,0.3)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.6)] hover:text-[#4fc3f7] transition-all"
                      >
                        <Edit2 size={12} /> Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Hunter Stats */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-[rgba(79,195,247,0.1)]">
              <div className="text-center">
                <p className="text-2xl font-['Cinzel',serif] font-bold text-[#4fc3f7]">{countMissions}</p>
                <p className="text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.4)]">Missions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-['Cinzel',serif] font-bold text-[#4fe6a0]">{countClears}</p>
                <p className="text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.4)]">Clears</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-['Cinzel',serif] font-bold text-[#ffd54f]">{countSRank}</p>
                <p className="text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.4)]">S-Rank</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-['Cinzel',serif] font-bold text-[#ff6b6b]">{countTeam}</p>
                <p className="text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.4)]">Squad</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column - Contact & Info */}
          <div className="space-y-5">
            {/* Contact Information */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5">
              <h3 className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa] mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
                CONTACT DATA
              </h3>
              <div className="space-y-3">
                {[
                  { icon: <Mail size={14} />, name: "email", value: formData.email, type: "email" },
                  { icon: <Phone size={14} />, name: "phone", value: formData.phone, type: "tel" },
                  { icon: <MapPin size={14} />, name: "location", value: formData.location, type: "text" },
                  { icon: <Calendar size={14} />, value: "Joined: 01.2023", type: "static" },
                ].map((field, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[rgba(79,195,247,0.5)] text-xs tracking-[1px]">
                    <span className="opacity-60">{field.icon}</span>
                    {isEditing && field.type !== "static" ? (
                      <input
                        type={field.type}
                        name={field.name}
                        value={field.value}
                        onChange={handleInputChange}
                        className="flex-1 px-2 py-1 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-xs"
                      />
                    ) : (
                      <span>{field.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hunter Rank Info */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5">
              <h3 className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa] mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#ffd54f] shadow-[0_0_6px_#ffd54f]" />
                RANK STATUS
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[rgba(79,195,247,0.1)]">
                  <span className="text-[10px] tracking-[2px] text-[rgba(79,195,247,0.4)]">Current Rank</span>
                  <span className={`font-['Cinzel',serif] text-lg font-bold ${formData.rank === "S" ? "text-red-400" : formData.rank === "A" ? "text-amber-400" : "text-sky-400"}`}>
                    {formData.rank}-Rank
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[rgba(79,195,247,0.1)]">
                  <span className="text-[10px] tracking-[2px] text-[rgba(79,195,247,0.4)]">Clear Rate</span>
                  <span className="text-xs text-[#4fe6a0]">{(stats.clears / stats.missions * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[10px] tracking-[2px] text-[rgba(79,195,247,0.4)]">Guild Standing</span>
                  <span className="text-xs text-[#ffd54f]">Elite Vanguard</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5">
              <h3 className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa] mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#4fe6a0] shadow-[0_0_6px_#4fe6a0]" />
                NETWORK LINKS
              </h3>
              <div className="space-y-3">
                {[
                  { icon: <Globe2 size={14} />, name: "website", value: formData.website },
                  // { icon: <Github size={14} />, name: "github", value: formData.github },
                  // { icon: <Linkedin size={14} />, name: "linkedin", value: formData.linkedin },
                ].map((field, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="opacity-60">{field.icon}</span>
                    {isEditing ? (
                      <input
                        type="url"
                        name={field.name}
                        value={field.value}
                        onChange={handleInputChange}
                        className="flex-1 px-2 py-1 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-xs"
                      />
                    ) : (
                      <a href={field.value} target="_blank" rel="noopener noreferrer" className="text-xs text-[#4fc3f7] hover:text-[#4fc3f7]/80 transition-colors">
                        {field.value?.replace("https://", "").replace("http://", "")}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Bio & Settings */}
          <div className="lg:col-span-2 space-y-5">
            {/* Bio */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5">
              <h3 className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa] mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
                HUNTER PROFILE
              </h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm resize-none"
                />
              ) : (
                <p className="text-sm text-[rgba(79,195,247,0.5)] leading-relaxed tracking-wide">{formData.bio}</p>
              )}
            </div>

            {/* Security */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa] flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#ffd54f] shadow-[0_0_6px_#ffd54f]" />
                  SECURITY PROTOCOLS
                </h3>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="text-[10px] tracking-[2px] uppercase text-[#4fc3f7] hover:text-[#4fc3f7]/80"
                  >
                    Change Credentials
                  </button>
                )}
              </div>
              
              {isChangingPassword ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.4)]">Current Code</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.4)]">New Code</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.4)]">Confirm Code</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handlePasswordChange}
                      className="px-4 py-2 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[10px] tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      }}
                      className="px-4 py-2 border border-[rgba(79,195,247,0.3)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.6)] transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-[rgba(79,195,247,0.1)]">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-emerald-400" />
                      <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Two-Factor Auth</span>
                    </div>
                    <button className="text-[9px] tracking-[2px] uppercase text-[#4fc3f7]">Enable</button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-[rgba(79,195,247,0.1)]">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-amber-400" />
                      <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Login Alerts</span>
                    </div>
                    <button className="text-[9px] tracking-[2px] uppercase text-[#4fc3f7]">Configure</button>
                  </div>
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5">
              <h3 className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa] mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#4fe6a0] shadow-[0_0_6px_#4fe6a0]" />
                SYSTEM PREFERENCES
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Moon size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Dark Mode</span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      isDarkMode ? "bg-[#4fc3f7]" : "bg-[rgba(79,195,247,0.2)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        isDarkMode ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Mission Notifications</span>
                  </div>
                  <div className="w-9 h-5 rounded-full bg-[#4fc3f7] relative">
                    <span className="absolute right-1 top-1 w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Interface Language</span>
                  </div>
                  <select className="text-[10px] tracking-[1px] bg-transparent border border-[rgba(79,195,247,0.2)] px-2 py-1 text-[rgba(79,195,247,0.6)] focus:outline-none">
                    <option>ENGLISH</option>
                    <option>SPANISH</option>
                    <option>JAPANESE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-500/30 bg-red-500/5 p-5">
              <h3 className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-red-400 mb-2">DANGER ZONE</h3>
              <p className="text-[10px] tracking-[1.5px] text-red-400/60 mb-4">Termination of hunter credentials is irreversible. All mission data will be purged.</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/50 text-[10px] tracking-[2px] uppercase text-red-400 hover:bg-red-600/30 transition-all">
                <LogOut size={12} />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between mt-5 px-4 py-2 bg-[rgba(4,12,28,0.85)] border border-[rgba(79,195,247,0.1)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.25)]">
          <span>Hunter Registry v1.0 · Classified Data</span>
          <span className="text-[rgba(79,230,160,0.5)]">⬡ Authorization Active</span>
          <span>Last Authentication: Just Now</span>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
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