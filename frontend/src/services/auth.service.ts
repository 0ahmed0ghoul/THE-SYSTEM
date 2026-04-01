// frontend/src/services/auth.service.ts
import {type LoginPayload,type RegisterPayload,type AuthResponse,type User } from '../types/auth.types';
import { TokenService } from './token.service';
import { useAuthStore } from '../store/authStore';
import { handleApiError } from '../utils/error-handler';
import apiClient from './api.client';

export class AuthService {
  /**
   * User login
   */
  static async login(credentials: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      if (response.data.token) {
        // Store token using TokenService
        TokenService.setToken(response.data.token);
        
        if (response.data.refreshToken) {
          TokenService.setRefreshToken(response.data.refreshToken);
        }
        
        // Update auth store with user data
        useAuthStore.getState().setAuth(response.data.user, response.data.token);
        
        console.log('Login successful, token stored');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw handleApiError(error, 'Login failed');
    }
  }

  /**
   * User registration
   */
  static async register(userData: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      if (response.data.token) {
        TokenService.setToken(response.data.token);
        
        if (response.data.refreshToken) {
          TokenService.setRefreshToken(response.data.refreshToken);
        }
        
        useAuthStore.getState().setAuth(response.data.user, response.data.token);
        
        console.log('Registration successful, token stored');
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw handleApiError(error, 'Registration failed');
    }
  }

  /**
   * User logout
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      TokenService.clearTokens();
      console.log('User logged out');
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>('/auth/me');
      return response.data.user;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch user profile');
    }
  }

  /**
   * Change password
   */
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw handleApiError(error, 'Password change failed');
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch (error) {
      throw handleApiError(error, 'Password reset request failed');
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      throw handleApiError(error, 'Password reset failed');
    }
  }

  /**
   * Verify email
   */
  static async verifyEmail(token: string): Promise<void> {
    try {
      await apiClient.post('/auth/verify-email', { token });
    } catch (error) {
      throw handleApiError(error, 'Email verification failed');
    }
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/resend-verification', { email });
    } catch (error) {
      throw handleApiError(error, 'Failed to resend verification email');
    }
  }
}