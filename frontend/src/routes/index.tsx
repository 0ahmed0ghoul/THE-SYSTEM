import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import DashboardLayout from "../components/layout/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import CalendarPage from "../pages/CalendarPage";
import Settings from "../pages/Settings";
import NotificationsPage from "../pages/NotificationsPage"; // Add this import

import ProjectsPage from "../features/projects/ProjectPage";
import BoardPage from "../features/board/BoardPage";
import { ProtectedLayout } from "./ProtectedLayout";
import TeamPage from "../pages/TeamPage";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import ProfilePage from "../pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // 🔐 Protected routes with DashboardLayout wrapper
  {
    element: <ProtectedLayout><DashboardLayout /></ProtectedLayout>,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/calendar",
        element: <CalendarPage />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/projects",
        element: <ProjectsPage />,
      },
      {
        path: "/projects/:id",  // This handles /projects/1, /projects/2, etc.
        element: <ProjectDetailPage />,
      },
      {
        path: "/profile",  // This handles /projects/1, /projects/2, etc.
        element: <ProfilePage />,
      },
      {
        path: "/board",
        element: <BoardPage projectId={1} />,
      },
      {
        path: "/notifications", // Add this route
        element: <NotificationsPage />,
      },
      {
        path: "/team", // Add this route
        element: <TeamPage />,
      },
    ],
  },
]);