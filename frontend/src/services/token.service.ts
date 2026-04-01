// frontend/src/services/token.service.ts
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../store/authStore';
import apiClient from './api.client';

interface DecodedToken {
  sub: string;
  email: string;
  exp: number;
  iat: number;
  role?: string;
}

export class TokenService {
  private static TOKEN_KEY = 'auth_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';

  static setToken(token: string): void {
    // Store in localStorage
    localStorage.setItem(this.TOKEN_KEY, token);
    
    // Update auth store
    useAuthStore.getState().setToken(token);
    
    console.log('Token stored successfully');
  }

  static getToken(): string | null {
    // First try to get from auth store
    const storeToken = useAuthStore.getState().token;
    if (storeToken) return storeToken;
    
    // If not in store, try localStorage
    const localToken = localStorage.getItem(this.TOKEN_KEY);
    if (localToken) {
      // Sync back to store
      useAuthStore.getState().setToken(localToken);
      return localToken;
    }
    
    return null;
  }

  static setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    useAuthStore.getState().logout();
    console.log('All tokens cleared');
  }

  static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const isValid = decoded.exp * 1000 > Date.now();
      if (!isValid) {
        console.log('Token expired');
        this.clearTokens();
      }
      return isValid;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  static async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        console.log('No refresh token available');
        return null;
      }

      const response = await apiClient.post('/auth/refresh', {
        refreshToken
      });

      if (response.data.token) {
        this.setToken(response.data.token);
        if (response.data.refreshToken) {
          this.setRefreshToken(response.data.refreshToken);
        }
        return response.data.token;
      }
      
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return null;
    }
  }

  static decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  static getUserFromToken(): { id: string; email: string; role?: string } | null {
    const decoded = this.decodeToken();
    if (!decoded) return null;
    
    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role
    };
  }
}