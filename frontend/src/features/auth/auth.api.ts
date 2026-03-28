// frontend/src/pages/auth/auth.api.ts
import type { LoginPayload } from "./types";
import type { RegisterPayload } from "./validators";
import type  { User } from "./types";

const MOCK_USERS_KEY = "mock_users";

export const registerRequest = async (data: RegisterPayload) => {
  const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]") as User[];

  if (users.find((u) => u.email === data.email)) {
    throw { response: { data: { message: "User already exists" } } };
  }

  const newUser: User = {
    id: users.length + 1,
    name: data.email.split("@")[0],
    email: data.email,
    password: data.password,
  };

  users.push(newUser);
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));

  return { user: newUser, token: "mock-token" };
};

export const loginRequest = async (data: LoginPayload) => {
  const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]") as User[];
  const user = users.find((u) => u.email === data.email && u.password === data.password);

  if (!user) {
    throw { response: { data: { message: "Invalid credentials" } } };
  }

  return { user, token: "mock-token" };
};