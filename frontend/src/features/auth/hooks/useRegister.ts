import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const validatePassword = (password: string) => ({
  hasMinLength: password.length >= 8,
  hasUpperCase: /[A-Z]/.test(password),
  hasLowerCase: /[a-z]/.test(password),
  hasNumber: /[0-9]/.test(password),
});

export const useRegister = () => {
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const passwordValidations = useMemo(
    () => validatePassword(form.password),
    [form.password]
  );

  const allValid = Object.values(passwordValidations).every(Boolean);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!allValid) {
      setError("Password does not meet requirements");
      return;
    }

    try {
      await register(name, email, form.password);

      // ✅ NO fake delay
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Registration failed"
      );
    }
  };

  return {
    form,
    isLoading,
    error,
    passwordValidations,
    allValid,
    handleChange,
    handleSubmit,
  };
};