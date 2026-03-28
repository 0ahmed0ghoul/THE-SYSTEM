import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import {
  Bell,
  Search,
  User,
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  MessageSquare,
  Calendar,
  CheckCircle2,
} from "lucide-react";

type NavbarProps = {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
};

export default function Navbar({ onMenuClick, isSidebarOpen }: NavbarProps) {
  const user = useAuthStore((s) => s.user);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Task completed",
      message: "API Integration task completed",
      time: "5 min ago",
      read: false,
      icon: CheckCircle2,
      color: "text-green-500 dark:text-green-400",
    },
    {
      id: 2,
      title: "New comment",
      message: "Ahmed commented on your task",
      time: "1 hour ago",
      read: false,
      icon: MessageSquare,
      color: "text-blue-500 dark:text-blue-400",
    },
    {
      id: 3,
      title: "Meeting reminder",
      message: "Team sync in 30 minutes",
      time: "2 hours ago",
      read: true,
      icon: Calendar,
      color: "text-purple-500 dark:text-purple-400",
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left Section - Page Title & Search */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {/* Sidebar toggle button for mobile */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isSidebarOpen ? (
                <svg
                  className="w-6 h-6 text-slate-700 dark:text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-slate-700 dark:text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-600 dark:from-indigo-500 dark:to-indigo-500 rounded-full"></div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              Dashboard
            </h2>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search tasks, projects, or team..."
                className="w-80 pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-3">
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-3 mr-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
              <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                12 tasks done
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <Calendar size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                3 due today
              </span>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-slate-500 dark:text-slate-400" />
            )}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-slate-900 dark:bg-slate-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Toggle theme
            </span>
          </button>

          {/* Help Button */}
          <button className="hidden sm:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group">
            <HelpCircle size={20} className="text-slate-500 dark:text-slate-400" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-slate-900 dark:bg-slate-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Help & support
            </span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell size={20} className="text-slate-500 dark:text-slate-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden z-20 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      Notifications
                    </h3>
                    <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                          !notification.read ? "bg-indigo-50/30 dark:bg-indigo-900/20" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 ${notification.color}`}
                          >
                            <notification.icon size={14} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {notification.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-100 dark:border-slate-700 text-center">
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                {user?.email ? user.email[0].toUpperCase() : "U"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Product Manager</p>
              </div>
              <ChevronDown
                size={16}
                className="text-slate-400 dark:text-slate-500 hidden md:block"
              />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden z-20 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user?.email?.split("@")[0] || "User"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <User size={16} />
                      Profile Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <Settings size={16} />
                      Account Settings
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>
    </nav>
  );
}