// frontend/src/api/auth.api.ts
import { AuthService } from '../services/auth.service';
import {type LoginPayload,type RegisterPayload,type AuthResponse,type User } from '../types/auth.types';

/**
 * Authentication API Handlers
 * These are thin wrappers around the service layer
 */
export const authApi = {
  /**
   * Login user
   */
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    return await AuthService.login(data);
  },

  /**
   * Register new user
   */
  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    return await AuthService.register(data);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    return await AuthService.logout();
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    return await AuthService.getCurrentUser();
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    return await AuthService.changePassword(currentPassword, newPassword);
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<void> => {
    return await AuthService.requestPasswordReset(email);
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    return await AuthService.resetPassword(token, newPassword);
  },

  /**
   * Verify email
   */
  verifyEmail: async (token: string): Promise<void> => {
    return await AuthService.verifyEmail(token);
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string): Promise<void> => {
    return await AuthService.resendVerificationEmail(email);
  },
};

// Backward compatibility exports
export const loginRequest = authApi.login;
export const registerRequest = authApi.register;
export const logoutRequest = authApi.logout;