import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import RegisterPage from "../features/auth/RegisterPage";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProjectsPage from "../features/projects/ProjectPage";
import BoardPage from "../features/board/BoardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/projects",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <ProjectsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/board",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <BoardPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
]);
