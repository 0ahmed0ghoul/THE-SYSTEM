import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { JSX } from "react";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = useAuthStore((s) => s.user);
  return user ? children : <Navigate to="/login" />;
};