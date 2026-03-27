import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// ─── CSS variable sets ─────────────────────────────────────────────────────────
const DARK = `
  --background:#0a0a0c;
  --foreground:#f4f4f5;
  --card:#111113;
  --border:rgba(255,255,255,0.09);
  --muted-foreground:#71717a;
  --hover-bg:rgba(255,255,255,0.05);
`;
const LIGHT = `
  --background:#ffffff;
  --foreground:#09090b;
  --card:#fafafa;
  --border:rgba(0,0,0,0.1);
  --muted-foreground:#71717a;
  --hover-bg:rgba(0,0,0,0.04);
`;

function applyTheme(dark) {
  document.documentElement.style.cssText = dark ? DARK : LIGHT;
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  try {
    localStorage.setItem("synth-theme", dark ? "dark" : "light");
  } catch (_) {}
}

function getInitialDark() {
  try {
    const stored = localStorage.getItem("synth-theme");
    if (stored) return stored === "dark";
  } catch (_) {}
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
}

// ─── DashboardLayout ──────────────────────────────────────────────────────────
export default function DashboardLayout({ children, title, breadcrumbs }) {
  const [isDark, setIsDark] = useState(() => {
    const dark = getInitialDark();
    // Apply immediately — avoid flash
    if (typeof document !== "undefined") applyTheme(dark);
    return dark;
  });

  // Sync when state changes
  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((v) => !v), []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "var(--background)",
        boxSizing: "border-box",
      }}
    >
      <Sidebar isDark={isDark} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Topbar
          title={title}
          breadcrumbs={breadcrumbs}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border) transparent",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
