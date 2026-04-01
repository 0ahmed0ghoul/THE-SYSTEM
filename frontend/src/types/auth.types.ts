// frontend/src/types/auth.types.ts
export interface User {
  id: number;
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
  avatar?: string;
  isVerified?: boolean;
  role?: 'user' | 'admin' | 'super_admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
  refreshToken?: string;
}

export interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyEmailPayload {
  token: string;
}