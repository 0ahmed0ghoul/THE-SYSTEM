import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/authStore";
import { useEffect, useState } from "react";

export const ProtectedLayout = () => {
  const { user, token, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // ❌ Not logged in
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // ⚠️ Logged in but profile NOT completed
  const isOnWizard = location.pathname === "/complete-profile";

  if (!user.is_profile_complete && !isOnWizard) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <Outlet />;
};