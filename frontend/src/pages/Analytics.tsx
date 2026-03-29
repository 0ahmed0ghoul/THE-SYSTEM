import { BarChart3, TrendingUp, Users, CheckCircle2 } from "lucide-react";

export default function Analytics() {
  const stats = [
    { title: "Total Tasks", value: 156, icon: <CheckCircle2 size={18} /> },
    { title: "Active Projects", value: 8, icon: <BarChart3 size={18} /> },
    { title: "Team Members", value: 3, icon: <Users size={18} /> },
    { title: "Productivity", value: "82%", icon: <TrendingUp size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-slate-100 mb-6">
        Analytics
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800 shadow-sm">
            <div className="flex justify-between mb-2">
              {item.icon}
              <TrendingUp size={14} className="text-green-500" />
            </div>
            <p className="text-sm text-gray-400">{item.title}</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-slate-100">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Fake Chart Area */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border dark:border-slate-800 shadow-sm">
        <h2 className="font-semibold mb-4 text-gray-800 dark:text-slate-100">
          Performance Overview
        </h2>

        <div className="h-64 flex items-center justify-center text-gray-400">
          📊 Chart coming soon...
        </div>
      </div>
    </div>
  );
}