// data.ts

export const statsData = {
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    totalTasks: 156,
    completedTasks: 98,
    pendingTasks: 58,
    completionRate: 62.8,
    upcomingDeadlines: 5,
    teamMembers: 3,
  };
  
  export const projectsData = [
    { id: 1, name: "E-commerce Platform", progress: 75, status: "active", deadline: "2026-04-15" },
    { id: 2, name: "Mobile App Redesign", progress: 45, status: "active", deadline: "2026-04-20" },
    { id: 3, name: "API Integration", progress: 90, status: "active", deadline: "2026-04-10" },
    { id: 4, name: "Documentation", progress: 30, status: "pending", deadline: "2026-04-25" },
  ];
  
  export const tasksData = [
    { id: 1, title: "Review pull requests", project: "E-commerce Platform", priority: "high", dueDate: "2026-03-28" },
    { id: 2, title: "Design system updates", project: "Mobile App Redesign", priority: "medium", dueDate: "2026-03-29" },
    { id: 3, title: "Database optimization", project: "API Integration", priority: "high", dueDate: "2026-03-30" },
    { id: 4, title: "User testing session", project: "E-commerce Platform", priority: "low", dueDate: "2026-04-01" },
  ];