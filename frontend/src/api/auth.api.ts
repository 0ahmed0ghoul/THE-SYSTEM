import type { LoginPayload } from "../features/auth/types";
import type { RegisterPayload } from "../features/auth/validators";
import type  { User } from "../features/auth/types";
import axios from "axios";
import type { RegisterResponse } from "../types/auth";


export const registerRequest = async (data: RegisterPayload): Promise<RegisterResponse> => {
  try {
    const res = await axios.post<RegisterResponse>("/auth/register", {
      name: data.name,
      email: data.email,
      password: data.password,
    });

    // Return the entire response data
    return res.data;
  } catch (err: any) {
    throw {
      response: {
        data: {
          message:
            err.response?.data?.message ||
            "Registration failed. Try again.",
        },
      },
    };
  }
};

// export const loginRequest = async (data: LoginPayload) => {
//   const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]") as User[];
//   const user = users.find((u) => u.email === data.email && u.password === data.password);

//   if (!user) {
//     throw { response: { data: { message: "Invalid credentials" } } };
//   }

//   return { user, token: "mock-token" };
// };