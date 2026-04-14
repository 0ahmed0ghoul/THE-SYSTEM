import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { useEffect } from "react";

export default function LoginPage() {
  const {
    form,
    isLoading: loading,
    error,
    showPassword,
    authorized,
    handleChange,
    handleSubmit,
    setShowPassword,
    handleGoogleLogin,
    needsProfileCompletion
  } = useLogin();
  const navigate = useNavigate();
  useEffect(() => {
    if (needsProfileCompletion === undefined) return;
  
    if (needsProfileCompletion) {
      navigate("/complete-profile", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [needsProfileCompletion, navigate]);
  return (
    <>
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
                  <div className="title-glow" aria-hidden>
                    THE SYSTEM
                  </div>
                  <span className="title">THE SYSTEM</span>
                </div>
                <div className="sys-subtitle">Project &amp; Task Command</div>
              </div>

              <button
                type="button"
                className="sys-btn google-btn"
                onClick={handleGoogleLogin}
              >
                <div className="sys-btn-inner">
                  <span className="btn-sweep"></span>
                  Continue with Google
                  <span className="sys-btn-arrow">⟡</span>
                </div>
              </button>

              {/* Form */}
              <form className="sys-form" onSubmit={handleSubmit}>
                {/* Email */}
                <div>
                  <label className="sys-field-label">
                    Communication Channel
                  </label>
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
                <button
                  className="sys-link"
                  onClick={() => navigate("/register")}
                >
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
