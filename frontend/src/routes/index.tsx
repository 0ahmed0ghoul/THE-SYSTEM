import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardLayout from "../components/layout/DashboardLayout";

import Analytics from "../pages/Analytics";
import CalendarPage from "../pages/CalendarPage";
import Settings from "../pages/Settings";
import NotificationsPage from "../features/notifications/NotificationsPage"; // Add this import

import ProjectsPage from "../features/projects/ProjectPage";
import BoardPage from "../features/board/BoardPage";
import { ProtectedLayout } from "./ProtectedLayout";
import TeamPage from "../pages/TeamPage";
import ProjectDetailPage from "../features/projects/ProjectDetailPage";
import ProfilePage from "../pages/ProfilePage";
import ProjectBoard from "../features/projects/ProjectBoard";
import TaskDetailPage from "../features/tasks/TaskDetailPage";
import TasksPage from "../features/tasks/TasksPage";
import CreateProjectPage from "../pages/CreateProjectPage";
import GoogleSuccess from "../features/auth/pages/GoogleSuccess";
import CompleteProfileWizard from "../features/auth/pages/CompleteProfileWizard";
import { RootRedirect } from "./RedirectRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/auth/google-success",
    element: <GoogleSuccess />,
  },
  {
    path: "/complete-profile",
    element: <CompleteProfileWizard />,
  },

  {
    element: <ProtectedLayout />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: <RootRedirect />,
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
            path: "/projects/:id",
            element: <ProjectDetailPage />,
          },
          {
            path: "/projects/add",
            element: <CreateProjectPage />,
          },
          {
            path: "/tasks",
            element: <TasksPage />,
          },
          {
            path: "/tasks/:id",
            element: <TaskDetailPage />,
          },
          {
            path: "/projects/:id/board",
            element: <ProjectBoard />,
          },
          {
            path: "/profile", // This handles /projects/1, /projects/2, etc.
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
    ],
  },
]);
