import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ─── SVG: Logo Icon ────────────────────────────────────────────────────────────
const LogoIcon = (props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 328 329"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect y="0.5" width="328" height="328" rx="164" fill="var(--foreground)" />
    <path
      d="M165.018 72.3008V132.771C165.018 152.653 148.9 168.771 129.018 168.771H70.2288"
      stroke="var(--background)"
      strokeWidth="20"
    />
    <path
      d="M166.627 265.241L166.627 204.771C166.627 184.889 182.744 168.771 202.627 168.771L261.416 168.771"
      stroke="var(--background)"
      strokeWidth="20"
    />
    <line
      x1="238.136"
      y1="98.8184"
      x2="196.76"
      y2="139.707"
      stroke="var(--background)"
      strokeWidth="20"
    />
    <line
      x1="135.688"
      y1="200.957"
      x2="94.3128"
      y2="241.845"
      stroke="var(--background)"
      strokeWidth="20"
    />
    <line
      x1="133.689"
      y1="137.524"
      x2="92.5566"
      y2="96.3914"
      stroke="var(--background)"
      strokeWidth="20"
    />
    <line
      x1="237.679"
      y1="241.803"
      x2="196.547"
      y2="200.671"
      stroke="var(--background)"
      strokeWidth="20"
    />
  </svg>
);

// ─── Nav Icons ─────────────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ComponentsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ThemeIcon = () => (
  <svg
    width="16"
    height="16"
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

const DocsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const TemplatesIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

const BlocksIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const ChartsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ColorsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20" />
    <path d="M12 12 2 12" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="16"
    height="16"
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

const ChevronIcon = ({ open }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: "transform 0.2s",
      transform: open ? "rotate(90deg)" : "rotate(0deg)",
    }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CollapseIcon = ({ collapsed }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: "transform 0.25s",
      transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
    }}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ExternalIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// ─── Nav Structure ─────────────────────────────────────────────────────────────
const NAV = [
  {
    section: "Menu",
    items: [
      { label: "Dashboard", icon: <HomeIcon />, path: "/dashboard" },
      { label: "Generate", icon: <ComponentsIcon />, path: "/generate" },
      { label: "History", icon: <DocsIcon />, path: "/history" },
    ],
  },
  {
    section: "Account",
    items: [{ label: "Settings", icon: <SettingsIcon />, path: "/settings" }],
  },
];

