// frontend/src/routes/ProtectedLayout.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";

export const ProtectedLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user, token, checkAuth, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      // Check authentication status
      const isValid = checkAuth();
      setIsChecking(false);
      
      if (!isValid) {
        console.log('Authentication failed, redirecting to login');
      }
    };
    
    verifyAuth();
  }, [checkAuth]);

  // Show loading state while checking authentication
  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020c1a]">
        <div className="text-center">
          <div className="text-[#4fc3f7] mb-4 font-[Rajdhani] tracking-wider">
            Verifying credentials...
          </div>
          <div className="w-8 h-8 border-2 border-[#4fc3f7] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;
  
  if (!isAuthenticated) {
    console.log('No authenticated user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Render children or outlet
  return <>{children || <Outlet />}</>;
};