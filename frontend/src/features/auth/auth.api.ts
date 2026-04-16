import { api } from "../../services/api";
import type { LoginPayload, RegisterPayload, User } from "./types";

const AUTH_TOKEN_KEY = "auth_token";

type AuthResponse = {
  user: {
    id: number;
    email: string;
  };
  token: string;
};

function toUiUser(user: AuthResponse["user"]): User {
  return {
    id: user.id,
    email: user.email,
    name: user.email.split("@")[0],
  };
}

export const registerRequest = async (data: RegisterPayload) => {
  const res = await api.post<AuthResponse>("/auth/register", data);
  const { user, token } = res.data;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  return { user: toUiUser(user), token };
};

export const loginRequest = async (data: LoginPayload) => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  const { user, token } = res.data;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  return { user: toUiUser(user), token };
};

export const logoutRequest = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};