// ─── Nav Item ─────────────────────────────────────────────────────────────────
const NavItem = ({ item, collapsed, currentPath, navigate }) => {
  const isActive =
    currentPath === item.path || currentPath?.startsWith(item.path + "/");
  const hasChildren = item.children?.length > 0;
  const [open, setOpen] = useState(isActive && hasChildren);
  const [hovered, setHovered] = useState(false);
  const [childHovered, setChildHovered] = useState(null);

  const isChildActive = (child) => currentPath === child.path;

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (hasChildren) setOpen((v) => !v);
          else navigate(item.path);
        }}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          (hasChildren ? setOpen((v) => !v) : navigate(item.path))
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: collapsed ? "0" : "10px",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "9px 0" : "7px 10px",
          borderRadius: "6px",
          cursor: "pointer",
          userSelect: "none",
          backgroundColor: isActive
            ? "var(--foreground)"
            : hovered
              ? "var(--input-bg, rgba(0,0,0,0.04))"
              : "transparent",
          color: isActive ? "var(--background)" : "var(--foreground)",
          transition: "background-color 0.15s, color 0.15s",
          position: "relative",
        }}
        title={collapsed ? item.label : undefined}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: 0,
          }}
        >
          <span style={{ flexShrink: 0, display: "flex", lineHeight: 0 }}>
            {item.icon}
          </span>
          {!collapsed && (
            <span
              style={{
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.label}
            </span>
          )}
        </div>
        {!collapsed && hasChildren && (
          <span
            style={{
              flexShrink: 0,
              color: isActive ? "var(--background)" : "var(--muted-foreground)",
              lineHeight: 0,
            }}
          >
            <ChevronIcon open={open} />
          </span>
        )}
      </div>

      {/* Sub-items */}
      {hasChildren && open && !collapsed && (
        <div
          style={{
            marginLeft: "26px",
            marginTop: "2px",
            paddingLeft: "12px",
            borderLeft: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "1px",
          }}
        >
          {item.children.map((child) => {
            const childActive = isChildActive(child);
            return (
              <div
                key={child.path}
                role="button"
                tabIndex={0}
                onClick={() => navigate(child.path)}
                onKeyDown={(e) => e.key === "Enter" && navigate(child.path)}
                onMouseEnter={() => setChildHovered(child.path)}
                onMouseLeave={() => setChildHovered(null)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "13px",
                  cursor: "pointer",
                  userSelect: "none",
                  fontWeight: childActive ? 600 : 400,
                  color: childActive
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                  backgroundColor:
                    childHovered === child.path
                      ? "var(--input-bg, rgba(0,0,0,0.04))"
                      : "transparent",
                  transition: "background-color 0.12s, color 0.12s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {child.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [collapseHovered, setCollapseHovered] = useState(false);
  const [upgradeHovered, setUpgradeHovered] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? "64px" : "240px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--card)",
        borderRight: "1px solid var(--border)",
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "0" : "0 16px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
          height: "60px",
          boxSizing: "border-box",
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <LogoIcon
              style={{ width: "28px", height: "28px", flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--foreground)",
                whiteSpace: "nowrap",
              }}
            >
              shadcn/studio
            </span>
          </div>
        )}

        {collapsed && <LogoIcon style={{ width: "28px", height: "28px" }} />}

        {!collapsed && (
          <button
            onMouseEnter={() => setCollapseHovered(true)}
            onMouseLeave={() => setCollapseHovered(false)}
            onClick={() => setCollapsed(true)}
            style={{
              background: collapseHovered
                ? "var(--input-bg, rgba(0,0,0,0.05))"
                : "transparent",
              border: "1px solid",
              borderColor: collapseHovered ? "var(--border)" : "transparent",
              borderRadius: "6px",
              cursor: "pointer",
              color: "var(--muted-foreground)",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 0,
              transition: "background-color 0.15s, border-color 0.15s",
              flexShrink: 0,
            }}
            title="Collapse sidebar"
          >
            <CollapseIcon collapsed={false} />
          </button>
        )}
      </div>

      {/* ── Expand button when collapsed ── */}
      {collapsed && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px 0 6px 0",
          }}
        >
          <button
            onMouseEnter={() => setCollapseHovered(true)}
            onMouseLeave={() => setCollapseHovered(false)}
            onClick={() => setCollapsed(false)}
            style={{
              background: collapseHovered
                ? "var(--input-bg, rgba(0,0,0,0.05))"
                : "transparent",
              border: "1px solid",
              borderColor: collapseHovered ? "var(--border)" : "transparent",
              borderRadius: "6px",
              cursor: "pointer",
              color: "var(--muted-foreground)",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 0,
              transition: "background-color 0.15s, border-color 0.15s",
            }}
            title="Expand sidebar"
          >
            <CollapseIcon collapsed={true} />
          </button>
        </div>
      )}

      {/* ── Nav ── */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: collapsed ? "12px 8px" : "12px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          scrollbarWidth: "none",
        }}
      >
        {NAV.map((group) => (
          <div
            key={group.section}
            style={{ display: "flex", flexDirection: "column", gap: "2px" }}
          >
            {!collapsed && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--muted-foreground)",
                  padding: "0 10px",
                  marginBottom: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                {group.section}
              </span>
            )}

            {collapsed && (
              <div
                style={{
                  height: "1px",
                  backgroundColor: "var(--border)",
                  margin: "4px 4px 8px 4px",
                }}
              />
            )}

            {group.items.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                collapsed={collapsed}
                currentPath={currentPath}
                navigate={navigate}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: collapsed ? "12px 8px" : "12px 10px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Upgrade CTA — only when expanded */}
        {!collapsed && (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              backgroundColor: "var(--background)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  margin: "0 0 2px 0",
                }}
              >
                Upgrade to Pro
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Unlock all components, blocks &amp; templates.
              </p>
            </div>
            <button
              onMouseEnter={() => setUpgradeHovered(true)}
              onMouseLeave={() => setUpgradeHovered(false)}
              style={{
                width: "100%",
                padding: "7px 12px",
                backgroundColor: upgradeHovered
                  ? "var(--foreground)"
                  : "transparent",
                color: upgradeHovered
                  ? "var(--background)"
                  : "var(--foreground)",
                border: "1px solid var(--foreground)",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "background-color 0.15s, color 0.15s",
              }}
            >
              Get Pro Access
              <ExternalIcon />
            </button>
          </div>
        )}

        {/* User Profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: collapsed ? "0" : "10px",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "6px 0" : "6px 4px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "32px",
              height: "32px",
              flexShrink: 0,
              borderRadius: "50%",
              backgroundColor: "var(--foreground)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--background)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            SS
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                shadcn/studio
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                hello@shadcnstudio.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
