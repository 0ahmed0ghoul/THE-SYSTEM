import apiClient from "../../../services/api.client";
import type { AuthResponse, LoginPayload, UpdateProfileData, User } from "../types/auth.types";
import type { RegisterPayload } from "../validators";

const BASE = "/auth";

const STORAGE_KEYS = {
  token: "auth_token",
  user: "auth_user",
};

const isClient = typeof window !== "undefined";

export const authService = {

  setAuth(token: string, user: User) {
    if (!isClient) return;
    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  },

  clearAuth() {
    if (!isClient) return;
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
  },

  getStoredAuth(): { token: string | null; user: User | null } {
    if (!isClient) return { token: null, user: null };

    const token = localStorage.getItem(STORAGE_KEYS.token);
    const raw = localStorage.getItem(STORAGE_KEYS.user);

    let user: User | null = null;
    if (raw) {
      try {
        user = JSON.parse(raw) as User; // runtime shape assumed valid; validate further if needed
      } catch {
        localStorage.removeItem(STORAGE_KEYS.user); // evict corrupted value
      }
    }

    return { token, user };
  },


  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient.post(`${BASE}/login`, data);
    const { token, user } = res.data;
    this.setAuth(token, user);
    return { token, user };
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient.post(`${BASE}/register`, data);
    const { token, user } = res.data;
    this.setAuth(token, user);
    return { token, user };
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(`${BASE}/logout`);
    } finally {
      this.clearAuth();
    }
  },


  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get(`${BASE}/me`);
    const user: User = res.data.user;

    // Keep stored user in sync with the server's latest version
    const { token } = this.getStoredAuth();
    if (token) this.setAuth(token, user);

    return user;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const res = await apiClient.put(`${BASE}/profile`, data);
    const updatedUser: User = res.data.user;

    const { token } = this.getStoredAuth();
    if (!token) throw new Error("No auth token found — cannot persist updated profile.");
    this.setAuth(token, updatedUser);

    return updatedUser;
  },

  async updateAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("avatar", file);

    // No Content-Type header — axios sets it automatically with the correct multipart boundary
    const res = await apiClient.post(`${BASE}/avatar`, formData);
    const updatedUser: User = res.data.user;

    const { token } = this.getStoredAuth();
    if (!token) throw new Error("No auth token found — cannot persist updated avatar.");
    this.setAuth(token, updatedUser);

    return updatedUser;
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.put(`${BASE}/password`, { currentPassword, newPassword });
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post(`${BASE}/forgot-password`, { email });
  },

  // Renamed `token` -> `resetToken` to distinguish it from the session auth token
  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    await apiClient.post(`${BASE}/reset-password`, { token: resetToken, newPassword });
  },

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post(`${BASE}/verify-email`, { token });
  },

  async resendVerificationEmail(email: string): Promise<void> {
    await apiClient.post(`${BASE}/resend-verification`, { email });
  },
};