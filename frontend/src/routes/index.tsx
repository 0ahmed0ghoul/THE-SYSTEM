import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import Dashboard from "../pages/Dashboard";
import RegisterPage from "../features/auth/RegisterPage";
import ProjectsPage from "../features/projects/ProjectPage";
import BoardPage from "../features/board/BoardPage";
import { ProtectedLayout } from "./ProtectedLayout";

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
    path: "/",
    element: <ProtectedLayout><Dashboard /></ProtectedLayout>,
  },
  {
    path: "/projects",
    element: <ProtectedLayout><ProjectsPage /></ProtectedLayout>,
  },
  {
    path: "/board",
    element: <ProtectedLayout><BoardPage projectId={1} /></ProtectedLayout>,
  },
]);
