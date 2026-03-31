import { create } from "zustand";
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  position?: string;
  department?: string;
  bio?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  avatar?: string; // Added avatar property
  id?: number; // Added id property
}



interface AuthState {
  user: {
    id: number;
    email: string;
    token?: string;
  } | null;
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
