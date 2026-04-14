import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authService } from "../api/auth.service";


export default function GoogleSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const init = async () => {
      const token = params.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // 1. store token only (no fake user)
        localStorage.setItem("auth_token", token);

        // 2. fetch REAL user from backend
        const user = await authService.getCurrentUser();

        // 3. set correct auth state
        setAuth(user, token);

        navigate("/");
      } catch (err) {
        console.error("Google auth failed", err);
        navigate("/login");
      }
    };

    init();
  }, []);

  return <div>Authenticating Google account...</div>;
}