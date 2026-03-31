import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskStore } from "../store/taskStore";
import {
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react";
import CreateProjectModal from "../features/projects/components/CreateProjectModal";
import { useProjectStore, type Project } from "../store/projectStore";

type ViewType = "projects" | "tasks";

// ── Rank assignment helpers ──────────────────────────────────────────────────
function getProjectRank(priority: string): "S" | "A" | "B" | "C" | "D" {
  return (
    ({ urgent: "S", high: "A", medium: "B", low: "C" } as Record<string, any>)[
      priority
    ] ?? "D"
  );
}

function getRankStyle(rank: string) {
  return (
    {
      S: {
        badge: "text-red-400 border-red-500/40 bg-red-500/5 shadow-[0_0_8px_rgba(255,100,100,0.4)]",
        text: "text-red-400",
      },
      A: {
        badge: "text-amber-400 border-amber-500/40 bg-amber-500/5 shadow-[0_0_8px_rgba(255,180,70,0.4)]",
        text: "text-amber-400",
      },
      B: {
        badge: "text-sky-300 border-sky-400/40 bg-sky-400/5 shadow-[0_0_8px_rgba(79,195,247,0.4)]",
        text: "text-sky-300",
      },
      C: {
        badge: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_8px_rgba(79,230,160,0.4)]",
        text: "text-emerald-400",
      },
      D: {
        badge: "text-sky-500/50 border-sky-500/20 bg-transparent",
        text: "text-sky-500/50",
      },
    }[rank] ?? { badge: "text-sky-500/50 border-sky-500/20", text: "text-sky-500/50" }
  );
}

function getStatusTag(status: string) {
  return (
    {
      active: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
      planning: "text-sky-400 border-sky-400/30 bg-sky-400/5",
      onHold: "text-amber-400 border-amber-500/30 bg-amber-500/5",
      completed: "text-sky-500/50 border-sky-500/20 bg-transparent",
      archived: "text-sky-500/30 border-sky-500/15 bg-transparent",
    }[status] ?? "text-sky-500/30 border-sky-500/15"
  );
}

function statusLabel(status: string) {
  return (
    ({
      active: "ACTIVE",
      planning: "PLANNING",
      onHold: "ON HOLD",
      completed: "CLEARED",
      archived: "ARCHIVED",
    } as Record<string, string>)[status] ?? status.toUpperCase()
  );
}

