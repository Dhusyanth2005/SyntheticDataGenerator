import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ─── Styles ───────────────────────────────────────────────────────────────────
const TOPBAR_STYLES = `
  .tb-icon-btn {
    position: relative;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 7px;
    cursor: pointer;
    color: var(--foreground);
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    transition: background-color 0.12s, border-color 0.12s;
    flex-shrink: 0;
  }
  .tb-icon-btn:hover {
    background: rgba(255,255,255,0.06);
    border-color: var(--border);
  }
  .tb-crumb-link {
    transition: color 0.12s;
  }
  .tb-crumb-link:hover {
    color: var(--foreground) !important;
  }
  .tb-user-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 4px 8px 4px 4px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.12s, border-color 0.12s;
  }
  .tb-user-btn:hover {
    background: rgba(255,255,255,0.06);
    border-color: var(--border);
  }
  .tb-drop-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 400;
    transition: background-color 0.1s;
    user-select: none;
  }
  .tb-drop-item:hover {
    background: rgba(255,255,255,0.06);
  }
  .tb-search-input {
    padding: 5px 10px 5px 30px;
    font-size: 13px;
    width: 176px;
    border: 1px solid var(--border);
    border-radius: 7px;
    outline: none;
    color: var(--foreground);
    background: transparent;
    caret-color: var(--foreground);
    transition: border-color 0.15s, width 0.2s;
  }
  .tb-search-input:focus {
    border-color: var(--foreground);
    width: 210px;
  }
  .tb-search-input::placeholder {
    color: var(--muted-foreground);
  }
`;

// ─── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const BellIcon = () => (
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
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const SunIcon = () => (
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
const MoonIcon = () => (
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
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const LogOutIcon = () => (
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
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const UserIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const SettingsIcon = () => (
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
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const SlashIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <line x1="16" y1="4" x2="8" y2="20" />
  </svg>
);

// ─── Breadcrumb builder ────────────────────────────────────────────────────────
const buildBreadcrumbs = (pathname) => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [{ label: "Home", path: "/" }];
  const crumbs = [{ label: "Home", path: "/" }];
  let accumulated = "";
  parts.forEach((part) => {
    accumulated += `/${part}`;
    crumbs.push({
      label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
      path: accumulated,
    });
  });
  return crumbs;
};

// ─── Search Bar ────────────────────────────────────────────────────────────────
const SearchBar = () => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: "9px",
          color: "var(--muted-foreground)",
          lineHeight: 0,
          pointerEvents: "none",
        }}
      >
        <SearchIcon />
      </span>
      <input
        className="tb-search-input"
        type="text"
        placeholder="Search..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {/* ⌘K badge — only when unfocused */}
      {!focused && (
        <div
          style={{
            position: "absolute",
            right: "8px",
            display: "flex",
            alignItems: "center",
            gap: "2px",
            pointerEvents: "none",
          }}
        >
          <kbd
            style={{
              fontSize: "10px",
              color: "var(--muted-foreground)",
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "1px 4px",
              lineHeight: "1.6",
              fontFamily: "inherit",
            }}
          >
            ⌘K
          </kbd>
        </div>
      )}
    </div>
  );
};

// ─── Notification badge icon ───────────────────────────────────────────────────
const NotifButton = () => (
  <button
    className="tb-icon-btn"
    title="Notifications"
    style={{ position: "relative" }}
  >
    <BellIcon />
    {/* red dot */}
    <span
      style={{
        position: "absolute",
        top: "5px",
        right: "5px",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: "var(--foreground)",
        border: "1.5px solid var(--card)",
      }}
    />
  </button>
);

// ─── User Dropdown ─────────────────────────────────────────────────────────────
const UserDropdown = ({ navigate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const items = [
    { label: "Profile", icon: <UserIcon />, path: "/profile" },
    { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
    { label: "Sign out", icon: <LogOutIcon />, path: "/logout", danger: true },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="tb-user-btn" onClick={() => setOpen((v) => !v)}>
        {/* Avatar */}
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            flexShrink: 0,
            letterSpacing: "-0.02em",
          }}
        >
          SS
        </div>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--foreground)",
            whiteSpace: "nowrap",
          }}
        >
          shadcn/studio
        </span>
        <span style={{ color: "var(--muted-foreground)", lineHeight: 0 }}>
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: "188px",
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.04) inset",
            zIndex: 100,
            animation: "tbDropIn 0.14s ease-out",
          }}
        >
          <style>{`@keyframes tbDropIn { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }`}</style>

          {/* User info header */}
          <div
            style={{
              padding: "10px 12px 10px 12px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "var(--foreground)",
                  color: "var(--background)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                SS
              </div>
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    margin: "0 0 1px 0",
                  }}
                >
                  shadcn/studio
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                    margin: 0,
                  }}
                >
                  hello@shadcnstudio.com
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: "6px" }}>
            {items.map((item, i) => (
              <div key={item.label}>
                {item.danger && i > 0 && (
                  <div
                    style={{
                      height: "1px",
                      backgroundColor: "var(--border)",
                      margin: "4px 0",
                    }}
                  />
                )}
                <div
                  className="tb-drop-item"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setOpen(false);
                    navigate(item.path);
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (setOpen(false), navigate(item.path))
                  }
                  style={{ color: "var(--foreground)" }}
                >
                  <span
                    style={{ lineHeight: 0, color: "var(--muted-foreground)" }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Divider ──────────────────────────────────────────────────────────────────
const VDivider = () => (
  <div
    style={{
      width: "1px",
      height: "18px",
      backgroundColor: "var(--border)",
      flexShrink: 0,
      margin: "0 1px",
    }}
  />
);

// ─── Topbar ────────────────────────────────────────────────────────────────────
const Topbar = ({
  isDark,
  onToggleTheme,
  title,
  breadcrumbs: breadcrumbsProp,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbs = breadcrumbsProp ?? buildBreadcrumbs(location.pathname);

  return (
    <header
      style={{
        height: "52px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        backgroundColor: "var(--card)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
        gap: "12px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <style>{TOPBAR_STYLES}</style>

      {/* ── LEFT: Breadcrumb ── */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "3px",
          minWidth: 0,
          flex: 1,
        }}
      >
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <div
              key={crumb.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                minWidth: 0,
              }}
            >
              {i > 0 && (
                <span
                  style={{
                    color: "var(--border)",
                    lineHeight: 0,
                    flexShrink: 0,
                    opacity: 0.7,
                  }}
                >
                  <SlashIcon />
                </span>
              )}
              <span
                className={!isLast ? "tb-crumb-link" : undefined}
                role={isLast ? undefined : "button"}
                tabIndex={isLast ? undefined : 0}
                onClick={() => !isLast && navigate(crumb.path)}
                onKeyDown={(e) =>
                  !isLast && e.key === "Enter" && navigate(crumb.path)
                }
                style={{
                  fontSize: "13px",
                  fontWeight: isLast ? 600 : 400,
                  color: isLast
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                  cursor: isLast ? "default" : "pointer",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  userSelect: "none",
                  lineHeight: 1,
                }}
              >
                {crumb.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* ── RIGHT: Actions ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          flexShrink: 0,
        }}
      >
        {/* Search */}
        <SearchBar />

        <VDivider />

        {/* GitHub */}
        <button className="tb-icon-btn" title="View on GitHub">
          <GithubIcon />
        </button>

        {/* Theme toggle */}
        <button
          className="tb-icon-btn"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={onToggleTheme}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Notifications */}
        <NotifButton />

        <VDivider />

        {/* User menu */}
        <UserDropdown navigate={navigate} />
      </div>
    </header>
  );
};

export default Topbar;
