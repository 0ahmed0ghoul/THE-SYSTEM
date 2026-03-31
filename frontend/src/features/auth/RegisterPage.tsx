import { useState } from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

// --- MOCK HOOKS FOR STANDALONE PREVIEW ---
const useAuthStore = (_: any) => (callback: (user: any) => void) => callback;
const useNavigate = () => (path: string) => console.log("Navigate to:", path);
const registerRequest = async (form: any) => {
  await new Promise((r) => setTimeout(r, 1000));
  return { user: { name: form.name, email: form.email } };
};

export default function RegisterPage() {
  const setUser = useAuthStore((s: any) => s?.setUser);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [awakened, setAwakened] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password: string) => ({
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  });

  const passwordValidations = validatePassword(form.password);
  const allValid = Object.values(passwordValidations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const data = await registerRequest(form);
      setUser((user: any) => ({ ...user, ...data.user }));
      setAwakened(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Awakening failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

        :root {
          --sys-blue: #4fc3f7;
          --sys-blue-glow: #0288d1;
          --sys-gold: #ffd54f;
          --sys-gold-dim: #ff8f00;
          --sys-dark: #020811;
          --sys-panel: rgba(4, 20, 40, 0.85);
          --sys-border: rgba(79, 195, 247, 0.35);
          --sys-border-bright: rgba(79, 195, 247, 0.8);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .system-root {
          min-height: 100vh;
          background-color: var(--sys-dark);
          background-image: url('src/assets/throne-bg.jpeg');
          background-size: cover;
          background-position: center top;
          font-family: 'Rajdhani', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        /* Deep overlay so the form is readable */
        .system-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(2, 8, 17, 0.88) 0%,
            rgba(1, 15, 35, 0.75) 50%,
            rgba(2, 8, 17, 0.92) 100%
          );
          z-index: 0;
        }

        /* Animated scan lines */
        .system-root::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(79, 195, 247, 0.015) 2px,
            rgba(79, 195, 247, 0.015) 4px
          );
          z-index: 0;
          pointer-events: none;
        }

        /* Ambient orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 {
          width: 600px; height: 600px;
          top: -200px; left: -200px;
          background: radial-gradient(circle, rgba(2, 100, 180, 0.18) 0%, transparent 70%);
          animation: orb-drift 12s ease-in-out infinite alternate;
        }
        .orb-2 {
          width: 500px; height: 500px;
          bottom: -150px; right: -100px;
          background: radial-gradient(circle, rgba(79, 195, 247, 0.12) 0%, transparent 70%);
          animation: orb-drift 15s ease-in-out infinite alternate-reverse;
        }
        .orb-3 {
          width: 300px; height: 300px;
          top: 40%; left: 15%;
          background: radial-gradient(circle, rgba(100, 60, 200, 0.1) 0%, transparent 70%);
          animation: orb-drift 9s ease-in-out infinite alternate;
        }
        @keyframes orb-drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.08); }
        }

        /* Floating particles */
        .particles {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          width: 2px; height: 2px;
          background: var(--sys-blue);
          border-radius: 50%;
          opacity: 0;
          animation: particle-rise linear infinite;
        }
        @keyframes particle-rise {
          0%   { opacity: 0; transform: translateY(0) scale(1); }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(-100vh) scale(0.3); }
        }

        /* ====== MAIN PANEL ====== */
        .panel-wrap {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 480px;
          padding: 16px;
          animation: panel-appear 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes panel-appear {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Corner brackets */
        .panel-brackets {
          position: relative;
          padding: 2px;
        }
        .panel-brackets::before,
        .panel-brackets::after,
        .panel-brackets .corner-br,
        .panel-brackets .corner-bl {
          content: '';
          position: absolute;
          width: 20px; height: 20px;
          border-color: var(--sys-blue);
          border-style: solid;
          z-index: 2;
          animation: bracket-glow 3s ease-in-out infinite alternate;
        }
        .panel-brackets::before {
          top: 0; left: 0;
          border-width: 2px 0 0 2px;
        }
        .panel-brackets::after {
          top: 0; right: 0;
          border-width: 2px 2px 0 0;
        }
        .panel-brackets .corner-br {
          bottom: 0; right: 0;
          border-width: 0 2px 2px 0;
        }
        .panel-brackets .corner-bl {
          bottom: 0; left: 0;
          border-width: 0 0 2px 2px;
        }
        @keyframes bracket-glow {
          from { box-shadow: 0 0 4px rgba(79,195,247,0.4); }
          to   { box-shadow: 0 0 12px rgba(79,195,247,0.9), 0 0 20px rgba(79,195,247,0.4); }
        }

        .panel-inner {
          background: var(--sys-panel);
          border: 1px solid var(--sys-border);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 40px 36px;
          position: relative;
          overflow: hidden;
        }

        /* Panel inner shimmer */
        .panel-inner::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,0.04), transparent);
          animation: panel-shimmer 6s ease-in-out infinite;
        }
        @keyframes panel-shimmer {
          0%   { left: -100%; }
          50%  { left: 150%; }
          100% { left: 150%; }
        }

        /* Hex pattern background */
        .panel-inner::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(79,195,247,0.06) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        /* ====== HEADER ====== */
        .sys-header {
          text-align: center;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }

        .sys-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(79, 195, 247, 0.08);
          border: 1px solid rgba(79, 195, 247, 0.3);
          padding: 4px 12px;
          margin-bottom: 16px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          color: var(--sys-blue);
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
        }
        .sys-badge::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,0.15), transparent);
          animation: badge-sweep 3s ease-in-out infinite;
        }
        @keyframes badge-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .sys-badge-dot {
          width: 6px; height: 6px;
          background: var(--sys-blue);
          border-radius: 50%;
          animation: dot-pulse 2s ease-in-out infinite;
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px var(--sys-blue); }
          50%       { opacity: 0.4; box-shadow: none; }
        }

        .sys-title {
          font-family: 'Cinzel', serif;
          font-size: 36px;
          font-weight: 900;
          letter-spacing: 4px;
          line-height: 1;
          background: linear-gradient(135deg, #e0f7fa 0%, var(--sys-blue) 50%, #81d4fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
          position: relative;
          display: inline-block;
        }
        .sys-title-glow {
          position: absolute;
          inset: 0;
          font-family: 'Cinzel', serif;
          font-size: 36px;
          font-weight: 900;
          letter-spacing: 4px;
          color: var(--sys-blue);
          filter: blur(12px);
          opacity: 0.35;
          animation: title-pulse 4s ease-in-out infinite;
          z-index: -1;
        }
        @keyframes title-pulse {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.55; }
        }

        .sys-subtitle {
          font-size: 12px;
          letter-spacing: 6px;
          color: rgba(79, 195, 247, 0.5);
          text-transform: uppercase;
          margin-top: 6px;
          font-weight: 500;
        }

        .sys-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          opacity: 0.4;
        }
        .sys-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--sys-blue), transparent);
        }
        .sys-divider-diamond {
          width: 6px; height: 6px;
          background: var(--sys-blue);
          transform: rotate(45deg);
        }

        .sys-prompt {
          font-size: 13px;
          letter-spacing: 1px;
          color: rgba(200, 230, 255, 0.55);
          font-weight: 400;
        }

        /* ====== FORM ====== */
        .sys-form {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sys-field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(79, 195, 247, 0.7);
          margin-bottom: 6px;
        }

        .sys-input-wrap {
          position: relative;
        }
        .sys-input-wrap::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, transparent, var(--sys-blue), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .sys-input-wrap:focus-within::before {
          opacity: 1;
        }

        .sys-input {
          width: 100%;
          background: rgba(4, 20, 40, 0.7);
          border: 1px solid rgba(79, 195, 247, 0.2);
          border-left: none;
          color: #e0f7fa;
          padding: 12px 14px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.5px;
          outline: none;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
        }
        .sys-input::placeholder {
          color: rgba(79, 195, 247, 0.2);
          font-weight: 400;
        }
        .sys-input:focus {
          border-color: rgba(79, 195, 247, 0.6);
          background: rgba(4, 30, 60, 0.8);
          box-shadow: 0 0 16px rgba(79, 195, 247, 0.08), inset 0 0 8px rgba(79, 195, 247, 0.04);
        }

        .sys-input-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(79, 195, 247, 0.4);
          cursor: pointer;
          transition: color 0.2s;
          background: none;
          border: none;
          padding: 2px;
          display: flex;
          align-items: center;
        }
        .sys-input-icon:hover { color: var(--sys-blue); }

        /* ====== VALIDATION GRID ====== */
        .val-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-top: 10px;
        }
        .val-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(79, 195, 247, 0.35);
          transition: color 0.3s;
        }
        .val-item.valid {
          color: rgba(79, 230, 180, 0.85);
        }
        .val-dot {
          width: 8px; height: 8px;
          border: 1px solid rgba(79, 195, 247, 0.3);
          border-radius: 1px;
          transform: rotate(45deg);
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .val-item.valid .val-dot {
          background: rgba(79, 230, 180, 0.85);
          border-color: rgba(79, 230, 180, 0.85);
          box-shadow: 0 0 8px rgba(79, 230, 180, 0.5);
        }

        /* ====== SUBMIT BUTTON ====== */
        .sys-btn {
          width: 100%;
          position: relative;
          margin-top: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          overflow: hidden;
        }
        .sys-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, rgba(2, 88, 168, 0.9), rgba(1, 50, 120, 0.9));
          border: 1px solid rgba(79, 195, 247, 0.5);
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #e0f7fa;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
          transition: all 0.3s;
        }
        .sys-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(79, 195, 247, 0.2), transparent 50%, rgba(79, 195, 247, 0.1));
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 0;
        }
        .sys-btn:hover .sys-btn-inner {
          border-color: var(--sys-blue);
          box-shadow: 0 0 20px rgba(79, 195, 247, 0.25), inset 0 0 15px rgba(79, 195, 247, 0.08);
          color: #fff;
        }
        .sys-btn:hover::before { opacity: 1; }
        .sys-btn:disabled { cursor: not-allowed; opacity: 0.6; }

        .btn-sweep {
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,0.15), transparent);
          animation: btn-sweep 3s ease-in-out infinite;
          z-index: 2;
        }
        @keyframes btn-sweep {
          0%   { left: -100%; }
          100% { left: 200%; }
        }

        .sys-btn-arrow {
          transition: transform 0.3s;
          font-size: 18px;
          line-height: 1;
        }
        .sys-btn:hover .sys-btn-arrow { transform: translateX(4px); }

        /* ====== ERROR / NOTIFICATION ====== */
        .sys-notification {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border: 1px solid rgba(255, 80, 80, 0.35);
          background: rgba(255, 30, 30, 0.07);
          font-size: 13px;
          letter-spacing: 0.5px;
          color: #ff8a80;
          position: relative;
          z-index: 1;
        }
        .sys-notification::before {
          content: '!';
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 11px;
          width: 18px; height: 18px;
          border: 1px solid rgba(255, 80, 80, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #ff5252;
        }

        /* ====== FOOTER LINK ====== */
        .sys-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          letter-spacing: 1px;
          color: rgba(79, 195, 247, 0.35);
          position: relative;
          z-index: 1;
        }
        .sys-link {
          color: var(--sys-blue);
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          letter-spacing: 1px;
          text-decoration: none;
          transition: text-shadow 0.3s, color 0.2s;
          padding: 0;
        }
        .sys-link:hover {
          color: #e0f7fa;
          text-shadow: 0 0 10px rgba(79, 195, 247, 0.7);
        }

        /* ====== RANK BADGE (top right) ====== */
        .rank-badge {
          position: absolute;
          top: -14px;
          right: 20px;
          background: linear-gradient(135deg, #0a2240, #051a35);
          border: 1px solid rgba(79, 195, 247, 0.4);
          padding: 3px 10px;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          color: var(--sys-gold);
          text-shadow: 0 0 10px rgba(255, 213, 79, 0.5);
          z-index: 20;
        }

        /* ====== AWAKENING OVERLAY ====== */
        .awakening-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 8, 17, 0.96);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fade-in 0.4s ease;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .awakening-text {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 8px;
          color: var(--sys-blue);
          text-shadow: 0 0 30px rgba(79, 195, 247, 0.8);
          animation: awaken-pulse 1s ease-in-out infinite;
          text-align: center;
        }
        @keyframes awaken-pulse {
          0%, 100% { text-shadow: 0 0 20px rgba(79, 195, 247, 0.6); }
          50%       { text-shadow: 0 0 60px rgba(79, 195, 247, 1), 0 0 100px rgba(79, 195, 247, 0.5); }
        }
        .awakening-sub {
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          letter-spacing: 5px;
          color: rgba(79, 195, 247, 0.5);
          text-transform: uppercase;
          margin-top: 12px;
        }

        /* Status bar at top of form */
        .status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background: rgba(79, 195, 247, 0.04);
          border-bottom: 1px solid rgba(79, 195, 247, 0.12);
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
        }
        .status-item {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(79, 195, 247, 0.4);
        }
        .status-active {
          color: rgba(79, 230, 180, 0.7);
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .status-active::before {
          content: '';
          display: inline-block;
          width: 5px; height: 5px;
          background: rgba(79, 230, 180, 0.85);
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(79, 230, 180, 0.8);
          animation: dot-pulse 2s ease-in-out infinite;
        }

        /* Progress bar below header */
        .sys-progress {
          height: 2px;
          background: rgba(79, 195, 247, 0.1);
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        .sys-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, transparent, var(--sys-blue), var(--sys-blue));
          transition: width 0.5s ease;
          box-shadow: 0 0 8px var(--sys-blue);
        }
      `}</style>

      <div className="system-root">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        {/* Particles */}
        <div className="particles">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 20}%`,
                animationDuration: `${6 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 8}s`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                opacity: Math.random() * 0.6,
              }}
            />
          ))}
        </div>

        {/* Awakening overlay */}
        {awakened && (
          <div className="awakening-overlay">
            <div className="awakening-text">SYSTEM INITIALIZED</div>
            <div className="awakening-sub">Hunter Registration Complete</div>
          </div>
        )}

        <div className="panel-wrap">
          <div className="panel-brackets">
            <div className="corner-br"></div>
            <div className="corner-bl"></div>
            <div className="rank-badge">HUNTER CLASS</div>

            <div className="panel-inner">
              {/* Status Bar */}
              <div className="status-bar">
                <span className="status-item">Protocol: AWAKENING</span>
                <span className="status-active status-item">System Online</span>
                <span className="status-item">Auth: 0x4F2</span>
              </div>

              {/* Header */}
              <div className="sys-header">
                <div className="sys-badge">
                  <div className="sys-badge-dot"></div>
                  New Hunter Registration
                </div>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div className="sys-title-glow" aria-hidden>THE SYSTEM</div>
                  <h1 className="sys-title">THE SYSTEM</h1>
                </div>
                <p className="sys-subtitle">Project & Task Command</p>
              </div>

              {/* Progress based on form fill */}
              <div className="sys-progress">
                <div
                  className="sys-progress-fill"
                  style={{
                    width: `${
                      ([form.name, form.email, form.password, form.confirmPassword]
                        .filter(Boolean).length / 4) * 100
                    }%`,
                  }}
                />
              </div>

              {/* Form */}
              <form className="sys-form" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                  <label className="sys-field-label">Hunter Name</label>
                  <div className="sys-input-wrap">
                    <input
                      className="sys-input"
                      type="text"
                      name="name"
                      placeholder="Enter your designation"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="sys-field-label">Communication Channel</label>
                  <div className="sys-input-wrap">
                    <input
                      className="sys-input"
                      type="email"
                      name="email"
                      placeholder="hunter@guild.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="sys-field-label">Access Key</label>
                  <div className="sys-input-wrap">
                    <input
                      className="sys-input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Minimum S-Rank strength"
                      value={form.password}
                      onChange={handleChange}
                      style={{ paddingRight: '40px' }}
                      required
                    />
                    <button
                      type="button"
                      className="sys-input-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Validation */}
                  {form.password.length > 0 && (
                    <div className="val-grid">
                      {[
                        { key: "hasMinLength", label: "8+ Chars" },
                        { key: "hasUpperCase", label: "Uppercase" },
                        { key: "hasLowerCase", label: "Lowercase" },
                        { key: "hasNumber",    label: "Number"    },
                      ].map(({ key, label }) => (
                        <div
                          key={key}
                          className={`val-item${(passwordValidations as any)[key] ? " valid" : ""}`}
                        >
                          <div className="val-dot" />
                          {label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="sys-field-label">Confirm Key</label>
                  <div className="sys-input-wrap">
                    <input
                      className="sys-input"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Verify access key"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      style={{ paddingRight: '40px' }}
                      required
                    />
                    <button
                      type="button"
                      className="sys-input-icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="sys-btn"
                  disabled={loading}
                >
                  <div className="sys-btn-inner">
                    <span className="btn-sweep"></span>
                    {loading ? "AWAKENING..." : "BEGIN AWAKENING"}
                    {!loading && <span className="sys-btn-arrow">›</span>}
                  </div>
                </button>

                {/* Error */}
                {error && (
                  <div className="sys-notification">{error}</div>
                )}
              </form>

              {/* Footer */}
              <div className="sys-footer">
                Already registered?{" "}
                <button className="sys-link" onClick={() => navigate("/login")}>
                  Access System
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}