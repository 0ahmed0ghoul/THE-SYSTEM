import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      await login(email, password);

      // ✅ NO timeout, NO fake delay
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return {
    form,
    isLoading,
    error,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
  };
};