import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }: any) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };
    
    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/50 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && !isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-20 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <div 
        className={`
          flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out
          ${!isSidebarCollapsed && !isMobile ? 'lg:pl-64' : 'lg:pl-0'}
        `}
      >
        {/* Navbar */}
        <Navbar onMenuClick={toggleSidebar} isSidebarOpen={!isSidebarCollapsed} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:px-10 lg:py-8">
          {/* Animated Content Container */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto">
            
            {/* Page Header with Breadcrumb */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                <span className="hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer transition-colors">Workspace</span>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <span className="text-indigo-600 dark:text-indigo-400">Overview</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Welcome back, Alex 👋
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
                Here's what's happening across The System today.
              </p>
            </div>

            {/* Dynamic Content */}
            <div className="min-h-[60vh]">
              {children}
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <span>© 2026 The System</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">Privacy</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">Terms</span>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-700 dark:text-slate-300">All systems operational</span>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 z-20 group"
        aria-label="Back to top"
      >
        <svg 
          className="w-5 h-5 transition-transform group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}