import {
    MessageSquare,
    Calendar,
    CheckCircle2,
  } from "lucide-react";
  
  export interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: typeof MessageSquare;
    color: string;
  }
  
  export const notificationsData: Notification[] = [
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
  
  export const quickStats = {
    tasksDone: 12,
    tasksDueToday: 3,
  };
  
  export const navLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/analytics", label: "Analytics" },
    { path: "/calendar", label: "Calendar" },
    { path: "/settings", label: "Settings" },
    { path: "/projects", label: "Projects" },
  ];
  
  export const getPageTitle = (pathname: string): string => {
    const link = navLinks.find(link => link.path === pathname);
    return link?.label || "Dashboard";
  };