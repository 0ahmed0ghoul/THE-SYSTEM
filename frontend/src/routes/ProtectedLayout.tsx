import type { ReactNode } from "react";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

export const ProtectedLayout = (_props: { children: ReactNode }) => {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
};