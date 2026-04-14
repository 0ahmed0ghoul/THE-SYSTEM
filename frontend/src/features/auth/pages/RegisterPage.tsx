import { Eye, EyeOff } from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RegisterPage() {
  const {
    form,
    isLoading: loading,
    error,
    showPassword,
    showConfirmPassword,
    awakened,
    passwordValidations,
    handleChange,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword,
    handleGoogleLogin,
    needsProfileCompletion,
  } = useRegister();
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
              {/* Header */}
              <div className="sys-header">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div className="sys-title-glow" aria-hidden>THE SYSTEM</div>
                  <h1 className="sys-title">THE SYSTEM</h1>
                </div>
                <p className="sys-subtitle">Project & Task Command</p>
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