import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/authStore";

export const ProtectedLayout = () => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const initializing = useAuthStore((s) => s.initializing);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ Wait for hydration only
  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const isOnProfile = location.pathname === "/complete-profile";

  if (user.is_profile_complete === false && !isOnProfile) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <Outlet />;
};