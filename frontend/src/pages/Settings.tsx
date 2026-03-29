import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Moon, Sun, LogOut } from "lucide-react";

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.email?.split("@")[0] || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = () => {
    console.log("Saved:", { name, email });
    // later: send to backend
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-slate-100">
          Settings
        </h1>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border dark:border-slate-800 shadow-sm space-y-6">

          {/* Profile */}
          <div>
            <h2 className="font-semibold mb-4 text-slate-800 dark:text-slate-100">
              Profile
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User size={18} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-2 rounded bg-slate-100 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-2 rounded bg-slate-100 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="flex justify-between items-center">
            <span className="text-slate-800 dark:text-slate-100 font-medium">
              Dark Mode
            </span>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              {isDarkMode ? "Light" : "Dark"}
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-black text-white py-2 rounded-lg"
            >
              Save Changes
            </button>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}