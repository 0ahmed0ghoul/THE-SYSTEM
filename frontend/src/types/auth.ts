// types/auth.ts
export interface User {
  id: number;
  email: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  token: string;
}

// Login types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

// Optional: Common response types
export interface AuthError {
  message: string;
  errors?: Array<{
    path: string[];
    message: string;
  }>;
}

// Optional: Auth state for store
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Optional: API response wrapper (if your API uses a standard response structure)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}