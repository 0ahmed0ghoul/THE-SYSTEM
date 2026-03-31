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