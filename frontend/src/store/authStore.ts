// frontend/src/store/authStore.ts
import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { type User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  checkAuth: () => boolean;
  syncFromStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => {
        console.log('Setting auth:', { user: user.email, tokenExists: !!token });
        // Store in both Zustand and localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isLoading: false
        });
      },

      setUser: (user) => {
        if (user) {
          localStorage.setItem('auth_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('auth_user');
        }
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token) => {
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
        console.log('Setting token:', token ? `${token.substring(0, 20)}...` : 'null');
        set({ token });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      logout: () => {
        console.log('Logging out, clearing auth state');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false
        });
      },

      checkAuth: () => {
        const { token, isAuthenticated, user } = get();
        
        // Check if we have valid auth in state
        if (token && isAuthenticated && user) {
          // Optional: Check token expiration
          try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const isExpired = tokenData.exp * 1000 < Date.now();
            
            if (isExpired) {
              console.log('Token expired');
              get().logout();
              return false;
            }
            return true;
          } catch (error) {
            console.error('Token decode error:', error);
            return !!token;
          }
        }
        
        // Try to restore from localStorage
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        
        if (storedToken && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            console.log('Restoring auth from localStorage');
            set({ 
              token: storedToken, 
              user, 
              isAuthenticated: true 
            });
            return true;
          } catch (error) {
            console.error('Failed to restore auth:', error);
            get().logout();
          }
        }
        
        return false;
      },

      syncFromStorage: () => {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        
        if (storedToken && storedUser && !get().token) {
          try {
            const user = JSON.parse(storedUser);
            set({
              token: storedToken,
              user,
              isAuthenticated: true
            });
            console.log('Synced auth from localStorage');
            return true;
          } catch (error) {
            console.error('Failed to sync auth:', error);
          }
        }
        return false;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);