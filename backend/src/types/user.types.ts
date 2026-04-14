// backend/src/types/user.types.ts

export interface UserModel {
    id: number;
    name: string | null;
    email: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface UserDTO {
    id: number;
    name: string | null;
    email: string;
    created_at: string;
    updated_at: string;
  }