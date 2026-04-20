import { useState, useEffect, useCallback } from "react";

// ─── Theme engine — reads/writes the real CSS variables on <html> ──────────────
const DARK_VARS = `
  --background: #0a0a0c;
  --foreground: #f4f4f5;
  --card: #111113;
  --border: rgba(255,255,255,0.09);
  --muted-foreground: #71717a;
`;
const LIGHT_VARS = `
  --background: #ffffff;
  --foreground: #09090b;
  --card: #fafafa;
  --border: rgba(0,0,0,0.1);
  --muted-foreground: #71717a;
`;

function applyTheme(theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && prefersDark);
  root.style.cssText = isDark ? DARK_VARS : LIGHT_VARS;
  root.setAttribute("data-theme", isDark ? "dark" : "light");
  try {
    localStorage.setItem("synth-theme", theme);
  } catch (_) {}
}

function getStoredTheme() {
  try {
    return localStorage.getItem("synth-theme") || "dark";
  } catch (_) {
    return "dark";
  }
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }
  @keyframes themePop {
    0%   { transform: scale(1);    }
    40%  { transform: scale(1.06); }
    100% { transform: scale(1);    }
  }
  .settings-card { transition: border-color 0.15s; }
  .settings-card:hover { border-color: rgba(255,255,255,0.18) !important; }
  .settings-row { transition: background-color 0.12s; }
  .settings-row:hover { background-color: rgba(255,255,255,0.025) !important; }
  .save-btn:hover { opacity: 0.88; }
  .ghost-btn:hover { background: rgba(255,255,255,0.05) !important; }
  .tab-btn { transition: color 0.15s, border-color 0.15s; }
  .theme-card-active { animation: themePop 0.2s ease-out; }
  .danger-btn:hover { background-color: rgba(255,255,255,0.06) !important; border-color: var(--foreground) !important; color: var(--foreground) !important; }
