import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "../api/auth.service";
import type { User } from "../types/auth.types";

const computeProfileState = (user: User | null) =>
  !!user && !user.is_profile_complete;

const normalize = (user: User): User => ({
  ...user,
  is_profile_complete: !!user.is_profile_complete,
});

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initializing: boolean;
  needsProfileCompletion: boolean;

  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitializing: (value: boolean) => void;
  logout: () => void;
  checkAuth: () => boolean;
  syncFromStorage: () => boolean; // was typed as () => void but returned boolean

  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    additionalData?: Partial<User>
  ) => Promise<void>;
  fetchUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateAvatar: (avatarFile: File) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // =========================
      // STATE
      // =========================
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      initializing: true,
      needsProfileCompletion: false,

      // =========================
      // BASIC SETTERS
      // =========================
      setAuth: (user, token) => {
        const normalizedUser = normalize(user);

        // Delegate storage to authService — it owns "auth_token" / "auth_user"
        // so apiClient interceptors always see a consistent token.
        authService.setAuth(token, normalizedUser);

        set({
          user: normalizedUser,
          token,
          isAuthenticated: true,
          isLoading: false,
          needsProfileCompletion: computeProfileState(normalizedUser),
        });
      },

      setUser: (user) => {
        const normalizedUser = user ? normalize(user) : null;

        if (normalizedUser) {
          const { token } = authService.getStoredAuth();
          if (token) authService.setAuth(token, normalizedUser);
        } else {
          authService.clearAuth();
        }

        set({
          user: normalizedUser,
          isAuthenticated: !!normalizedUser,
          needsProfileCompletion: computeProfileState(normalizedUser),
        });
      },

      setToken: (token) => {
        if (token) {
          const { user } = authService.getStoredAuth();
          if (user) authService.setAuth(token, user);
        } else {
          authService.clearAuth();
        }

        set({ token });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setInitializing: (value) => set({ initializing: value }),

      // =========================
      // LOGOUT
      // =========================
      logout: () => {
        // Clear authService's keys ("auth_token" / "auth_user")
        authService.clearAuth();

        // Clearing state causes persist to overwrite "auth-storage" with nulls —
        // this was missing before, leaving a valid persisted session after logout.
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          initializing: false,
          needsProfileCompletion: false,
        });
      },

      // =========================
      // AUTH CHECK
      // =========================
      checkAuth: () => {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");
      
        // ❌ IMPORTANT FIX: mark initialization done immediately
        if (!storedToken || !storedUser) {
          set({
            initializing: false,
            token: null,
            user: null,
            isAuthenticated: false,
          });
          return false;
        }
      
        const parsed = JSON.parse(storedUser);
      
        set({
          token: storedToken,
          user: parsed,
          isAuthenticated: true,
          initializing: false,
          needsProfileCompletion: parsed.is_profile_complete === 0,
        });
      
        return true;
      },

      syncFromStorage: () => {
        const { token, user } = authService.getStoredAuth();

        if (token && user) {
          set({
            token,
            user,
            isAuthenticated: true,
            needsProfileCompletion: computeProfileState(user),
          });
          return true;
        }

        return false;
      },

      // =========================
      // LOGIN
      // =========================
      login: async (email, password) => {
        set({ isLoading: true });

        try {
          // authService.login already calls authService.setAuth internally
          const { user, token } = await authService.login({ email, password });

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            needsProfileCompletion: computeProfileState(user),
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      // =========================
      // REGISTER
      // =========================
      register: async (name, email, password, additionalData) => {
        set({ isLoading: true });

        try {
          const { user, token } = await authService.register({
            name,
            email,
            password,
            ...additionalData,
          });

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            // Derive from server response — don't hardcode true
            needsProfileCompletion: computeProfileState(user),
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      // =========================
      // FETCH USER
      // =========================
      fetchUser: async () => {
        set({ isLoading: true });

        try {
          // authService.getCurrentUser now syncs storage internally
          const user = await authService.getCurrentUser();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            needsProfileCompletion: computeProfileState(user),
          });
        } catch (err) {
          get().logout(); // logout already sets isLoading: false — no redundant set needed
          throw err;
        }
      },

      // =========================
      // UPDATE PROFILE
      // =========================
      updateProfile: async (data) => {
        set({ isLoading: true });

        try {
          // authService.updateProfile syncs storage internally
          const updatedUser = await authService.updateProfile(data);

          const currentUser = get().user;
          // Merge to preserve any local fields the server doesn't return
          const merged: User = currentUser
            ? { ...currentUser, ...updatedUser }
            : updatedUser;

          set({
            user: merged,
            isLoading: false,
            needsProfileCompletion: computeProfileState(merged),
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      // =========================
      // PASSWORD
      // =========================
      updatePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true });

        try {
          await authService.updatePassword(currentPassword, newPassword);
          set({ isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      // =========================
      // AVATAR
      // =========================
      updateAvatar: async (avatarFile) => {
        set({ isLoading: true });

        try {
          // authService.updateAvatar syncs storage internally
          const updatedUser = await authService.updateAvatar(avatarFile);

          const currentUser = get().user;
          const merged: User = currentUser
            ? { ...currentUser, ...updatedUser }
            : updatedUser;

          set({
            user: merged,
            isLoading: false,
            needsProfileCompletion: computeProfileState(merged),
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);