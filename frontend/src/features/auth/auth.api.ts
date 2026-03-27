import { api } from "../../../services/api";
import { LoginPayload } from "./types";
import type { RegisterPayload } from "./validators";

export const loginRequest = async (data: LoginPayload) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerRequest = async (data: RegisterPayload) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  };