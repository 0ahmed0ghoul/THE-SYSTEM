// frontend/src/components/AuthDebug.tsx
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const AuthDebug = () => {
  const { user, token, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    console.log('=== AUTH DEBUG ===');
    console.log('Store user:', user);
    console.log('Store token:', token ? `${token.substring(0, 30)}...` : 'null');
    console.log('Store isAuthenticated:', isAuthenticated);
    console.log('localStorage token:', storedToken ? `${storedToken.substring(0, 30)}...` : 'null');
    console.log('localStorage user:', storedUser ? JSON.parse(storedUser) : 'null');
    console.log('CheckAuth result:', checkAuth());
    console.log('=================');
  }, [user, token, isAuthenticated, checkAuth]);

  return null;
};

// Add to your Dashboard component temporarily:
// 
// Then add <AuthDebug /> at the top of your return