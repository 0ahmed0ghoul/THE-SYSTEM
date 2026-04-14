import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL}/auth/google`;

export const useLogin = () => {
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);

  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  // 🔥 CLEANUP TIMER
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 🔥 REDIRECT AFTER LOGIN (ONLY WHEN USER EXISTS)
  useEffect(() => {
    if (!user) return;

    if (!user.is_profile_complete) {
      navigate("/complete-profile", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required");
      return;
    }

    try {
      await login(form.email, form.password);

      // UI effect only
      setAuthorized(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Access denied. Invalid credentials."
      );
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return {
    form,
    isLoading,
    error,
    showPassword,
    authorized,
    handleChange,
    handleSubmit,
    setShowPassword,
    handleGoogleLogin,
  };
};