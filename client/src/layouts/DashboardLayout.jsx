import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// ─── DashboardLayout ──────────────────────────────────────────────────────────
// breadcrumbs & title are optional — Topbar auto-builds from useLocation() if omitted
export default function DashboardLayout({ children, title, breadcrumbs }) {
  const [isDark, setIsDark] = useState(true);

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
      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Body (topbar + main) ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* ── Topbar — receives title & breadcrumbs from the page ── */}
        <Topbar
          title={title}
          breadcrumbs={breadcrumbs}
          isDark={isDark}
          onToggleTheme={() => setIsDark((v) => !v)}
        />

        {/* ── Scrollable page content ── */}
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
