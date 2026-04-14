// frontend/src/features/auth/types.ts
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  password: string; // only for mock testing, remove when backend is ready
  created_at?: string;
  updated_at?: string;
  is_profile_complete?: number; // 👈 ADD THIS
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  location?: string;
  position?: string;
  department?: string;
  rank?: string;
  bio?: string;
  website?: string;
  github?: string;
  linkedin?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface ResendVerificationData {
  email: string;
}