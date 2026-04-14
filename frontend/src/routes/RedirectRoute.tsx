import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/authStore";

export const RootRedirect = () => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token) return <Navigate to="/login" replace />;

  if (user?.is_profile_complete === false) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};