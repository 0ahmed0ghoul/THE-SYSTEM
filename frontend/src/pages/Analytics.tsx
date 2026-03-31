// frontend/src/features/analytics/Analytics.tsx
import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, CheckCircle2, Activity, Calendar, Target, Award, Zap, TrendingDown, Clock, ArrowUpRight, Download, Filter } from "lucide-react";

// ── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target: number | string, duration = 900) {
  const [value, setValue] = useState(0);
  const numTarget = typeof target === "string" ? parseInt(target) : target;
  
  useEffect(() => {
    if (isNaN(numTarget)) {
      setValue(0);
      return;
    }
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * numTarget));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [numTarget, duration]);
  
  return target.toString().includes("%") ? `${value}%` : value;
}

// ── Progress Bar Component ───────────────────────────────────────────────────
function ProgressBar({ value, color, label }: { value: number; color: string; label?: string }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-[9px] tracking-[1px] text-[rgba(79,195,247,0.4)] mb-1">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className="h-1.5 bg-[rgba(79,195,247,0.08)] overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${value}%`, 
            background: `linear-gradient(90deg, rgba(79,195,247,0.5), ${color})`,
            boxShadow: `0 0 6px ${color}`
          }}
        />
      </div>
    </div>
  );
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Mock data - would come from store in production
  const stats = [
    { title: "Total Quests", value: 156, icon: <CheckCircle2 size={16} />, color: "#4fc3f7", trend: "+12%", trendUp: true },
    { title: "Active Gates", value: 8, icon: <BarChart3 size={16} />, color: "#ffd54f", trend: "+2", trendUp: true },
    { title: "Hunter Squad", value: 3, icon: <Users size={16} />, color: "#4fe6a0", trend: "0", trendUp: false },
    { title: "Clear Rate", value: "82%", icon: <TrendingUp size={16} />, color: "#ff6b6b", trend: "+5%", trendUp: true },
  ];

  const weeklyData = [65, 72, 78, 85, 82, 88, 92];
  const monthlyData = [68, 74, 79, 83, 87, 85, 90, 92, 89, 94, 96, 98];
  const yearlyData = [72, 76, 81, 85, 88, 91, 93, 95, 94, 96, 97, 98];
  
  const chartData = timeRange === "week" ? weeklyData : timeRange === "month" ? monthlyData : yearlyData;
  const maxValue = Math.max(...chartData);

  const categoryData = [
    { name: "S-Rank", value: 8, color: "#ff6b6b", percent: 5 },
    { name: "A-Rank", value: 24, color: "#ffb347", percent: 15 },
    { name: "B-Rank", value: 58, color: "#4fc3f7", percent: 37 },
    { name: "C-Rank", value: 66, color: "#4fe6a0", percent: 43 },
  ];

  const completedQuests = useCountUp(112);
  const activeQuests = useCountUp(44);
  const completionRate = useCountUp(72);

  return (
    <div className="sys-analytics-page min-h-screen bg-[#020c1a] font-['Rajdhani',sans-serif] text-[#e0f7fa] relative">
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
              ANALYTICS
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-6 px-0.5 animate-[fade-in-up_0.4s_0.06s_ease_both]">
          <div className="font-['Cinzel',serif] text-3xl font-black tracking-[3px] bg-gradient-to-r from-[#e0f7fa] to-[#4fc3f7] bg-clip-text text-transparent">
            OPERATIONS ANALYTICS
          </div>
          <div className="text-[11px] tracking-[3px] uppercase text-[rgba(79,195,247,0.32)] mt-1">
            Hunter Performance Metrics · Gate Clearance Analysis
          </div>
          <div className="h-px mt-3 bg-gradient-to-r from-[#4fc3f7] via-[rgba(79,195,247,0.1)] to-transparent" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 overflow-hidden hover:border-[rgba(79,195,247,0.45)] transition-all duration-300 group animate-[fade-in-up_0.5s_ease_both]"
              style={{ animationDelay: `${0.08 + idx * 0.04}s` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} />
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[rgba(79,195,247,0.3)]" />
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[rgba(79,195,247,0.3)]" />
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-[rgba(79,195,247,0.45)]">
                  {stat.title}
                </span>
                <span className="opacity-60 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
              </div>
              
              <div className="font-['Cinzel',serif] text-3xl font-black leading-none mb-1" style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}66` }}>
                {typeof stat.value === "string" && stat.value.includes("%") ? useCountUp(stat.value) : useCountUp(stat.value as number)}
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[9px] tracking-[1px] flex items-center gap-1 ${stat.trendUp ? "text-emerald-400" : "text-red-400"}`}>
                  {stat.trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {stat.trend}
                </span>
                <span className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.3)]">vs last period</span>
              </div>
              
              <div className="h-[2px] mt-3 bg-[rgba(79,195,247,0.06)] overflow-hidden">
                <div
                  className="h-full transition-all duration-1000 ease-out"
                  style={{
                    width: typeof stat.value === "string" && stat.value.includes("%") ? parseInt(stat.value) : `${Math.min((stat.value as number) / 200 * 100, 100)}%`,
                    background: stat.color,
                    boxShadow: `0 0 6px ${stat.color}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Performance Chart - Takes 2/3 of the grid */}
          <div className="lg:col-span-2 bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] overflow-hidden animate-[fade-in-up_0.4s_0.24s_ease_both]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(79,195,247,0.1)]">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
                <span className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa]">CLEARANCE RATE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex border border-[rgba(79,195,247,0.2)] rounded overflow-hidden">
                  {(["week", "month", "year"] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 text-[9px] tracking-[2px] uppercase transition-all duration-200 ${
                        timeRange === range 
                          ? "bg-[rgba(79,195,247,0.2)] text-[#4fc3f7]" 
                          : "text-[rgba(79,195,247,0.4)] hover:text-[rgba(79,195,247,0.7)]"
                      }`}
                    >
                      {range === "week" ? "7D" : range === "month" ? "30D" : "12M"}
                    </button>
                  ))}
                </div>
                <button className="p-1.5 hover:bg-[rgba(79,195,247,0.1)] transition-colors relative">
                  <Download size={14} className="text-[rgba(79,195,247,0.5)]" />
                </button>
              </div>
            </div>
            
            <div className="p-5">
              {/* Chart Area */}
              <div className="relative h-64 mb-4">
                <div className="absolute inset-0 flex items-end gap-2">
                  {chartData.map((value, idx) => {
                    const height = (value / maxValue) * 100;
                    const color = value >= 90 ? "#4fe6a0" : value >= 75 ? "#4fc3f7" : "#ffb347";
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <div 
                          className="w-full bg-gradient-to-t transition-all duration-700 hover:scale-105 cursor-pointer"
                          style={{ 
                            height: `${height}%`, 
                            minHeight: "4px",
                            background: `linear-gradient(180deg, ${color}, ${color}80)`,
                            boxShadow: `0 0 8px ${color}40`,
                          }}
                        />
                        <span className="text-[8px] tracking-[1px] text-[rgba(79,195,247,0.4)]">
                          {timeRange === "week" ? ["M","T","W","T","F","S","S"][idx] : 
                           timeRange === "month" ? `${idx + 1}` : 
                           ["J","F","M","A","M","J","J","A","S","O","N","D"][idx]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-[rgba(79,195,247,0.1)]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#4fe6a0]" />
                    <span className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.5)]">Elite (90%+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#4fc3f7]" />
                    <span className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.5)]">Standard (75-89%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#ffb347]" />
                    <span className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.5)]">Critical (&lt;75%)</span>
                  </div>
                </div>
                <div className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.3)]">
                  Clearance Rate Index
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-5">
            {/* Completion Overview */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 animate-[fade-in-up_0.4s_0.28s_ease_both]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-[#4fe6a0] shadow-[0_0_6px_#4fe6a0]" />
                <span className="font-['Cinzel',serif] text-xs font-bold tracking-[2px] text-[#e0f7fa]">MISSION STATUS</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[rgba(79,195,247,0.5)]">Completed Quests</span>
                  <span className="font-['Cinzel',serif] text-xl font-bold text-[#4fe6a0]">{completedQuests}</span>
                </div>
                <ProgressBar value={72} color="#4fe6a0" label="Completion Rate" />
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-[rgba(79,195,247,0.5)]">Active Quests</span>
                  <span className="font-['Cinzel',serif] text-xl font-bold text-[#ffd54f]">{activeQuests}</span>
                </div>
                <ProgressBar value={28} color="#ffd54f" label="Active Rate" />
              </div>
            </div>

            {/* Rank Distribution */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 animate-[fade-in-up_0.4s_0.32s_ease_both]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-[#ffd54f] shadow-[0_0_6px_#ffd54f]" />
                <span className="font-['Cinzel',serif] text-xs font-bold tracking-[2px] text-[#e0f7fa]">GATE RANK DISTRIBUTION</span>
              </div>
              
              <div className="space-y-3">
                {categoryData.map((cat, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full`} style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}` }} />
                        <span className="text-[10px] tracking-[1px] text-[rgba(79,195,247,0.6)]">{cat.name}</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[10px] font-bold" style={{ color: cat.color }}>{cat.value}</span>
                        <span className="text-[9px] text-[rgba(79,195,247,0.3)]">{cat.percent}%</span>
                      </div>
                    </div>
                    <div className="h-1 bg-[rgba(79,195,247,0.08)] overflow-hidden">
                      <div 
                        className="h-full transition-all duration-700 group-hover:scale-x-105"
                        style={{ width: `${cat.percent}%`, background: cat.color, boxShadow: `0 0 4px ${cat.color}` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Analytics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {/* Productivity Metrics */}
          <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 animate-[fade-in-up_0.4s_0.36s_ease_both]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
              <span className="font-['Cinzel',serif] text-xs font-bold tracking-[2px] text-[#e0f7fa]">PRODUCTIVITY METRICS</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border border-[rgba(79,195,247,0.1)] hover:border-[rgba(79,195,247,0.3)] transition-all duration-300">
                <div className="text-2xl font-['Cinzel',serif] font-bold text-[#4fc3f7]">94%</div>
                <div className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.4)] mt-1">Efficiency Rate</div>
              </div>
              <div className="text-center p-3 border border-[rgba(79,195,247,0.1)] hover:border-[rgba(79,195,247,0.3)] transition-all duration-300">
                <div className="text-2xl font-['Cinzel',serif] font-bold text-[#4fe6a0]">2.4x</div>
                <div className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.4)] mt-1">Clear Multiplier</div>
              </div>
              <div className="text-center p-3 border border-[rgba(79,195,247,0.1)] hover:border-[rgba(79,195,247,0.3)] transition-all duration-300">
                <div className="text-2xl font-['Cinzel',serif] font-bold text-[#ffd54f]">3.2</div>
                <div className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.4)] mt-1">Quests/Day</div>
              </div>
              <div className="text-center p-3 border border-[rgba(79,195,247,0.1)] hover:border-[rgba(79,195,247,0.3)] transition-all duration-300">
                <div className="text-2xl font-['Cinzel',serif] font-bold text-[#ff6b6b]">0.8%</div>
                <div className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.4)] mt-1">Failure Rate</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-5 animate-[fade-in-up_0.4s_0.4s_ease_both]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#ffd54f] shadow-[0_0_6px_#ffd54f]" />
                <span className="font-['Cinzel',serif] text-xs font-bold tracking-[2px] text-[#e0f7fa]">RECENT CLEARS</span>
              </div>
              <button className="text-[8px] tracking-[2px] uppercase text-[rgba(79,195,247,0.4)] hover:text-[#4fc3f7] transition-colors flex items-center gap-1">
                View All <ArrowUpRight size={10} />
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: "Abyssal Gate - Sector 7", rank: "S", time: "2h ago", points: "+250" },
                { name: "Crimson Tower Raid", rank: "A", time: "5h ago", points: "+120" },
                { name: "Shadow Realm Incursion", rank: "B", time: "1d ago", points: "+75" },
                { name: "Frost Giant Encounter", rank: "A", time: "2d ago", points: "+110" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-[rgba(79,195,247,0.05)] group hover:bg-[rgba(79,195,247,0.03)] transition-all duration-200 px-2 -mx-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 flex items-center justify-center font-['Cinzel',serif] text-[10px] font-bold rounded ${
                      activity.rank === "S" ? "text-red-400 border border-red-500/40 bg-red-500/5" :
                      activity.rank === "A" ? "text-amber-400 border border-amber-500/40 bg-amber-500/5" :
                      "text-sky-300 border border-sky-400/40 bg-sky-400/5"
                    }`}>
                      {activity.rank}
                    </div>
                    <div>
                      <p className="text-xs tracking-wide text-[#e0f7fa] group-hover:text-[#4fc3f7] transition-colors">{activity.name}</p>
                      <p className="text-[9px] tracking-[1px] text-[rgba(79,195,247,0.3)]">{activity.time}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#4fe6a0]">{activity.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between mt-5 px-4 py-2 bg-[rgba(4,12,28,0.85)] border border-[rgba(79,195,247,0.1)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.25)] animate-[fade-in-up_0.4s_0.44s_ease_both]">
          <span>Analytics Engine v1.0 · Real-time Data</span>
          <span className="text-[rgba(79,230,160,0.5)]">⬡ Metrics Active</span>
          <span>Last Update: Just Now</span>
        </div>
      </div>

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