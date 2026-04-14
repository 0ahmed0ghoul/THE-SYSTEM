// frontend/src/features/settings/Settings.tsx
import { useState, useEffect } from "react";
import { useAuthStore } from "../features/auth/store/authStore";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Moon,
  Sun,
  LogOut,
  Save,
  Bell,
  Shield,
  Globe,
  Monitor,
  Smartphone,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Key,
  Fingerprint,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Lock,
  Zap,
  Database,
  RefreshCw,
  Users,
} from "lucide-react";

// ── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
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
  }, [target, duration]);
  return value;
}

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.email?.split("@")[0] || "Hunter");
  const [email, setEmail] = useState(user?.email || "hunter@system.io");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "system">("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    missionReminders: true,
    systemUpdates: false,
    teamMentions: true,
    soundEnabled: true,
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactor: false,
    biometricLogin: false,
    sessionTimeout: "30",
    showEmail: true,
  });

  // System settings
  const [system, setSystem] = useState({
    autoSync: true,
    dataSaver: false,
    highContrast: false,
    reduceMotion: false,
    language: "EN",
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }, 800);
  };

  const countSettings = useCountUp(Object.keys(notifications).length + Object.keys(security).length + Object.keys(system).length);

  const getTabStyle = (tab: string) => {
    return activeTab === tab
      ? "text-[#4fc3f7] border-b-2 border-[#4fc3f7]"
      : "text-[rgba(79,195,247,0.4)] hover:text-[rgba(79,195,247,0.7)] border-b-2 border-transparent";
  };

  return (
    <div className="sys-settings-page min-h-screen bg-[#020c1a] font-['Rajdhani',sans-serif] text-[#e0f7fa] relative">
      {/* Background Layers */}
      <div className="fixed inset-0 bg-[radial-gradient(circle,rgba(79,195,247,0.055)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0" />
      <div className="fixed w-[900px] h-[900px] top-[-300px] left-[-250px] bg-[radial-gradient(circle,rgba(2,80,160,0.13)_0%,transparent_70%)] rounded-full pointer-events-none z-0 blur-[20px]" />
      <div className="fixed w-[600px] h-[600px] bottom-[-200px] right-[-100px] bg-[radial-gradient(circle,rgba(79,195,247,0.07)_0%,transparent_70%)] rounded-full pointer-events-none z-0 blur-[20px]" />
      <div className="fixed inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(79,195,247,0.012)_2px,rgba(79,195,247,0.012)_4px)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1024px] mx-auto px-6 py-6">
        {/* Save Success Toast */}
        {showSaveSuccess && (
          <div className="fixed top-20 right-4 z-50 animate-[slide-in_0.3s_ease]">
            <div className="bg-[rgba(4,18,38,0.98)] border-l-2 border-emerald-400 px-4 py-3 shadow-lg flex items-center gap-3 backdrop-blur-sm">
              <CheckCircle size={16} className="text-emerald-400" />
              <span className="text-xs tracking-[1.5px] uppercase text-[#e0f7fa]">Configuration saved successfully</span>
            </div>
          </div>
        )}

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
              SYSTEM CONFIG
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-6 px-0.5 animate-[fade-in-up_0.4s_0.06s_ease_both]">
          <div className="font-['Cinzel',serif] text-3xl font-black tracking-[3px] bg-gradient-to-r from-[#e0f7fa] to-[#4fc3f7] bg-clip-text text-transparent">
            SYSTEM SETTINGS
          </div>
          <div className="text-[11px] tracking-[3px] uppercase text-[rgba(79,195,247,0.32)] mt-1">
            Hunter Configuration · System Parameters
          </div>
          <div className="h-px mt-3 bg-gradient-to-r from-[#4fc3f7] via-[rgba(79,195,247,0.1)] to-transparent" />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 animate-[fade-in-up_0.4s_0.12s_ease_both]">
          <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-4 relative overflow-hidden group hover:border-[rgba(79,195,247,0.45)] transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)]">Active Settings</p>
                <p className="font-['Cinzel',serif] text-2xl font-bold text-[#4fc3f7]">{countSettings}</p>
              </div>
              <Zap size={24} className="text-[rgba(79,195,247,0.3)] group-hover:text-[#4fc3f7] transition-colors" />
            </div>
          </div>
          <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-4 relative overflow-hidden group hover:border-[rgba(79,195,247,0.45)] transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4fe6a0] to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)]">Security Level</p>
                <p className="font-['Cinzel',serif] text-2xl font-bold text-[#4fe6a0]">ENHANCED</p>
              </div>
              <Shield size={24} className="text-[rgba(79,195,247,0.3)] group-hover:text-[#4fe6a0] transition-colors" />
            </div>
          </div>
          <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-4 relative overflow-hidden group hover:border-[rgba(79,195,247,0.45)] transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffd54f] to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)]">Hunter ID</p>
                <p className="font-['Cinzel',serif] text-lg font-bold text-[#ffd54f] tracking-wider">{user?.id?.toString().slice(0, 8) || "H-2024-01"}</p>
              </div>
              <Fingerprint size={24} className="text-[rgba(79,195,247,0.3)] group-hover:text-[#ffd54f] transition-colors" />
            </div>
          </div>
        </div>

        {/* Main Settings Panel */}
        <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] overflow-hidden animate-[fade-in-up_0.4s_0.18s_ease_both]">
          {/* Tab Navigation */}
          <div className="flex border-b border-[rgba(79,195,247,0.1)] px-5">
            {[
              { id: "profile", label: "PROFILE", icon: <User size={14} /> },
              { id: "security", label: "SECURITY", icon: <Shield size={14} /> },
              { id: "notifications", label: "NOTIFICATIONS", icon: <Bell size={14} /> },
              { id: "system", label: "SYSTEM", icon: <Database size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-[10px] font-semibold tracking-[2px] uppercase transition-all duration-200 ${getTabStyle(tab.id)}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-5 animate-[fade-in-up_0.3s_ease]">
                <div>
                  <label className="block text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">HUNTER DESIGNATION</label>
                  <div className="flex items-center gap-3 border border-[rgba(79,195,247,0.2)] p-3 bg-[rgba(4,18,38,0.5)] focus-within:border-[rgba(79,195,247,0.5)] transition-all">
                    <User size={16} className="text-[rgba(79,195,247,0.4)]" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Hunter Name"
                      className="flex-1 bg-transparent text-[#e0f7fa] text-sm tracking-wide focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">COMMS ADDRESS</label>
                  <div className="flex items-center gap-3 border border-[rgba(79,195,247,0.2)] p-3 bg-[rgba(4,18,38,0.5)] focus-within:border-[rgba(79,195,247,0.5)] transition-all">
                    <Mail size={16} className="text-[rgba(79,195,247,0.4)]" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="flex-1 bg-transparent text-[#e0f7fa] text-sm tracking-wide focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center justify-between p-3 border border-[rgba(79,195,247,0.1)]">
                    <div className="flex items-center gap-2">
                      <Eye size={14} className="text-[rgba(79,195,247,0.5)]" />
                      <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Profile Visibility</span>
                    </div>
                    <button className="text-[9px] tracking-[2px] uppercase text-[#4fc3f7] hover:text-[#4fc3f7]/80 transition-colors">
                      Public Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-4 animate-[fade-in-up_0.3s_ease]">
                <div className="flex items-center justify-between py-3 border-b border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center gap-3">
                    <Key size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Two-Factor Authentication</span>
                  </div>
                  <button
                    onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
                      security.twoFactor ? "bg-[#4fc3f7]" : "bg-[rgba(79,195,247,0.2)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                        security.twoFactor ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center gap-3">
                    <Fingerprint size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Biometric Authentication</span>
                  </div>
                  <button
                    onClick={() => setSecurity({ ...security, biometricLogin: !security.biometricLogin })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
                      security.biometricLogin ? "bg-[#4fc3f7]" : "bg-[rgba(79,195,247,0.2)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                        security.biometricLogin ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center gap-3">
                    <Lock size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Session Timeout</span>
                  </div>
                  <select
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                    className="text-[10px] tracking-[1px] bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] px-3 py-1 text-[rgba(79,195,247,0.6)] focus:outline-none"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="120">2 Hours</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <EyeOff size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Hide Email from Public</span>
                  </div>
                  <button
                    onClick={() => setSecurity({ ...security, showEmail: !security.showEmail })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
                      !security.showEmail ? "bg-[#4fc3f7]" : "bg-[rgba(79,195,247,0.2)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                        !security.showEmail ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-4 animate-[fade-in-up_0.3s_ease]">
                <div className="flex items-center justify-between py-3 border-b border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center gap-3">
                    <Mail size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Email Alerts</span>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, emailAlerts: !notifications.emailAlerts })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
                      notifications.emailAlerts ? "bg-[#4fc3f7]" : "bg-[rgba(79,195,247,0.2)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                        notifications.emailAlerts ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center gap-3">
                    <Bell size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Mission Reminders</span>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, missionReminders: !notifications.missionReminders })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
                      notifications.missionReminders ? "bg-[#4fc3f7]" : "bg-[rgba(79,195,247,0.2)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                        notifications.missionReminders ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center gap-3">
                    <Users size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Team Mentions</span>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, teamMentions: !notifications.teamMentions })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
                      notifications.teamMentions ? "bg-[#4fc3f7]" : "bg-[rgba(79,195,247,0.2)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                        notifications.teamMentions ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    {notifications.soundEnabled ? (
                      <Volume2 size={14} className="text-[rgba(79,195,247,0.5)]" />
                    ) : (
                      <VolumeX size={14} className="text-[rgba(79,195,247,0.5)]" />
                    )}
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Sound Effects</span>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, soundEnabled: !notifications.soundEnabled })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
                      notifications.soundEnabled ? "bg-[#4fc3f7]" : "bg-[rgba(79,195,247,0.2)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                        notifications.soundEnabled ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === "system" && (
              <div className="space-y-4 animate-[fade-in-up_0.3s_ease]">
                <div className="flex items-center justify-between py-3 border-b border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center gap-3">
                    <RefreshCw size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Auto-Sync Data</span>
                  </div>
                  <button
                    onClick={() => setSystem({ ...system, autoSync: !system.autoSync })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
                      system.autoSync ? "bg-[#4fc3f7]" : "bg-[rgba(79,195,247,0.2)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                        system.autoSync ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center gap-3">
                    <Moon size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Dark Mode Interface</span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
                      isDarkMode ? "bg-[#4fc3f7]" : "bg-[rgba(79,195,247,0.2)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                        isDarkMode ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center gap-3">
                    <Monitor size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">High Contrast Mode</span>
                  </div>
                  <button
                    onClick={() => setSystem({ ...system, highContrast: !system.highContrast })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
                      system.highContrast ? "bg-[#4fc3f7]" : "bg-[rgba(79,195,247,0.2)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                        system.highContrast ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[rgba(79,195,247,0.1)]">
                  <div className="flex items-center gap-3">
                    <Globe size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Interface Language</span>
                  </div>
                  <select
                    value={system.language}
                    onChange={(e) => setSystem({ ...system, language: e.target.value })}
                    className="text-[10px] tracking-[1px] bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] px-3 py-1 text-[rgba(79,195,247,0.6)] focus:outline-none"
                  >
                    <option value="EN">ENGLISH</option>
                    <option value="ES">SPANISH</option>
                    <option value="JA">JAPANESE</option>
                    <option value="KO">KOREAN</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Smartphone size={14} className="text-[rgba(79,195,247,0.5)]" />
                    <span className="text-xs tracking-[1px] text-[rgba(79,195,247,0.6)]">Data Saver Mode</span>
                  </div>
                  <button
                    onClick={() => setSystem({ ...system, dataSaver: !system.dataSaver })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
                      system.dataSaver ? "bg-[#4fc3f7]" : "bg-[rgba(79,195,247,0.2)]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                        system.dataSaver ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 mt-4 border-t border-[rgba(79,195,247,0.1)]">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center justify-center gap-2 flex-1 px-5 py-2.5 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[10px] tracking-[2px] uppercase text-[#4fc3f7] transition-all duration-300 ${
                  isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-[rgba(79,195,247,0.2)] hover:shadow-[0_0_12px_rgba(79,195,247,0.3)]"
                }`}
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    SAVING...
                  </>
                ) : (
                  <>
                    <Save size={12} />
                    SAVE CONFIGURATION
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 border border-red-500/50 text-[10px] tracking-[2px] uppercase text-red-400 hover:bg-red-600/20 transition-all duration-300 hover:shadow-[0_0_12px_rgba(255,100,100,0.3)]"
              >
                <LogOut size={12} />
                TERMINATE SESSION
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between mt-5 px-4 py-2 bg-[rgba(4,12,28,0.85)] border border-[rgba(79,195,247,0.1)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.25)] animate-[fade-in-up_0.4s_0.24s_ease_both]">
          <span>System Config v1.0 · Parameters Applied</span>
          <span className="text-[rgba(79,230,160,0.5)]">⬡ Configuration Active</span>
          <span>Last Sync: Just Now</span>
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