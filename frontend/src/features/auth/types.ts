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
}