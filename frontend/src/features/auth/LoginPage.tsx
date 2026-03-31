import { useState } from "react";
import { loginRequest } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, XCircle } from "lucide-react";

export default function LoginPage() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginRequest(form);
      setUser(data.user);
      setAuthorized(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Access denied. Invalid credentials.");
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
          --sys-gold: #ffd54f;
          --sys-dark: #020811;
          --sys-panel: rgba(4, 18, 38, 0.92);
          --sys-border: rgba(79, 195, 247, 0.25);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
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

        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(2, 8, 17, 0.9) 0%,
            rgba(1, 15, 35, 0.78) 50%,
            rgba(2, 8, 17, 0.93) 100%
          );
          z-index: 0;
        }

        .login-root::after {
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

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 {
          width: 700px; height: 700px;
          top: -250px; left: -200px;
          background: radial-gradient(circle, rgba(2, 100, 180, 0.16) 0%, transparent 70%);
          animation: orb-drift 14s ease-in-out infinite alternate;
        }
        .orb-2 {
          width: 500px; height: 500px;
          bottom: -180px; right: -120px;
          background: radial-gradient(circle, rgba(79, 195, 247, 0.1) 0%, transparent 70%);
          animation: orb-drift 17s ease-in-out infinite alternate-reverse;
        }
        .orb-3 {
          width: 350px; height: 350px;
          top: 50%; left: 20%;
          background: radial-gradient(circle, rgba(100, 60, 200, 0.09) 0%, transparent 70%);
          animation: orb-drift 11s ease-in-out infinite alternate;
        }
        @keyframes orb-drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(25px, 18px) scale(1.06); }
        }

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
          90%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-100vh) scale(0.3); }
        }

        /* ====== PANEL ====== */
        .panel-wrap {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          padding: 16px;
          animation: panel-appear 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes panel-appear {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .panel-brackets { position: relative; padding: 2px; }

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
        .panel-brackets::before { top: 0; left: 0; border-width: 2px 0 0 2px; }
        .panel-brackets::after  { top: 0; right: 0; border-width: 2px 2px 0 0; }
        .panel-brackets .corner-br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }
        .panel-brackets .corner-bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }

        @keyframes bracket-glow {
          from { box-shadow: 0 0 4px rgba(79,195,247,0.4); }
          to   { box-shadow: 0 0 14px rgba(79,195,247,0.9), 0 0 24px rgba(79,195,247,0.35); }
        }

        .rank-badge {
          position: absolute;
          top: -14px; right: 20px;
          background: linear-gradient(135deg, #0a2240, #051a35);
          border: 1px solid rgba(79, 195, 247, 0.4);
          padding: 3px 10px;
          font-family: 'Cinzel', serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 3px;
          color: var(--sys-gold);
          text-shadow: 0 0 10px rgba(255, 213, 79, 0.5);
          z-index: 20;
        }

        .panel-inner {
          background: var(--sys-panel);
          border: 1px solid var(--sys-border);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          padding: 36px 34px 32px;
          position: relative;
          overflow: hidden;
        }
        .panel-inner::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,0.04), transparent);
          animation: shimmer 7s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%   { left: -100%; }
          50%  { left: 160%; }
          100% { left: 160%; }
        }
        .panel-inner::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(79,195,247,0.05) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
          z-index: 0;
        }

        /* ====== STATUS BAR ====== */
        .status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(79, 195, 247, 0.1);
          padding-bottom: 10px;
          margin-bottom: 26px;
          position: relative; z-index: 1;
        }
        .st { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(79,195,247,0.38); }
        .st-on { color: rgba(79,230,180,0.7); display: flex; align-items: center; gap: 5px; }
        .st-dot {
          width: 5px; height: 5px;
          background: rgba(79,230,180,0.85);
          border-radius: 50%;
          animation: dot-pulse 2s ease-in-out infinite;
        }
        @keyframes dot-pulse {
          0%,100% { opacity: 1; box-shadow: 0 0 4px rgba(79,230,180,0.8); }
          50%      { opacity: 0.4; box-shadow: none; }
        }

        /* ====== HEADER ====== */
        .sys-header {
          text-align: center;
          margin-bottom: 24px;
          position: relative; z-index: 1;
        }
        .sys-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(79,195,247,0.06);
          border: 1px solid rgba(79,195,247,0.22);
          padding: 3px 12px;
          margin-bottom: 14px;
          position: relative;
          overflow: hidden;
        }
        .sys-badge::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,0.12), transparent);
          animation: badge-sweep 3.5s ease-in-out infinite;
        }
        @keyframes badge-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .badge-dot { width: 5px; height: 5px; background: var(--sys-blue); border-radius: 50%; animation: dot-pulse 2s ease-in-out infinite; }
        .badge-txt { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--sys-blue); font-weight: 600; }

        .title-wrap { position: relative; display: inline-block; margin-bottom: 4px; }
        .title-glow {
          position: absolute; inset: 0;
          font-family: 'Cinzel', serif;
          font-size: 34px; font-weight: 900;
          letter-spacing: 4px;
          color: var(--sys-blue);
          filter: blur(14px);
          opacity: 0.3;
          animation: title-pulse 4s ease-in-out infinite;
          z-index: -1;
          white-space: nowrap;
        }
        .title {
          font-family: 'Cinzel', serif;
          font-size: 34px; font-weight: 900;
          letter-spacing: 4px;
          background: linear-gradient(135deg, #e0f7fa 0%, var(--sys-blue) 50%, #81d4fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }
        @keyframes title-pulse {
          0%,100% { opacity: 0.3; }
          50%      { opacity: 0.55; }
        }
        .sys-subtitle { font-size: 11px; letter-spacing: 6px; text-transform: uppercase; color: rgba(79,195,247,0.42); font-weight: 500; }

        /* Welcome text */
        .welcome-box {
          border: 1px solid rgba(79,195,247,0.12);
          background: rgba(79,195,247,0.03);
          padding: 10px 14px;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative; z-index: 1;
        }
        .welcome-icon {
          width: 32px; height: 32px;
          border: 1px solid rgba(79,195,247,0.3);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-family: 'Cinzel', serif;
          font-size: 14px; font-weight: 700;
          color: var(--sys-blue);
        }
        .welcome-txt { font-size: 12px; color: rgba(200,230,255,0.45); letter-spacing: 0.5px; line-height: 1.6; }
        .welcome-txt strong { color: rgba(79,195,247,0.8); font-weight: 600; display: block; letter-spacing: 1px; font-size: 11px; text-transform: uppercase; }

        /* ====== FORM ====== */
        .sys-form { display: flex; flex-direction: column; gap: 16px; position: relative; z-index: 1; }
        .sys-field-label {
          display: block;
          font-size: 10px; font-weight: 600;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: rgba(79,195,247,0.65);
          margin-bottom: 6px;
        }
        .sys-input-wrap {
          position: relative;
          border-left: 2px solid var(--sys-blue);
        }
        .sys-input {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(79,195,247,0.2);
          border-left: none;
          color: #e0f7fa;
          padding: 12px 14px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px; font-weight: 500;
          letter-spacing: 0.5px;
          outline: none;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
        }
        .sys-input::placeholder { color: rgba(79,195,247,0.2); font-weight: 400; }
        .sys-input:focus {
          border-color: rgba(79,195,247,0.6);
          background: rgba(2, 22, 50, 0.85);
          box-shadow: 0 0 18px rgba(79,195,247,0.06), inset 0 0 8px rgba(79,195,247,0.03);
        }
        .sys-input-icon {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          color: rgba(79,195,247,0.4); cursor: pointer;
          transition: color 0.2s;
          background: none; border: none; padding: 2px;
          display: flex; align-items: center;
        }
        .sys-input-icon:hover { color: var(--sys-blue); }

        /* Forgot password */
        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -6px;
        }
        .forgot-link {
          font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(79,195,247,0.4);
          background: none; border: none; cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          transition: color 0.2s;
          padding: 0;
        }
        .forgot-link:hover { color: var(--sys-blue); }

        /* ====== SUBMIT BUTTON ====== */
        .sys-btn {
          width: 100%;
          position: relative;
          margin-top: 4px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          overflow: hidden;
        }
        .sys-btn-inner {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, rgba(2,88,168,0.9), rgba(1,50,120,0.9));
          border: 1px solid rgba(79,195,247,0.5);
          font-family: 'Cinzel', serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 4px; text-transform: uppercase;
          color: #e0f7fa;
          position: relative; z-index: 1;
          transition: all 0.3s;
        }
        .sys-btn:hover .sys-btn-inner {
          border-color: var(--sys-blue);
          box-shadow: 0 0 22px rgba(79,195,247,0.22), inset 0 0 16px rgba(79,195,247,0.07);
          color: #fff;
        }
        .sys-btn:disabled { cursor: not-allowed; opacity: 0.6; }
        .btn-sweep {
          position: absolute; top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,0.14), transparent);
          animation: btn-sweep 3s ease-in-out infinite;
          z-index: 2;
        }
        @keyframes btn-sweep { 0% { left: -100%; } 100% { left: 220%; } }
        .sys-btn-arrow { transition: transform 0.3s; font-size: 18px; line-height: 1; }
        .sys-btn:hover .sys-btn-arrow { transform: translateX(4px); }

        /* ====== DIVIDER ====== */
        .sys-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 4px 0;
          position: relative; z-index: 1;
        }
        .div-line { flex: 1; height: 1px; background: rgba(79,195,247,0.12); }
        .div-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(79,195,247,0.25); white-space: nowrap; }

        /* ====== ERROR ====== */
        .sys-error {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px;
          border: 1px solid rgba(255,80,80,0.35);
          background: rgba(255,30,30,0.07);
          font-size: 13px; letter-spacing: 0.5px;
          color: #ff8a80;
          position: relative; z-index: 1;
        }

        /* ====== FOOTER ====== */
        .sys-footer {
          text-align: center;
          margin-top: 22px;
          font-size: 13px; letter-spacing: 1px;
          color: rgba(79,195,247,0.32);
          position: relative; z-index: 1;
        }
        .sys-link {
          color: var(--sys-blue); font-weight: 600;
          background: none; border: none; cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px; letter-spacing: 1px;
          transition: text-shadow 0.3s, color 0.2s;
          padding: 0;
        }
        .sys-link:hover { color: #e0f7fa; text-shadow: 0 0 10px rgba(79,195,247,0.7); }

        /* ====== ACCESS GRANTED OVERLAY ====== */
        .access-overlay {
          position: fixed; inset: 0;
          background: rgba(2,8,17,0.97);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          z-index: 9999;
          animation: fade-in 0.4s ease;
          gap: 16px;
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

        .access-lines {
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          margin-bottom: 8px;
        }
        .access-line {
          height: 1px; background: var(--sys-blue);
          animation: line-expand 0.6s ease-out both;
        }
        .access-line:nth-child(1) { width: 0; animation-delay: 0s; }
        .access-line:nth-child(2) { width: 0; animation-delay: 0.15s; }
        .access-line:nth-child(3) { width: 0; animation-delay: 0.3s; }
        @keyframes line-expand { from { width: 0; } to { width: 200px; } }

        .access-text {
          font-family: 'Cinzel', serif;
          font-size: 26px; font-weight: 900;
          letter-spacing: 8px;
          color: var(--sys-blue);
          animation: access-pulse 1.2s ease-in-out infinite;
          text-align: center;
        }
        @keyframes access-pulse {
          0%,100% { text-shadow: 0 0 20px rgba(79,195,247,0.6); }
          50%      { text-shadow: 0 0 60px rgba(79,195,247,1), 0 0 100px rgba(79,195,247,0.5); }
        }
        .access-sub {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px; letter-spacing: 5px;
          text-transform: uppercase;
          color: rgba(79,195,247,0.45);
        }
        .access-rank {
          font-family: 'Cinzel', serif;
          font-size: 11px; letter-spacing: 4px;
          color: var(--sys-gold);
          text-shadow: 0 0 10px rgba(255,213,79,0.5);
          margin-top: 8px;
        }
      `}</style>

      <div className="login-root">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        {/* Particles */}
        <div className="particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 20}%`,
                animationDuration: `${7 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 10}s`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
              }}
            />
          ))}
        </div>

        {/* Access Granted Overlay */}
        {authorized && (
          <div className="access-overlay">
            <div className="access-lines">
              <div className="access-line"></div>
              <div className="access-line"></div>
              <div className="access-line"></div>
            </div>
            <div className="access-text">ACCESS GRANTED</div>
            <div className="access-sub">Welcome back, Hunter</div>
            <div className="access-rank">✦ S-RANK HUNTER VERIFIED ✦</div>
          </div>
        )}

        <div className="panel-wrap">
          <div className="panel-brackets">
            <div className="corner-br"></div>
            <div className="corner-bl"></div>
            <div className="rank-badge">HUNTER AUTH</div>

            <div className="panel-inner">
              {/* Status Bar */}
              <div className="status-bar">
                <span className="st">Protocol: VERIFY</span>
                <span className="st st-on">
                  <div className="st-dot"></div> System Online
                </span>
                <span className="st">Sec: 0xA9F</span>
              </div>

              {/* Header */}
              <div className="sys-header">
                <div className="sys-badge">
                  <div className="badge-dot"></div>
                  <span className="badge-txt">Hunter Verification</span>
                </div>
                <br />
                <div className="title-wrap">
                  <div className="title-glow" aria-hidden>THE SYSTEM</div>
                  <span className="title">THE SYSTEM</span>
                </div>
                <div className="sys-subtitle">Project &amp; Task Command</div>
              </div>

              {/* Welcome notification box */}
              <div className="welcome-box">
                <div className="welcome-icon">⬡</div>
                <div className="welcome-txt">
                  <strong>Authentication Required</strong>
                  Provide your credentials to access the System. Only verified hunters may enter.
                </div>
              </div>

              {/* Form */}
              <form className="sys-form" onSubmit={handleSubmit}>
                {/* Email */}
                <div>
                  <label className="sys-field-label">Communication Channel</label>
                  <div className="sys-input-wrap">
                    <input
                      className="sys-input "
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
                      placeholder="Enter your access key"
                      value={form.password}
                      onChange={handleChange}
                      style={{ paddingRight: "40px" }}
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
                </div>

                {/* Forgot */}
                <div className="forgot-row">
                  <button
                    type="button"
                    className="forgot-link"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Recover Access Key →
                  </button>
                </div>

                {/* Submit */}
                <button type="submit" className="sys-btn" disabled={loading}>
                  <div className="sys-btn-inner">
                    <span className="btn-sweep"></span>
                    {loading ? "VERIFYING..." : "ENTER THE SYSTEM"}
                    {!loading && <span className="sys-btn-arrow">›</span>}
                  </div>
                </button>

                {/* Error */}
                {error && (
                  <div className="sys-error">
                    <XCircle size={15} />
                    {error}
                  </div>
                )}
              </form>

              {/* Divider */}
              <div className="sys-divider" style={{ marginTop: "20px" }}>
                <div className="div-line"></div>
                <span className="div-label">New to the system</span>
                <div className="div-line"></div>
              </div>

              {/* Footer */}
              <div className="sys-footer">
                No account yet?{" "}
                <button className="sys-link" onClick={() => navigate("/register")}>
                  Begin Awakening
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}