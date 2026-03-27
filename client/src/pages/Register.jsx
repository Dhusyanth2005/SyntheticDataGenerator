import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spotlight } from "../components/ui/spotlight-new";
import synthLogo from "../assets/SynthAI_Logo.png";

// ─── Google Icon ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// ─── Eye Icons ─────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ─── Check Icon ────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Feature Badge ─────────────────────────────────────────────────────────────
const FeatureBadge = ({ icon, text }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "999px",
      padding: "6px 14px",
      fontSize: "13px",
      color: "#d4d4d4",
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ fontSize: "15px" }}>{icon}</span>
    {text}
  </div>
);

// ─── RegisterForm ──────────────────────────────────────────────────────────────
const RegisterForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [agreed, setAgreed] = useState(false);
  const [focused, setFocused] = useState(null);

  const baseInput = (name) => ({
    width: "100%",
    padding: "6px 12px",
    fontSize: "14px",
    lineHeight: "1.5",
    border: `1px solid ${focused === name ? "var(--ring)" : "var(--border)"}`,
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    color: "var(--foreground)",
    backgroundColor: "var(--input-bg)",
    transition: "border-color 0.15s",
    caretColor: "var(--foreground)",
  });

  const labelStyle = {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--foreground)",
    lineHeight: "1.4",
    display: "block",
    marginBottom: "5px",
  };

  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: "14px" }}
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <label style={labelStyle} htmlFor="username">
          Username*
        </label>
        <input
          style={baseInput("username")}
          type="text"
          id="username"
          placeholder="Enter your username"
          onFocus={() => setFocused("username")}
          onBlur={() => setFocused(null)}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="userEmail">
          Email address*
        </label>
        <input
          style={baseInput("email")}
          type="email"
          id="userEmail"
          placeholder="Enter your email address"
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused(null)}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="password">
          Password*
        </label>
        <div style={{ position: "relative" }}>
          <input
            style={{ ...baseInput("password"), paddingRight: "38px" }}
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="••••••••••••••••"
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((v) => !v)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted-foreground)",
              padding: "0",
              lineHeight: 0,
              display: "flex",
            }}
          >
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="confirmPassword">
          Confirm Password*
        </label>
        <div style={{ position: "relative" }}>
          <input
            style={{ ...baseInput("confirm"), paddingRight: "38px" }}
            id="confirmPassword"
            type={isConfirmPasswordVisible ? "text" : "password"}
            placeholder="••••••••••••••••"
            onFocus={() => setFocused("confirm")}
            onBlur={() => setFocused(null)}
          />
          <button
            type="button"
            onClick={() => setIsConfirmPasswordVisible((v) => !v)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted-foreground)",
              padding: "0",
              lineHeight: 0,
              display: "flex",
            }}
          >
            {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          role="checkbox"
          aria-checked={agreed}
          tabIndex={0}
          onClick={() => setAgreed((v) => !v)}
          onKeyDown={(e) => e.key === " " && setAgreed((v) => !v)}
          style={{
            width: "18px",
            height: "18px",
            flexShrink: 0,
            borderRadius: "4px",
            cursor: "pointer",
            border: `1px solid ${agreed ? "var(--foreground)" : "var(--border)"}`,
            backgroundColor: agreed ? "var(--foreground)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
            color: agreed ? "var(--background)" : "transparent",
          }}
        >
          {agreed && <CheckIcon />}
        </div>
        <label
          onClick={() => setAgreed((v) => !v)}
          style={{
            fontSize: "14px",
            color: "var(--muted-foreground)",
            cursor: "pointer",
            lineHeight: "1.4",
            userSelect: "none",
          }}
        >
          I agree to{" "}
          <a
            href="#"
            onClick={(e) => e.stopPropagation()}
            style={{
              color: "var(--foreground)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            privacy policy &amp; terms
          </a>
        </label>
      </div>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "9px 16px",
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "none",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          lineHeight: "1.5",
          marginTop: "2px",
        }}
      >
        Sign Up to Synth AI
      </button>
    </form>
  );
};

// ─── Register Page ─────────────────────────────────────────────────────────────
const Register = () => {
  const [googleHovered, setGoogleHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "inherit",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* ── LEFT PANEL: Spotlight — 60% ── */}
      <div
        data-spotlight-container
        style={{
          flex: "0 0 60%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: "black",
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <Spotlight />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "48px",
            maxWidth: "560px",
            textAlign: "center",
          }}
        >
          {/* ── Logo + Name ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "40px",
            }}
          >
            <img
              src={synthLogo}
              alt="Synth AI logo"
              style={{ width: "40px", height: "40px", objectFit: "contain" }}
            />
            <span
              style={{ fontSize: "20px", fontWeight: 600, color: "#fafafa" }}
            >
              Synth AI
            </span>
          </div>

          {/* ── Headline ── */}
          <h1
            style={{
              fontSize: "clamp(32px, 4.5vw, 58px)",
              fontWeight: 700,
              lineHeight: 1.1,
              margin: "0 0 20px 0",
              background: "linear-gradient(to bottom, #f5f5f5, #737373)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Generate Synthetic
            <br />
            Data. Privately.
            <br />
            At Scale.
          </h1>

          {/* ── Subtext ── */}
          <p
            style={{
              fontSize: "15px",
              color: "#a3a3a3",
              lineHeight: 1.7,
              margin: "0 0 32px 0",
              maxWidth: "400px",
              marginInline: "auto",
            }}
          >
            Upload a small real dataset and let our AI learn its statistical
            patterns — then generate thousands of realistic, privacy-safe rows
            ready for ML training and testing.
          </p>

          {/* ── Feature Badges ── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <FeatureBadge icon="🔒" text="Privacy Safe" />
            <FeatureBadge icon="📊" text="Stat Validated" />
            <FeatureBadge icon="⚡" text="5,000+ Rows" />
            <FeatureBadge icon="☁️" text="Cloud Storage" />
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Form — 40% ── */}
      <div
        style={{
          flex: "0 0 40%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 32px",
          backgroundColor: "var(--card)",
          borderLeft: "1px solid var(--border)",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ marginBottom: "28px" }}>
            {/* ── Right panel heading with logo ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "6px",
              }}
            >
              <img
                src={synthLogo}
                alt="Synth AI logo"
                style={{ width: "32px", height: "32px", objectFit: "contain" }}
              />
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: 0,
                  lineHeight: "1.2",
                }}
              >
                Sign Up to Synth AI
              </h2>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              Generate privacy-safe synthetic datasets in seconds.
            </p>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <RegisterForm />

            <p
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              Already have an account?{" "}
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                style={{
                  color: "var(--foreground)",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Sign in instead
              </a>
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  backgroundColor: "var(--border)",
                }}
              />
              <span
                style={{ fontSize: "14px", color: "var(--muted-foreground)" }}
              >
                or
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  backgroundColor: "var(--border)",
                }}
              />
            </div>

            <button
              onMouseEnter={() => setGoogleHovered(true)}
              onMouseLeave={() => setGoogleHovered(false)}
              style={{
                width: "100%",
                padding: "9px 16px",
                backgroundColor: googleHovered
                  ? "var(--input-bg)"
                  : "transparent",
                border: "1px solid var(--border)",
                borderColor: googleHovered ? "var(--ring)" : "var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background-color 0.2s, border-color 0.2s",
              }}
            >
              <GoogleIcon />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