`;

// ─── Icons ─────────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const PaletteIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);
const KeyIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);
const BellIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const CloudIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);
const SunIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const MonitorIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const EyeIcon = () => (
  <svg
    width="14"
    height="14"
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
    width="14"
    height="14"
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
const TrashIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const CpuIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);

// ─── Shared primitives ─────────────────────────────────────────────────────────
const Section = ({ title, sub, children, animDelay = 0 }) => (
  <div
    className="settings-card"
    style={{
      border: "1px solid var(--border)",
      borderRadius: "12px",
      overflow: "hidden",
      backgroundColor: "rgba(255,255,255,0.01)",
      animation: `fadeSlideIn 0.3s ease-out ${animDelay}ms both`,
    }}
  >
    <div
      style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)" }}
    >
      <p
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "var(--foreground)",
          margin: "0 0 2px 0",
        }}
      >
        {title}
      </p>
      {sub && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--muted-foreground)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {sub}
        </p>
      )}
    </div>
    <div style={{ padding: "6px 0" }}>{children}</div>
  </div>
);

const Row = ({ label, sub, children, noBorder }) => (
  <div
    className="settings-row"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "13px 22px",
      borderBottom: noBorder ? "none" : "1px solid var(--border)",
      gap: "16px",
    }}
  >
    <div style={{ minWidth: 0, flex: 1 }}>
      <p
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--foreground)",
          margin: "0 0 1px 0",
        }}
      >
        {label}
      </p>
      {sub && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--muted-foreground)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {sub}
        </p>
      )}
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <div
    role="switch"
    aria-checked={checked}
    tabIndex={0}
    onClick={() => onChange(!checked)}
    onKeyDown={(e) => e.key === " " && onChange(!checked)}
    style={{
      width: "40px",
      height: "22px",
      borderRadius: "99px",
      backgroundColor: checked ? "var(--foreground)" : "var(--border)",
      position: "relative",
      cursor: "pointer",
      transition: "background-color 0.2s",
      flexShrink: 0,
      outline: "none",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "3px",
        left: checked ? "21px" : "3px",
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        backgroundColor: checked
          ? "var(--background)"
          : "rgba(255,255,255,0.5)",
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }}
    />
  </div>
);

const TextInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
  focusKey,
  focused,
  setFocused,
  width = "220px",
}) => (
  <input
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    onFocus={() => setFocused(focusKey)}
    onBlur={() => setFocused(null)}
    style={{
      padding: "7px 12px",
      fontSize: "13px",
      width,
      border: `1px solid ${focused === focusKey ? "var(--foreground)" : "var(--border)"}`,
      borderRadius: "7px",
      outline: "none",
      color: "var(--foreground)",
      backgroundColor: "transparent",
      caretColor: "var(--foreground)",
      transition: "border-color 0.15s",
    }}
  />
);

const SaveButton = ({ onSave, saved }) => (
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <button
      className="save-btn"
      onClick={onSave}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        padding: "9px 22px",
        backgroundColor: "var(--foreground)",
        color: "var(--background)",
        border: "1px solid var(--foreground)",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "opacity 0.15s",
        minWidth: "130px",
        justifyContent: "center",
      }}
    >
      {saved ? (
        <>
          <CheckIcon /> Saved!
        </>
      ) : (
        "Save changes"
      )}
    </button>
  </div>
);

// ─── Theme Card ────────────────────────────────────────────────────────────────
const THEME_OPTIONS = [
  {
    value: "dark",
    label: "Dark",
    icon: <MoonIcon size={20} />,
    preview: {
      bg: "#0a0a0c",
      card: "#111113",
      fg: "#f4f4f5",
      border: "rgba(255,255,255,0.09)",
      muted: "#3f3f46",
    },
  },
  {
    value: "light",
    label: "Light",
    icon: <SunIcon size={20} />,
    preview: {
      bg: "#ffffff",
      card: "#fafafa",
      fg: "#09090b",
      border: "rgba(0,0,0,0.1)",
      muted: "#e4e4e7",
    },
  },
  {
    value: "system",
    label: "System",
    icon: <MonitorIcon size={20} />,
    preview: null,
  },
];

const ThemeCard = ({ option, active, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const p = option.preview;

  return (
    <button
      onClick={() => onSelect(option.value)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={active ? "theme-card-active" : ""}
      style={{
        flex: 1,
        padding: "0",
        cursor: "pointer",
        border: `1.5px solid ${active ? "var(--foreground)" : hovered ? "rgba(255,255,255,0.2)" : "var(--border)"}`,
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: active ? "rgba(255,255,255,0.03)" : "transparent",
        transition: "border-color 0.15s, background-color 0.15s",
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
      }}
    >
      {/* Mini UI preview */}
      <div
        style={{
          height: "88px",
          padding: "10px",
          backgroundColor: p ? p.bg : "transparent",
          backgroundImage: !p
            ? "linear-gradient(135deg, #0a0a0c 50%, #ffffff 50%)"
            : "none",
          position: "relative",
          overflow: "hidden",
          borderBottom: `1px solid ${active ? "var(--foreground)" : "var(--border)"}`,
          transition: "border-color 0.15s",
        }}
      >
        {p && (
          <>
            {/* Fake sidebar strip */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "28px",
                backgroundColor: p.card,
                borderRight: `1px solid ${p.border}`,
              }}
            >
              {[16, 32, 46, 60].map((top) => (
                <div
                  key={top}
                  style={{
                    position: "absolute",
                    top,
                    left: "6px",
                    width: "16px",
                    height: "6px",
                    borderRadius: "3px",
                    backgroundColor: p.muted,
                  }}
                />
              ))}
            </div>
            {/* Fake topbar */}
            <div
              style={{
                position: "absolute",
                left: 28,
                right: 0,
                top: 0,
                height: "22px",
                backgroundColor: p.card,
                borderBottom: `1px solid ${p.border}`,
              }}
            />
            {/* Fake content area */}
            <div
              style={{
                position: "absolute",
                left: 36,
                right: 8,
                top: 28,
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <div
                style={{
                  height: "8px",
                  borderRadius: "3px",
                  backgroundColor: p.fg,
                  width: "55%",
                  opacity: 0.9,
                }}
              />
              <div
                style={{
                  height: "5px",
                  borderRadius: "2px",
                  backgroundColor: p.muted,
                  width: "80%",
                }}
              />
              <div
                style={{
                  height: "5px",
                  borderRadius: "2px",
                  backgroundColor: p.muted,
                  width: "60%",
                }}
              />
              <div style={{ marginTop: "4px", display: "flex", gap: "5px" }}>
                <div
                  style={{
                    height: "14px",
                    borderRadius: "3px",
                    backgroundColor: p.fg,
                    width: "36px",
                  }}
                />
                <div
                  style={{
                    height: "14px",
                    borderRadius: "3px",
                    border: `1px solid ${p.border}`,
                    width: "36px",
                  }}
                />
              </div>
            </div>
          </>
        )}
        {!p && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "var(--muted-foreground)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Auto
            </span>
          </div>
        )}
      </div>

      {/* Label row */}
      <div
        style={{
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span
            style={{
              color: active ? "var(--foreground)" : "var(--muted-foreground)",
              transition: "color 0.15s",
              lineHeight: 0,
            }}
          >
            {option.icon}
          </span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: active ? 700 : 500,
              color: active ? "var(--foreground)" : "var(--muted-foreground)",
              transition: "all 0.15s",
            }}
          >
            {option.label}
          </span>
        </div>
        {active && (
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: "var(--foreground)",
              color: "var(--background)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CheckIcon />
          </div>
        )}
      </div>
    </button>
  );
};

// ─── Tab: Profile ──────────────────────────────────────────────────────────────
const ProfileTab = () => {
  const [name, setName] = useState("shadcn/studio");
  const [email, setEmail] = useState("hello@shadcnstudio.com");
  const [focused, setFocused] = useState(null);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Section
        title="Personal Information"
        sub="Update your display name and email address."
        animDelay={0}
      >
        <Row
          label="Avatar"
          sub="Your profile picture shown across the platform."
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              SS
            </div>
            <button
              className="ghost-btn"
              style={{
                padding: "6px 12px",
                borderRadius: "7px",
                border: "1px solid var(--border)",
                background: "transparent",
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--muted-foreground)",
                cursor: "pointer",
                transition: "background 0.12s",
              }}
            >
              Change
            </button>
          </div>
        </Row>
        <Row
          label="Display name"
          sub="This is how your name appears across the app."
        >
          <TextInput
            value={name}
            onChange={setName}
            placeholder="Your name"
            focusKey="name"
            focused={focused}
            setFocused={setFocused}
          />
        </Row>
        <Row
          label="Email address"
          sub="Used for login and notifications."
          noBorder
        >
          <TextInput
            value={email}
            onChange={setEmail}
            placeholder="your@email.com"
            type="email"
            focusKey="email"
            focused={focused}
            setFocused={setFocused}
          />
        </Row>
      </Section>

      <Section
        title="Account"
        sub="Read-only account identifiers."
        animDelay={40}
      >
        <Row label="User ID" sub="Your unique platform identifier.">
          <span
            style={{
              fontSize: "12px",
              color: "var(--muted-foreground)",
              fontFamily: "monospace",
              letterSpacing: "0.04em",
            }}
          >
            usr_8f3k2a9xq1
          </span>
        </Row>
        <Row label="Member since" noBorder>
          <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
            12 Jan 2025
          </span>
        </Row>
      </Section>

      <SaveButton onSave={save} saved={saved} />
    </div>
  );
};

// ─── Tab: Appearance ───────────────────────────────────────────────────────────
const AppearanceTab = ({ theme, setTheme }) => {
  const [density, setDensity] = useState("default");
  const [sideCollapse, setSideCollapse] = useState(false);
  const [sideLabels, setSideLabels] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* ── Theme section ── */}
      <Section
        title="Theme"
        sub="Choose how the interface looks. Changes apply instantly across the entire app."
        animDelay={0}
      >
        <div
          style={{
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Three-card selector */}
          <div style={{ display: "flex", gap: "10px" }}>
            {THEME_OPTIONS.map((opt) => (
              <ThemeCard
                key={opt.value}
                option={opt}
                active={theme === opt.value}
                onSelect={setTheme}
              />
            ))}
          </div>

          {/* Inline quick-toggle pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              border: "1px solid var(--border)",
              borderRadius: "9px",
              backgroundColor: "rgba(255,255,255,0.01)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--muted-foreground)", lineHeight: 0 }}>
                {theme === "light" ? (
                  <SunIcon size={14} />
                ) : (
                  <MoonIcon size={14} />
                )}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--foreground)",
                }}
              >
                Currently using{" "}
                <strong>
                  {theme === "system" ? "system default" : theme + " mode"}
                </strong>
              </span>
            </div>
            {/* Quick dark/light flip pill */}
            <div
              onClick={() =>
                setTheme(
                  theme === "dark" || theme === "system" ? "light" : "dark",
                )
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
                border: "1px solid var(--border)",
                borderRadius: "99px",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {["dark", "light"].map((t) => {
                const isActive = theme === t;
                return (
                  <div
                    key={t}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTheme(t);
                    }}
                    style={{
                      padding: "5px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      backgroundColor: isActive
                        ? "var(--foreground)"
                        : "transparent",
                      color: isActive
                        ? "var(--background)"
                        : "var(--muted-foreground)",
                      fontSize: "12px",
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {t === "dark" ? (
                      <MoonIcon size={11} />
                    ) : (
                      <SunIcon size={11} />
                    )}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Density ── */}
      <Section
        title="Display Density"
        sub="Adjust spacing and visual density of the interface."
        animDelay={40}
      >
        <div style={{ padding: "16px 22px", display: "flex", gap: "8px" }}>
          {["compact", "default", "comfortable"].map((d) => {
            const active = density === d;
            return (
              <button
                key={d}
                onClick={() => setDensity(d)}
                style={{
                  flex: 1,
                  padding: "9px 8px",
                  borderRadius: "8px",
                  border: `1.5px solid ${active ? "var(--foreground)" : "var(--border)"}`,
                  backgroundColor: active
                    ? "rgba(255,255,255,0.04)"
                    : "transparent",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: active ? 700 : 400,
                  color: active
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Sidebar ── */}
      <Section
        title="Sidebar"
        sub="Control the sidebar's default behaviour."
        animDelay={80}
      >
        <Row
          label="Collapsed by default"
          sub="Start with the sidebar in icon-only mode."
        >
          <Toggle checked={sideCollapse} onChange={setSideCollapse} />
        </Row>
        <Row
          label="Show section labels"
          sub="Display group headings in the expanded sidebar."
          noBorder
        >
          <Toggle checked={sideLabels} onChange={setSideLabels} />
        </Row>
      </Section>
    </div>
  );
};

// ─── Tab: Security ─────────────────────────────────────────────────────────────
const SecurityTab = () => {
  const [curr, setCurr] = useState("");
  const [newP, setNewP] = useState("");
  const [conf, setConf] = useState("");
  const [focused, setFocused] = useState(null);
  const [showC, setShowC] = useState(false);
  const [showN, setShowN] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [saved, setSaved] = useState(false);

  const pwdInput = (val, set, focusKey, show, toggleShow) => (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <input
        type={show ? "text" : "password"}
        value={val}
        placeholder="••••••••"
        onChange={(e) => set(e.target.value)}
        onFocus={() => setFocused(focusKey)}
        onBlur={() => setFocused(null)}
        style={{
          padding: "7px 12px",
          fontSize: "13px",
          width: "196px",
          border: `1px solid ${focused === focusKey ? "var(--foreground)" : "var(--border)"}`,
          borderRadius: "7px",
          outline: "none",
          color: "var(--foreground)",
          backgroundColor: "transparent",
          caretColor: "var(--foreground)",
          transition: "border-color 0.15s",
        }}
      />
      <button
        onClick={() => toggleShow((v) => !v)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--muted-foreground)",
          lineHeight: 0,
          padding: "4px",
        }}
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Section
        title="Change Password"
        sub="Use a strong password you don't use elsewhere."
        animDelay={0}
      >
        <Row label="Current password">
          {pwdInput(curr, setCurr, "curr", showC, setShowC)}
        </Row>
        <Row label="New password">
          {pwdInput(newP, setNewP, "new", showN, setShowN)}
        </Row>
        <Row label="Confirm new password" noBorder>
          <input
            type="password"
            value={conf}
            placeholder="••••••••"
            onChange={(e) => setConf(e.target.value)}
            onFocus={() => setFocused("conf")}
            onBlur={() => setFocused(null)}
            style={{
              padding: "7px 12px",
              fontSize: "13px",
              width: "220px",
              border: `1px solid ${focused === "conf" ? "var(--foreground)" : "var(--border)"}`,
              borderRadius: "7px",
              outline: "none",
              color: "var(--foreground)",
              backgroundColor: "transparent",
              caretColor: "var(--foreground)",
              transition: "border-color 0.15s",
            }}
          />
        </Row>
      </Section>

      <Section
        title="Two-Factor Authentication"
        sub="Require a one-time code on every sign-in."
        animDelay={40}
      >
        <Row
          label="Enable 2FA"
          sub="Adds a second verification step using an authenticator app."
          noBorder
        >
          <Toggle checked={twoFA} onChange={setTwoFA} />
        </Row>
      </Section>

      <Section
        title="Sessions"
        sub="Manage where you are currently logged in."
        animDelay={80}
      >
        <Row label="Active sessions" sub="Currently signed in on 1 device.">
          <button
            className="ghost-btn"
            style={{
              padding: "6px 12px",
              borderRadius: "7px",
              border: "1px solid var(--border)",
              background: "transparent",
              fontSize: "12px",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
          >
            View sessions
          </button>
        </Row>
        <Row
          label="Log out everywhere"
          sub="Sign out from all other active sessions."
          noBorder
        >
          <button
            className="ghost-btn"
            style={{
              padding: "6px 12px",
              borderRadius: "7px",
              border: "1px solid var(--border)",
              background: "transparent",
              fontSize: "12px",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
          >
            Log out all
          </button>
        </Row>
      </Section>

      <SaveButton onSave={save} saved={saved} />
    </div>
  );
};

// ─── Tab: Notifications ────────────────────────────────────────────────────────
const NotificationsTab = () => {
  const [n, setN] = useState({
    genDone: true,
    genFail: true,
    weekly: false,
    system: true,
    drive: false,
  });
  const toggle = (k) => setN((p) => ({ ...p, [k]: !p[k] }));

  const ITEMS = [
    {
      k: "genDone",
      label: "Generation complete",
      sub: "Notify when a synthetic dataset finishes.",
    },
    {
      k: "genFail",
      label: "Generation failed",
      sub: "Alert if an ML job errors out or times out.",
    },
    {
      k: "weekly",
      label: "Weekly summary",
      sub: "A digest of your weekly generation activity.",
    },
    {
      k: "system",
      label: "System alerts",
      sub: "Downtime or service degradation notices.",
    },
    {
      k: "drive",
      label: "Drive storage alerts",
      sub: "Notify when Google Drive usage exceeds 80%.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Section
        title="Email Notifications"
        sub="Choose which events trigger an email to you."
        animDelay={0}
      >
        {ITEMS.map((item, i) => (
          <Row
            key={item.k}
            label={item.label}
            sub={item.sub}
            noBorder={i === ITEMS.length - 1}
          >
            <Toggle checked={n[item.k]} onChange={() => toggle(item.k)} />
          </Row>
        ))}
      </Section>
    </div>
  );
};

// ─── Tab: Integrations ─────────────────────────────────────────────────────────
const INTEGRATIONS = [
  {
    id: "gdrive",
    label: "Google Drive",
    sub: "Cloud storage for generated datasets.",
    connected: true,
  },
  {
    id: "ml",
    label: "ML Microservice",
    sub: "FastAPI · Python · Scikit-learn.",
    connected: true,
  },
  {
    id: "db",
    label: "PostgreSQL",
    sub: "Primary database via Prisma ORM.",
    connected: true,
  },
  {
    id: "smtp",
    label: "SMTP Email",
    sub: "For notification delivery.",
    connected: false,
  },
];

const IntegrationsTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    <Section
      title="Connected Services"
      sub="Manage external service connections."
      animDelay={0}
    >
      {INTEGRATIONS.map((svc, i) => (
        <Row
          key={svc.id}
          label={svc.label}
          sub={svc.sub}
          noBorder={i === INTEGRATIONS.length - 1}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: svc.connected
                    ? "var(--foreground)"
                    : "var(--border)",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: svc.connected
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                  fontWeight: 500,
                }}
              >
                {svc.connected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <button
              className="ghost-btn"
              style={{
                padding: "5px 10px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                background: "transparent",
                fontSize: "12px",
                color: "var(--muted-foreground)",
                cursor: "pointer",
                transition: "background 0.12s",
              }}
            >
              {svc.connected ? "Manage" : "Connect"}
            </button>
          </div>
        </Row>
      ))}
    </Section>

    <Section
      title="API Keys"
      sub="Rotate your backend secrets and API tokens."
      animDelay={40}
    >
      <Row
        label="JWT Secret"
        sub="Signs auth tokens. Rotate regularly for security."
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <code
            style={{
              fontSize: "12px",
              color: "var(--muted-foreground)",
              letterSpacing: "0.04em",
            }}
          >
            sk_••••••••••••••••
          </code>
          <button
            className="ghost-btn"
            style={{
              padding: "5px 10px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "transparent",
              fontSize: "12px",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
          >
            Rotate
          </button>
        </div>
      </Row>
      <Row
        label="Google Drive API Key"
        sub="OAuth credentials for Drive file storage."
        noBorder
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <code
            style={{
              fontSize: "12px",
              color: "var(--muted-foreground)",
              letterSpacing: "0.04em",
            }}
          >
            AIza••••••••••••
          </code>
          <button
            className="ghost-btn"
            style={{
              padding: "5px 10px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "transparent",
              fontSize: "12px",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
          >
            Update
          </button>
        </div>
      </Row>
    </Section>
  </div>
);

// ─── Danger Zone ───────────────────────────────────────────────────────────────
const DangerZone = () => (
  <div
    style={{
      border: "1px solid var(--border)",
      borderRadius: "12px",
      overflow: "hidden",
      animation: "fadeSlideIn 0.3s ease-out 120ms both",
    }}
  >
    <div
      style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)" }}
    >
      <p
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "var(--foreground)",
          margin: "0 0 2px 0",
        }}
      >
        Danger Zone
      </p>
      <p
        style={{
          fontSize: "12px",
          color: "var(--muted-foreground)",
          margin: 0,
        }}
      >
        Irreversible actions — proceed with caution.
      </p>
    </div>
    <div style={{ padding: "6px 0" }}>
      <Row
        label="Clear all generated datasets"
        sub="Permanently deletes all synthetic datasets from Drive and the database."
      >
        <button
          className="danger-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "7px",
            border: "1px solid var(--border)",
            background: "transparent",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--muted-foreground)",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <TrashIcon /> Clear all
        </button>
      </Row>
      <Row
        label="Delete account"
        sub="Permanently removes your account and all associated data."
        noBorder
      >
        <button
          className="danger-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "7px",
            border: "1px solid var(--border)",
            background: "transparent",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--muted-foreground)",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <TrashIcon /> Delete account
        </button>
      </Row>
    </div>
  </div>
);

// ─── Tabs config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "profile", label: "Profile", icon: <UserIcon /> },
  { id: "appearance", label: "Appearance", icon: <PaletteIcon /> },
  { id: "security", label: "Security", icon: <KeyIcon /> },
  { id: "notifications", label: "Notifications", icon: <BellIcon /> },
  { id: "integrations", label: "Integrations", icon: <CloudIcon /> },
];

// ─── Settings Page ─────────────────────────────────────────────────────────────
export default function Settings() {
  const [activeTab, setActiveTab] = useState("appearance"); // open on Appearance by default
  const [theme, setThemeState] = useState(() => getStoredTheme());

  // Apply theme to DOM whenever it changes
  const setTheme = useCallback((t) => {
    setThemeState(t);
    applyTheme(t);
  }, []);

  // Apply on first render
  useEffect(() => {
    applyTheme(theme);
  }, []);

  // Also react to system pref changes when theme === "system"
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const TAB_CONTENT = {
    profile: <ProfileTab />,
    appearance: <AppearanceTab theme={theme} setTheme={setTheme} />,
    security: <SecurityTab />,
    notifications: <NotificationsTab />,
    integrations: <IntegrationsTab />,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <style>{STYLES}</style>

      {/* ── Page heading ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: "0 0 4px 0",
            }}
          >
            Settings
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Manage your account, appearance, and platform preferences.
          </p>
        </div>
        {/* Quick theme toggle in header */}
        <div
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            cursor: "pointer",
            backgroundColor: "rgba(255,255,255,0.01)",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--muted-foreground)",
            transition: "border-color 0.15s, background 0.15s",
            flexShrink: 0,
          }}
          className="ghost-btn"
        >
          {theme === "dark" ? <SunIcon size={14} /> : <MoonIcon size={14} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className="tab-btn"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "9px 16px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${active ? "var(--foreground)" : "transparent"}`,
                marginBottom: "-1px",
                fontSize: "13px",
                fontWeight: active ? 600 : 400,
                color: active ? "var(--foreground)" : "var(--muted-foreground)",
                cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      <div key={activeTab} style={{ animation: "fadeSlideIn 0.2s ease-out" }}>
        {TAB_CONTENT[activeTab]}
        {activeTab === "profile" && (
          <div style={{ marginTop: "16px" }}>
            <DangerZone />
          </div>
        )}
      </div>
    </div>
  );
}