function taskStatusStyle(status: string) {
  return (
    {
      todo: { cls: "text-sky-400/50 border-sky-400/20", label: "STANDBY" },
      inprogress: { cls: "text-amber-400 border-amber-400/35", label: "IN PROGRESS" },
      review: { cls: "text-emerald-400 border-emerald-400/35", label: "REVIEW" },
      done: { cls: "text-sky-500/30 border-sky-500/15", label: "DONE" },
    }[status] ?? { cls: "text-sky-400/50 border-sky-400/20", label: status.toUpperCase() }
  );
}

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

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
  barWidth,
  delay,
}: {
  label: string;
  value: number;
  sub: string;
  accent: string;
  icon: string;
  barWidth: number;
  delay: string;
}) {
  const count = useCountUp(value);
  return (
    <div
      className="relative bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 overflow-hidden
                 hover:border-[rgba(79,195,247,0.45)] transition-colors duration-300"
      style={{ animationDelay: delay, animation: "fade-in-up 0.5s ease both" }}
    >
      {/* top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      {/* corner brackets */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[rgba(79,195,247,0.3)]" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[rgba(79,195,247,0.3)]" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-[rgba(79,195,247,0.45)]">
          {label}
        </span>
        <span className="text-lg opacity-40">{icon}</span>
      </div>
      <div
        className="font-[Cinzel,serif] text-4xl font-black leading-none mb-1"
        style={{ color: accent, textShadow: `0 0 20px ${accent}66` }}
      >
        {count}
      </div>
      <div className="text-[11px] tracking-[1px] text-[rgba(79,195,247,0.35)] mt-1">{sub}</div>
      <div className="h-[2px] mt-3 bg-[rgba(79,195,247,0.06)] overflow-hidden">
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{
            width: `${barWidth}%`,
            background: accent,
            boxShadow: `0 0 6px ${accent}`,
          }}
        />
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ViewType>("projects");
  const [activeTab, setActiveTab] = useState("all");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const { projects, addProject, getProjectStats } = useProjectStore();
  const { tasks } = useTaskStore();

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);

  const stats = getProjectStats();

  useEffect(() => {
    let filtered = projects;
    if (activeTab === "active") filtered = projects.filter((p) => p.status === "active");
    else if (activeTab === "planning") filtered = projects.filter((p) => p.status === "planning");
    else if (activeTab === "done") filtered = projects.filter((p) => p.status === "completed");
    else filtered = projects.filter((p) => p.status === "active" || p.status === "planning");
    setRecentProjects(filtered.slice(0, 6));
  }, [projects, activeTab]);

  useEffect(() => {
    setUpcomingTasks(tasks.filter((t) => t.status !== "done").slice(0, 8));
  }, [tasks]);

  const handleAddProject = async (projectData: Partial<Project>) => {
    addProject({
      name: projectData.name!,
      description: projectData.description || "",
      startDate: projectData.startDate,
      dueDate: projectData.dueDate,
      priority: projectData.priority || "medium",
      status: projectData.status || "planning",
      category: projectData.category,
      progress: projectData.progress || 0,
      estimatedHours: projectData.estimatedHours,
      budget: projectData.budget,
      projectLead: projectData.projectLead,
      clientName: projectData.clientName,
      teamMembers: projectData.teamMembers || [],
      tags: projectData.tags || [],
      goals: projectData.goals || [],
      visibility: projectData.visibility || "private",
      requiresApproval: projectData.requiresApproval || false,
    });
    setIsProjectModalOpen(false);
  };

  const urgentCount = projects.filter((p) => p.priority === "urgent").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        :root {
          --sys-blue: #4fc3f7;
          --sys-green: #4fe6a0;
          --sys-gold: #ffd54f;
          --sys-red: #ff6b6b;
          --sys-amber: #ffb347;
          --sys-dark: #020c1a;
          --sys-panel: rgba(4,18,38,0.95);
          --sys-border: rgba(79,195,247,0.2);
        }

        .sys-dashboard {
          min-height: 100vh;
          background: var(--sys-dark);
          font-family: 'Rajdhani', sans-serif;
          color: #e0f7fa;
          position: relative;
          overflow-x: hidden;
        }

        /* Background layers */
        .sys-bg-grid {
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, rgba(79,195,247,0.055) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none; z-index: 0;
        }
        .sys-bg-orb1 {
          position: fixed; width: 900px; height: 900px; top: -300px; left: -250px;
          background: radial-gradient(circle, rgba(2,80,160,0.13) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(20px);
        }
        .sys-bg-orb2 {
          position: fixed; width: 600px; height: 600px; bottom: -200px; right: -100px;
          background: radial-gradient(circle, rgba(79,195,247,0.07) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(20px);
        }
        .sys-scanlines {
          position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(79,195,247,0.012) 2px, rgba(79,195,247,0.012) 4px);
          pointer-events: none; z-index: 0;
        }
        .sys-content { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; padding: 20px 24px; }

        /* Topbar */
        .sys-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px;
          background: rgba(4,12,28,0.92);
          border: 1px solid var(--sys-border);
          margin-bottom: 22px;
          position: relative; overflow: hidden;
        }
        .sys-topbar::after {
          content: '';
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,0.025), transparent);
          animation: tb-sweep 7s ease-in-out infinite;
        }
        @keyframes tb-sweep { 0% { left:-100% } 60% { left:160% } 100% { left:160% } }

        .sys-logo { display: flex; align-items: center; gap: 10px; }
        .sys-logo-icon {
          width: 34px; height: 34px;
          border: 1px solid rgba(79,195,247,0.4);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif; font-size: 14px; font-weight: 700; color: var(--sys-blue);
          position: relative;
        }
        .sys-logo-icon::before {
          content: ''; position: absolute; inset: -4px;
          border: 1px solid rgba(79,195,247,0.13);
        }
        .sys-logo-name {
          font-family: 'Cinzel', serif; font-size: 16px; font-weight: 700;
          letter-spacing: 3px; color: #e0f7fa;
        }
        .sys-topbar-meta { display: flex; align-items: center; gap: 18px; }
        .sys-tb-item {
          font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,0.35); display: flex; align-items: center; gap: 5px;
        }
        .sys-online-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--sys-green);
          animation: dot-pulse 2s ease-in-out infinite;
        }
        @keyframes dot-pulse {
          0%,100% { opacity:1; box-shadow: 0 0 4px var(--sys-green); }
          50%      { opacity:0.4; box-shadow: none; }
        }
        .sys-rank-badge {
          font-family: 'Cinzel', serif; font-size: 11px; font-weight: 700;
          letter-spacing: 3px; color: var(--sys-gold);
          border: 1px solid rgba(255,213,79,0.35);
          padding: 3px 12px;
          text-shadow: 0 0 10px rgba(255,213,79,0.45);
        }

        /* Page header */
        .sys-page-head { margin-bottom: 22px; padding: 0 2px; }
        .sys-page-title {
          font-family: 'Cinzel', serif; font-size: 28px; font-weight: 900;
          letter-spacing: 3px;
          background: linear-gradient(135deg, #e0f7fa, var(--sys-blue));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .sys-page-sub {
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(79,195,247,0.32); margin-top: 3px;
        }
        .sys-page-divider {
          height: 1px; margin-top: 12px;
          background: linear-gradient(90deg, var(--sys-blue), rgba(79,195,247,0.1), transparent);
        }

        /* Stats grid */
        .sys-stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px; margin-bottom: 22px;
        }

        /* Content grid */
        .sys-content-grid {
          display: grid; grid-template-columns: 1fr 340px;
          gap: 14px;
        }

        /* Panel shared */
        .sys-panel {
          background: var(--sys-panel);
          border: 1px solid var(--sys-border);
          overflow: hidden;
        }
        .sys-panel-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(79,195,247,0.1);
        }
        .sys-panel-head-left { display: flex; align-items: center; gap: 10px; }
        .sys-panel-badge {
          width: 3px; height: 16px;
          background: var(--sys-blue);
          box-shadow: 0 0 6px var(--sys-blue);
        }
        .sys-panel-title {
          font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700;
          letter-spacing: 2px; color: #e0f7fa;
        }
        .sys-panel-count {
          font-size: 10px; letter-spacing: 2px;
          background: rgba(79,195,247,0.07);
          border: 1px solid rgba(79,195,247,0.2);
          padding: 2px 8px;
          color: rgba(79,195,247,0.55);
        }
        .sys-new-btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,0.4);
          background: none;
          border: 1px solid rgba(79,195,247,0.2);
          padding: 5px 12px; cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          transition: all 0.2s;
        }
        .sys-new-btn:hover { border-color: var(--sys-blue); color: var(--sys-blue); }

        /* Gate alert */
        .sys-gate-alert {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 18px;
          background: rgba(255,107,107,0.04);
          border-left: 2px solid rgba(255,107,107,0.6);
        }
        .sys-alert-tag {
          font-family: 'Cinzel', serif; font-size: 10px; font-weight: 700;
          color: var(--sys-red);
          border: 1px solid rgba(255,107,107,0.4);
          padding: 1px 7px;
          animation: alert-pulse 2s ease-in-out infinite;
        }
        @keyframes alert-pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        .sys-alert-txt {
          font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(255,107,107,0.65);
        }

        /* Tab row */
        .sys-tab-row {
          display: flex; gap: 0;
          border-bottom: 1px solid rgba(79,195,247,0.1);
          padding: 0 18px;
        }
        .sys-tab {
          font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          padding: 10px 14px; cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          color: rgba(79,195,247,0.35);
          background: none; border-left: none; border-right: none; border-top: none;
          font-family: 'Rajdhani', sans-serif;
        }
        .sys-tab.active { color: var(--sys-blue); border-bottom-color: var(--sys-blue); }
        .sys-tab:hover:not(.active) { color: rgba(79,195,247,0.6); }

        /* Project rows */
        .sys-proj-list { max-height: 460px; overflow-y: auto; }
        .sys-proj-list::-webkit-scrollbar { width: 3px; }
        .sys-proj-list::-webkit-scrollbar-track { background: transparent; }
        .sys-proj-list::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.18); }

        .sys-proj-row {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 15px 18px;
          border-bottom: 1px solid rgba(79,195,247,0.07);
          cursor: pointer; position: relative;
          transition: background 0.2s;
        }
        .sys-proj-row:hover { background: rgba(79,195,247,0.04); }
        .sys-proj-row:hover .sys-pr-corners { opacity: 1; }

        /* Corner hover effect */
        .sys-pr-corners {
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0; transition: opacity 0.2s;
        }
        .sys-pr-corners::before, .sys-pr-corners::after,
        .sys-pr-corners .prc-br, .sys-pr-corners .prc-bl {
          content: ''; position: absolute;
          width: 10px; height: 10px;
          border-color: rgba(79,195,247,0.38); border-style: solid;
        }
        .sys-pr-corners::before { top: 4px; left: 4px; border-width: 1px 0 0 1px; }
        .sys-pr-corners::after  { top: 4px; right: 4px; border-width: 1px 1px 0 0; }
        .sys-pr-corners .prc-br { bottom: 4px; right: 4px; border-width: 0 1px 1px 0; }
        .sys-pr-corners .prc-bl { bottom: 4px; left: 4px; border-width: 0 0 1px 1px; }

        /* Rank badge */
        .sys-rank-box {
          width: 36px; height: 36px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif; font-size: 16px; font-weight: 900;
          border: 1px solid; position: relative;
        }

        /* Project body */
        .sys-pr-name {
          font-size: 14px; font-weight: 600; letter-spacing: 0.4px;
          color: #c8e8f8; transition: color 0.2s;
        }
        .sys-proj-row:hover .sys-pr-name { color: #fff; }
        .sys-pr-tag {
          font-size: 9px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
          padding: 2px 7px; border: 1px solid; flex-shrink: 0;
        }
        .sys-pr-desc {
          font-size: 12px; color: rgba(79,195,247,0.32);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin: 4px 0 8px;
        }
        .sys-pr-meta { display: flex; align-items: center; gap: 14px; }
        .sys-pr-meta-item {
          font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(79,195,247,0.3); display: flex; align-items: center; gap: 4px;
        }
        .sys-pr-prog-label {
          display: flex; justify-content: space-between;
          font-size: 10px; letter-spacing: 1px;
          color: rgba(79,195,247,0.3); margin-bottom: 4px;
        }
        .sys-pr-track {
          height: 3px; background: rgba(79,195,247,0.08); overflow: hidden;
        }
        .sys-pr-fill { height: 100%; transition: width 1s ease; }

        /* Empty state */
        .sys-empty {
          padding: 48px; text-align: center;
        }
        .sys-empty-icon {
          font-size: 40px; opacity: 0.15; margin-bottom: 12px;
        }
        .sys-empty-txt {
          font-size: 13px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,0.3);
        }
        .sys-empty-link {
          margin-top: 10px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,0.4); background: none; border: none; cursor: pointer;
          font-family: 'Rajdhani', sans-serif; transition: color 0.2s;
        }
        .sys-empty-link:hover { color: var(--sys-blue); }

        /* New project dashed btn */
        .sys-add-gate {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin: 14px 18px;
          padding: 9px;
          border: 1px dashed rgba(79,195,247,0.18);
          font-family: 'Cinzel', serif; font-size: 10px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase;
          color: rgba(79,195,247,0.3);
          cursor: pointer; background: none; width: calc(100% - 36px);
          transition: all 0.2s;
        }
        .sys-add-gate:hover {
          border-color: rgba(79,195,247,0.45);
          color: var(--sys-blue);
          background: rgba(79,195,247,0.03);
        }

        /* View more */
        .sys-view-more {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          padding: 10px; width: 100%;
          font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(79,195,247,0.28);
          background: none;
          border: none; border-top: 1px solid rgba(79,195,247,0.08);
          cursor: pointer; font-family: 'Rajdhani', sans-serif;
          transition: color 0.2s;
        }
        .sys-view-more:hover { color: var(--sys-blue); }

        /* Quest board */
        .sys-quest-item {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(79,195,247,0.07);
          cursor: pointer; transition: background 0.2s;
        }
        .sys-quest-item:hover { background: rgba(79,195,247,0.04); }
        .sys-quest-title {
          font-size: 13px; font-weight: 500; letter-spacing: 0.3px;
          color: #c0dff0; line-height: 1.3;
        }
        .sys-quest-status {
          font-size: 9px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
          padding: 2px 7px; border: 1px solid;
        }

        /* Mini stat cards */
        .sys-mini-stats {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 8px; padding: 14px 16px;
        }
        .sys-ms-item {
          background: rgba(79,195,247,0.03);
          border: 1px solid rgba(79,195,247,0.1);
          padding: 10px 12px;
        }
        .sys-ms-val {
          font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700;
        }
        .sys-ms-label {
          font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,0.32); margin-top: 2px;
        }

        /* Activity feed */
        .sys-act-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 9px 16px;
          border-bottom: 1px solid rgba(79,195,247,0.06);
        }
        .sys-act-dot {
          width: 7px; height: 7px;
          transform: rotate(45deg); border-radius: 1px;
          flex-shrink: 0; margin-top: 3px;
        }
        .sys-act-txt {
          font-size: 12px; color: rgba(200,230,255,0.45); letter-spacing: 0.3px; line-height: 1.4;
        }
        .sys-act-time {
          font-size: 10px; color: rgba(79,195,247,0.22); letter-spacing: 1px; margin-top: 2px;
        }

        /* Bottom bar */
        .sys-bottom-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 14px; padding: 8px 16px;
          background: rgba(4,12,28,0.85);
          border: 1px solid rgba(79,195,247,0.1);
          font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(79,195,247,0.25);
        }

        /* Animations */
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .sys-content-grid { grid-template-columns: 1fr; }
          .sys-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .sys-stats-grid { grid-template-columns: 1fr 1fr; }
          .sys-topbar-meta { display: none; }
        }
      `}</style>

      <div className="sys-dashboard">
        <div className="sys-bg-grid" />
        <div className="sys-bg-orb1" />
        <div className="sys-bg-orb2" />
        <div className="sys-scanlines" />

        <div className="sys-content">

          {/* ── TOPBAR ──────────────────────────────────────────── */}
          <div className="sys-topbar" style={{ animation: "fade-in-up .4s ease both" }}>
            <div className="sys-logo">
              <div className="sys-logo-icon">S</div>
              <span className="sys-logo-name">THE SYSTEM</span>
            </div>
            <div className="sys-topbar-meta">
              <span className="sys-tb-item">
                <span className="sys-online-dot" />
                Command Active
              </span>
              <span className="sys-tb-item">
                Gates: {stats.active + stats.planning} Open
              </span>
              <span className="sys-tb-item">
                Quests: {upcomingTasks.length} Active
              </span>
              <div className="sys-rank-badge">S-RANK HUNTER</div>
            </div>
          </div>

          {/* ── PAGE HEADER ─────────────────────────────────────── */}
          <div className="sys-page-head" style={{ animation: "fade-in-up .4s .06s ease both" }}>
            <div className="sys-page-title">COMMAND CENTER</div>
            <div className="sys-page-sub">Hunter Operations Dashboard · All systems operational</div>
            <div className="sys-page-divider" />
          </div>

          {/* ── STAT CARDS ──────────────────────────────────────── */}
          <div className="sys-stats-grid">
            <StatCard
              label="Active Gates"
              value={stats.active + stats.planning}
              sub={`${stats.active} in progress`}
              accent="#4fc3f7"
              icon="⬡"
              barWidth={Math.min(((stats.active + stats.planning) / Math.max(stats.total, 1)) * 100, 100)}
              delay="0.08s"
            />
            <StatCard
              label="Cleared"
              value={stats.completed}
              sub="Gates cleared"
              accent="#4fe6a0"
              icon="✦"
              barWidth={Math.min((stats.completed / Math.max(stats.total, 1)) * 100, 100)}
              delay="0.12s"
            />
            <StatCard
              label="Active Quests"
              value={upcomingTasks.length}
              sub="Tasks in queue"
              accent="#ffd54f"
              icon="◈"
              barWidth={Math.min((upcomingTasks.length / 20) * 100, 100)}
              delay="0.16s"
            />
            <StatCard
              label="On Hold"
              value={stats.onHold}
              sub="Suspended operations"
              accent="#ff6b6b"
              icon="⚠"
              barWidth={Math.min((stats.onHold / Math.max(stats.total, 1)) * 100, 100)}
              delay="0.2s"
            />
          </div>

          {/* ── CONTENT GRID ────────────────────────────────────── */}
          <div className="sys-content-grid">

            {/* LEFT: Projects or Tasks */}
            <div className="sys-panel" style={{ animation: "fade-in-up .4s .22s ease both" }}>
              <div className="sys-panel-head">
                <div className="sys-panel-head-left">
                  {/* Toggle inside panel head */}
                  <div
                    className="sys-panel-badge"
                    style={
                      activeView === "tasks"
                        ? { background: "var(--sys-gold)", boxShadow: "0 0 6px var(--sys-gold)" }
                        : {}
                    }
                  />
                  <button
                    onClick={() => setActiveView("projects")}
                    className="sys-tab"
                    style={
                      activeView === "projects"
                        ? { padding: "0 10px 0 0", color: "#e0f7fa", fontFamily: "'Cinzel', serif", fontSize: "13px", letterSpacing: "2px", borderBottom: "none", fontWeight: "700" }
                        : { padding: "0 10px 0 0", borderBottom: "none", opacity: 0.4 }
                    }
                  >
                    ACTIVE GATES
                  </button>
                  <span style={{ color: "rgba(79,195,247,0.2)", fontSize: 12 }}>|</span>
                  <button
                    onClick={() => setActiveView("tasks")}
                    className="sys-tab"
                    style={
                      activeView === "tasks"
                        ? { padding: "0 0 0 10px", color: "#e0f7fa", fontFamily: "'Cinzel', serif", fontSize: "13px", letterSpacing: "2px", borderBottom: "none", fontWeight: "700" }
                        : { padding: "0 0 0 10px", borderBottom: "none", opacity: 0.4 }
                    }
                  >
                    QUEST BOARD
                  </button>
                  <span className="sys-panel-count">
                    {activeView === "projects" ? `${recentProjects.length} OPEN` : `${upcomingTasks.length} ACTIVE`}
                  </span>
                </div>
                <button className="sys-new-btn" onClick={() => setIsProjectModalOpen(true)}>
                  <Plus size={12} />
                  {activeView === "projects" ? "OPEN GATE" : "ADD QUEST"}
                </button>
              </div>

              {/* Urgent alert */}
              {urgentCount > 0 && activeView === "projects" && (
                <div className="sys-gate-alert">
                  <AlertTriangle size={13} style={{ color: "var(--sys-red)", flexShrink: 0 }} />
                  <span className="sys-alert-tag">URGENT</span>
                  <span className="sys-alert-txt">
                    {urgentCount} S-Rank gate{urgentCount > 1 ? "s" : ""} requiring immediate attention
                  </span>
                </div>
              )}

              {/* Tabs – projects view */}
              {activeView === "projects" && (
                <div className="sys-tab-row">
                  {["all", "active", "planning", "done"].map((t) => (
                    <button
                      key={t}
                      className={`sys-tab${activeTab === t ? " active" : ""}`}
                      onClick={() => setActiveTab(t)}
                    >
                      {t === "all" ? "All Gates" : t === "active" ? "Active" : t === "planning" ? "Planning" : "Cleared"}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Projects List ── */}
              {activeView === "projects" && (
                <>
                  <div className="sys-proj-list">
                    {recentProjects.length > 0 ? (
                      recentProjects.map((project) => {
                        const rank = getProjectRank(project.priority ?? "medium");
                        const rs = getRankStyle(rank);
                        const prog = project.progress ?? 0;
                        const progColor =
                          prog > 60 ? "var(--sys-blue)" : prog > 30 ? "var(--sys-amber)" : "var(--sys-red)";

                        return (
                          <div
                            key={project.id}
                            className="sys-proj-row"
                            onClick={() => navigate(`/projects/${project.id}`)}
                          >
                            <div className="sys-pr-corners">
                              <div className="prc-br" />
                              <div className="prc-bl" />
                            </div>

                            {/* Rank box */}
                            <div className={`sys-rank-box ${rs.badge}`}>{rank}</div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="sys-pr-name">{project.name}</span>
                                {project.status && (
                                  <span className={`sys-pr-tag ${getStatusTag(project.status)}`}>
                                    {statusLabel(project.status)}
                                  </span>
                                )}
                              </div>

                              {project.description && (
                                <div className="sys-pr-desc">{project.description}</div>
                              )}

                              <div className="sys-pr-meta">
                                {project.teamMembers && project.teamMembers.length > 0 && (
                                  <span className="sys-pr-meta-item">
                                    <Users size={10} /> {project.teamMembers.length} hunters
                                  </span>
                                )}
                                {project.dueDate && (
                                  <span className="sys-pr-meta-item">
                                    <Calendar size={10} />
                                    {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </span>
                                )}
                                <span className={`sys-pr-meta-item font-semibold ${rs.text}`}>
                                  {rank}-Rank Gate
                                </span>

                                <button
                                  onClick={(e) => { e.stopPropagation(); }}
                                  className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 transition-all"
                                  style={{ opacity: 0 }}
                                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                                >
                                  <MoreHorizontal size={14} style={{ color: "rgba(79,195,247,0.35)" }} />
                                </button>
                              </div>

                              {/* Progress bar */}
                              <div className="mt-3">
                                <div className="sys-pr-prog-label">
                                  <span>PROGRESS</span>
                                  <span style={{ color: progColor }}>{prog}%</span>
                                </div>
                                <div className="sys-pr-track">
                                  <div
                                    className="sys-pr-fill"
                                    style={{
                                      width: `${prog}%`,
                                      background: `linear-gradient(90deg, rgba(79,195,247,0.3), ${progColor})`,
                                      boxShadow: `0 0 5px ${progColor}`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="sys-empty">
                        <div className="sys-empty-icon">⬡</div>
                        <div className="sys-empty-txt">No gates found</div>
                        <button
                          className="sys-empty-link"
                          onClick={() => setIsProjectModalOpen(true)}
                        >
                          Open first gate →
                        </button>
                      </div>
                    )}
                  </div>

                  <button className="sys-add-gate" onClick={() => setIsProjectModalOpen(true)}>
                    ⊕ REGISTER NEW GATE
                  </button>
                  {recentProjects.length > 0 && (
                    <button className="sys-view-more" onClick={() => navigate("/projects")}>
                      VIEW ALL GATES <ArrowUpRight size={11} />
                    </button>
                  )}
                </>
              )}

              {/* ── Tasks List ── */}
              {activeView === "tasks" && (
                <>
                  <div className="sys-proj-list">
                    {upcomingTasks.length > 0 ? (
                      upcomingTasks.map((task) => {
                        const rank = getProjectRank(task.priority ?? "medium");
                        const rs = getRankStyle(rank);
                        const ts = taskStatusStyle(task.status);

                        return (
                          <div
                            key={task.id}
                            className="sys-proj-row"
                            onClick={() => navigate(`/tasks/${task.id}`)}
                          >
                            <div className="sys-pr-corners">
                              <div className="prc-br" /><div className="prc-bl" />
                            </div>
                            <div className={`sys-rank-box ${rs.badge}`}>{rank}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="sys-pr-name">{task.title}</span>
                                <span className={`sys-quest-status ${ts.cls}`}>{ts.label}</span>
                              </div>
                              {task.projectName && (
                                <div className="sys-pr-desc">{task.projectName}</div>
                              )}
                              <div className="sys-pr-meta">
                                {task.dueDate && (
                                  <span className="sys-pr-meta-item">
                                    <Calendar size={10} />
                                    {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </span>
                                )}
                                <span className="sys-pr-meta-item">
                                  <Clock size={10} />
                                  {task.status === "inprogress" ? "In Progress" : task.status === "review" ? "Under Review" : "Standby"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="sys-empty">
                        <div className="sys-empty-icon">✦</div>
                        <div className="sys-empty-txt">Quest board is clear</div>
                        <div className="sys-act-time" style={{ textAlign: "center", marginTop: 6 }}>
                          All quests completed. Outstanding work, Hunter.
                        </div>
                      </div>
                    )}
                  </div>

                  {upcomingTasks.length > 0 && (
                    <button className="sys-view-more" onClick={() => navigate("/tasks")}>
                      VIEW ALL QUESTS <ArrowUpRight size={11} />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* ── RIGHT SIDEBAR ─────────────────────────────────── */}
            <div className="flex flex-col gap-3">

              {/* System Stats */}
              <div className="sys-panel" style={{ animation: "fade-in-up .4s .28s ease both" }}>
                <div className="sys-panel-head">
                  <div className="sys-panel-head-left">
                    <div className="sys-panel-badge" style={{ background: "var(--sys-green)", boxShadow: "0 0 6px var(--sys-green)" }} />
                    <span className="sys-panel-title">SYSTEM METRICS</span>
                  </div>
                </div>
                <div className="sys-mini-stats">
                  {[
                    {
                      val: stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : "0%",
                      label: "Completion",
                      color: "var(--sys-blue)",
                    },
                    { val: `+${stats.active}`, label: "This Cycle", color: "var(--sys-green)" },
                    { val: `${upcomingTasks.filter(t => t.status === "inprogress").length}`, label: "In Progress", color: "var(--sys-gold)" },
                    {
                      val: `${projects.filter(p => p.priority === "urgent" || p.priority === "high").length}`,
                      label: "High Priority",
                      color: "var(--sys-red)",
                    },
                  ].map((m, i) => (
                    <div key={i} className="sys-ms-item">
                      <div className="sys-ms-val" style={{ color: m.color, textShadow: `0 0 14px ${m.color}66` }}>
                        {m.val}
                      </div>
                      <div className="sys-ms-label">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent quests when in projects view */}
              {activeView === "projects" && upcomingTasks.length > 0 && (
                <div className="sys-panel" style={{ animation: "fade-in-up .4s .32s ease both" }}>
                  <div className="sys-panel-head">
                    <div className="sys-panel-head-left">
                      <div className="sys-panel-badge" style={{ background: "var(--sys-gold)", boxShadow: "0 0 6px var(--sys-gold)" }} />
                      <span className="sys-panel-title">PENDING QUESTS</span>
                    </div>
                    <span className="sys-panel-count" style={{ color: "rgba(255,213,79,0.5)", borderColor: "rgba(255,213,79,0.2)" }}>
                      {upcomingTasks.length} ACTIVE
                    </span>
                  </div>
                  {upcomingTasks.slice(0, 5).map((task) => {
                    const rank = getProjectRank(task.priority ?? "medium");
                    const rs = getRankStyle(rank);
                    const ts = taskStatusStyle(task.status);
                    return (
                      <div
                        key={task.id}
                        className="sys-quest-item"
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className={`font-[Cinzel,serif] text-[13px] font-bold flex-shrink-0 mt-0.5 ${rs.text}`}>
                            {rank}
                          </span>
                          <span className="sys-quest-title">{task.title}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="sys-pr-meta-item">
                            {task.dueDate && (
                              <><Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
                            )}
                          </span>
                          <span className={`sys-quest-status ${ts.cls}`}>{ts.label}</span>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    className="sys-view-more"
                    style={{ color: "rgba(255,213,79,0.28)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sys-gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,213,79,0.28)")}
                    onClick={() => setActiveView("tasks")}
                  >
                    VIEW ALL QUESTS <ArrowUpRight size={11} />
                  </button>
                </div>
              )}

              {/* Activity log */}
              <div className="sys-panel" style={{ animation: "fade-in-up .4s .36s ease both" }}>
                <div className="sys-panel-head">
                  <div className="sys-panel-head-left">
                    <div className="sys-panel-badge" style={{ background: "rgba(79,195,247,0.5)" }} />
                    <span className="sys-panel-title">SYSTEM LOG</span>
                  </div>
                </div>
                {[
                  { color: "var(--sys-blue)", text: "Project status updated to Active", time: "2 min ago" },
                  { color: "var(--sys-green)", text: "Quest marked as complete", time: "18 min ago" },
                  { color: "var(--sys-gold)", text: "New team member joined gate", time: "1h ago" },
                  { color: "var(--sys-red)", text: "Deadline alert on S-Rank gate", time: "2h ago" },
                ].map((a, i) => (
                  <div key={i} className="sys-act-item">
                    <div className="sys-act-dot" style={{ background: a.color }} />
                    <div>
                      <div className="sys-act-txt">{a.text}</div>
                      <div className="sys-act-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ── BOTTOM BAR ──────────────────────────────────────── */}
          <div className="sys-bottom-bar" style={{ animation: "fade-in-up .4s .4s ease both" }}>
            <span>System v4.2.1 · All gates monitored</span>
            <span style={{ color: "rgba(79,230,160,0.5)" }}>⬡ Command center online</span>
            <span>Last sync: just now</span>
          </div>

        </div>
      </div>

      {isProjectModalOpen && (
        <CreateProjectModal
          onClose={() => setIsProjectModalOpen(false)}
        />
      )}
    </>
  );
}