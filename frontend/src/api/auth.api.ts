import type { LoginPayload } from "../features/auth/types";
import type { RegisterPayload } from "../features/auth/validators";
import type  { User } from "../features/auth/types";
import axios from "axios";
import type { LoginResponse, RegisterResponse } from "../types/auth";
import { api } from "../services/api";

export const loginRequest = async (data: LoginPayload): Promise<LoginResponse> => {
  try {
    const res = await api.post<LoginResponse>("/auth/login", {
      email: data.email,
      password: data.password,
    });
    
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    
    return res.data;
  } catch (err: any) {
    throw {
      response: {
        data: {
          message: err.response?.data?.message || "Access denied. Invalid credentials.",
          errors: err.response?.data?.errors,
        },
        status: err.response?.status,
      },
    };
  }
};

export const registerRequest = async (data: RegisterPayload): Promise<RegisterResponse> => {
  try {
    const res = await api.post<RegisterResponse>("/auth/register", {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    
    return res.data;
  } catch (err: any) {
    throw {
      response: {
        data: {
          message: err.response?.data?.message || "Registration failed. Try again.",
          errors: err.response?.data?.errors,
        },
        status: err.response?.status,
      },
    };
  }
};