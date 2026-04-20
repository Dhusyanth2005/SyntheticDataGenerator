import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── API ─────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:3000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

async function fetchDashboardData() {
  const res = await fetch(`${API_BASE}/api/generation/history`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.generations || [];
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1;   transform: scale(1);    }
    50%       { opacity: 0.4; transform: scale(0.75); }
  }
  .dash-card { transition: border-color 0.15s, background-color 0.15s; }
  .dash-card:hover { border-color: rgba(255,255,255,0.2) !important; background-color: rgba(255,255,255,0.025) !important; }
  .dash-row-hover:hover { background-color: rgba(255,255,255,0.025) !important; }
  .ghost-btn:hover { background: rgba(255,255,255,0.05) !important; }
`;

// ─── Color tokens — ONLY for icon badges + status badges ─────────────────────
const C = {
  blue: "#3b82f6",
  blueDim: "rgba(59,130,246,0.12)",
  blueBorder: "rgba(59,130,246,0.25)",
  purple: "#a855f7",
  purpleDim: "rgba(168,85,247,0.12)",
  purpleBorder: "rgba(168,85,247,0.25)",
  amber: "#f59e0b",
  amberDim: "rgba(245,158,11,0.12)",
  amberBorder: "rgba(245,158,11,0.25)",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.12)",
  greenBorder: "rgba(34,197,94,0.25)",
};

// ─── Icons ─────────────────────────────────────────────────────────────────────
const DatabaseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);
const ZapIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const BarChartIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const ShieldIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const FileIcon = () => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);
const CheckCircleIcon = () => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const UploadIcon = () => (
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
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const ArrowUpIcon = () => (
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
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const SparkleIcon = () => (
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
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
    <path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z" />
    <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5z" />
  </svg>
);
const CloudIcon = () => (
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
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);
const CpuIcon = () => (
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

// ─── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

const SPARKLINE = [3200, 8100, 5400, 12000, 9800, 16200, 22400];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const STAT_THEMES = [
  { accent: C.blue, accentDim: C.blueDim, accentBorder: C.blueBorder },
  { accent: C.purple, accentDim: C.purpleDim, accentBorder: C.purpleBorder },
  { accent: C.amber, accentDim: C.amberDim, accentBorder: C.amberBorder },
  { accent: C.green, accentDim: C.greenDim, accentBorder: C.greenBorder },
];

const StatCard = ({
  icon,
  label,
  value,
  sub,
  delta,
  animDelay = 0,
  themeIdx = 0,
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animDelay);
    return () => clearTimeout(t);
  }, [animDelay]);

  const { accent, accentDim, accentBorder } = STAT_THEMES[themeIdx];

  return (
    <div
      className="dash-card"
      style={{
        padding: "20px 22px",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        backgroundColor: "rgba(255,255,255,0.01)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 0.35s ease ${animDelay}ms, transform 0.35s ease ${animDelay}ms, border-color 0.15s, background-color 0.15s`,
        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--muted-foreground)",
          }}
        >
          {label}
        </span>
        {/* ← ONLY color here: icon badge */}
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "7px",
            border: `1px solid ${accentBorder}`,
            backgroundColor: accentDim,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent,
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: "30px",
            fontWeight: 800,
            color: "var(--foreground)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            animation: visible ? "countUp 0.4s ease-out" : "none",
          }}
        >
          {value}
        </div>
        {sub && (
          <p
            style={{
              fontSize: "12px",
              color: "var(--muted-foreground)",
              margin: "4px 0 0 0",
            }}
          >
            {sub}
          </p>
        )}
      </div>

      {delta && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            color: "var(--foreground)",
            fontWeight: 500,
          }}
        >
          <ArrowUpIcon />
          {delta}
          <span style={{ color: "var(--muted-foreground)", fontWeight: 400 }}>
            vs last week
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Sparkline ─────────────────────────────────────────────────────────────────
const SparklineChart = () => {
  const max = Math.max(...SPARKLINE);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "6px",
        height: "52px",
      }}
    >
      {SPARKLINE.map((v, i) => {
        const isLast = i === SPARKLINE.length - 1;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              height: "100%",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "flex-end",
                width: "100%",
              }}
            >
              <div
                title={`${DAYS[i]}: ${v.toLocaleString()} rows`}
                style={{
                  width: "100%",
                  height: `${(v / max) * 100}%`,
                  minHeight: "4px",
                  borderRadius: "3px 3px 0 0",
                  backgroundColor: isLast
                    ? "var(--foreground)"
                    : "rgba(255,255,255,0.18)",
                  cursor: "default",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "9px",
                color: "var(--muted-foreground)",
                letterSpacing: "0.03em",
              }}
            >
              {DAYS[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Status Badge — colored ────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const done = status === "done";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 9px",
        borderRadius: "99px",
        border: `1px solid ${done ? C.greenBorder : C.amberBorder}`,
        backgroundColor: done ? C.greenDim : C.amberDim,
        fontSize: "11px",
        fontWeight: 500,
        color: done ? C.green : C.amber,
      }}
    >
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: done ? C.green : C.amber,
          animation: done ? "none" : "pulse-dot 1.2s ease-in-out infinite",
        }}
      />
      {done ? "Complete" : "Processing"}
    </div>
  );
};

// ─── Recent Jobs ───────────────────────────────────────────────────────────────
const RecentJobs = ({ jobs = [], onViewAll }) => (
  <div
    style={{
      border: "1px solid var(--border)",
      borderRadius: "12px",
      overflow: "hidden",
      animation: "fadeSlideIn 0.35s ease-out 0.15s both",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "rgba(255,255,255,0.01)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--foreground)",
          }}
        >
          Recent Generations
        </span>
        <span
          style={{
            padding: "1px 7px",
            borderRadius: "99px",
            border: "1px solid var(--border)",
            fontSize: "11px",
            color: "var(--muted-foreground)",
          }}
        >
          {jobs.length}
        </span>
      </div>
      <button
        className="ghost-btn"
        onClick={onViewAll}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "5px 10px",
          borderRadius: "6px",
          background: "transparent",
          border: "1px solid var(--border)",
          fontSize: "12px",
          color: "var(--muted-foreground)",
          cursor: "pointer",
          transition: "background 0.12s",
        }}
      >
        View all <ArrowRightIcon />
      </button>
    </div>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["File", "Rows", "Similarity", "Status", "Time"].map((h) => (
            <th
              key={h}
              style={{
                padding: "9px 20px",
                textAlign: "left",
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted-foreground)",
                borderBottom: "1px solid var(--border)",
                backgroundColor: "rgba(255,255,255,0.005)",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {jobs.map((job, i) => (
          <tr
            key={job.id}
            className="dash-row-hover"
            style={{
              borderBottom:
                i < jobs.length - 1 ? "1px solid var(--border)" : "none",
              transition: "background-color 0.12s",
            }}
          >
            <td style={{ padding: "12px 20px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "9px" }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    flexShrink: 0,
                    border: "1px solid var(--border)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <FileIcon />
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    maxWidth: "180px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {job.file}
                </span>
              </div>
            </td>
            <td style={{ padding: "12px 20px" }}>
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--foreground)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {job.rows.toLocaleString()}
              </span>
            </td>
            <td style={{ padding: "12px 20px" }}>
              {job.score !== null ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "3px",
                      borderRadius: "99px",
                      backgroundColor: "var(--border)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: `${job.score}%`,
                        height: "100%",
                        borderRadius: "99px",
                        backgroundColor: "var(--foreground)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {job.score}%
                  </span>
                </div>
              ) : (
                <span
                  style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
                >
                  —
                </span>
              )}
            </td>
            {/* ← ONLY color here: status badge */}
            <td style={{ padding: "12px 20px" }}>
              <StatusBadge status={job.status} />
            </td>
            <td style={{ padding: "12px 20px" }}>
              <span
                style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
              >
                {job.time}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Activity Card ─────────────────────────────────────────────────────────────
const ActivityCard = () => {
  const total = SPARKLINE.reduce((a, b) => a + b, 0);
  const pct = Math.round((SPARKLINE[6] / SPARKLINE[0] - 1) * 100);
  return (
    <div
      className="dash-card"
      style={{
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backgroundColor: "rgba(255,255,255,0.01)",
        animation: "fadeSlideIn 0.35s ease-out 0.2s both",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted-foreground)",
              margin: "0 0 4px 0",
            }}
          >
            Weekly Output
          </p>
          <p
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "var(--foreground)",
              margin: 0,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {total.toLocaleString()}
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "var(--muted-foreground)",
              margin: "2px 0 0 0",
            }}
          >
            synthetic rows this week
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 10px",
            borderRadius: "99px",
            border: "1px solid var(--border)",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--foreground)",
          }}
        >
          <ArrowUpIcon />
          {pct}%
        </div>
      </div>
      <SparklineChart />
    </div>
  );
};

// (System Status removed)

// ─── Quick Actions ─────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    icon: <SparkleIcon />,
    label: "New Generation",
    sub: "Upload CSV & generate",
    href: "/generate",
    accent: C.purple,
    accentDim: C.purpleDim,
    accentBorder: C.purpleBorder,
  },
  {
    icon: <CloudIcon />,
    label: "View History",
    sub: "Browse past generations",
    href: "/history",
    accent: C.blue,
    accentDim: C.blueDim,
    accentBorder: C.blueBorder,
  },
  {
    icon: <CpuIcon />,
    label: "ML Service Logs",
    sub: "FastAPI microservice",
    href: "#",
    accent: C.amber,
    accentDim: C.amberDim,
    accentBorder: C.amberBorder,
  },
];

const QuickActions = () => (
  <div
    className="dash-card"
    style={{
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      backgroundColor: "rgba(255,255,255,0.01)",
      animation: "fadeSlideIn 0.35s ease-out 0.3s both",
    }}
  >
    <p
      style={{
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--muted-foreground)",
        margin: 0,
      }}
    >
      Quick Actions
    </p>
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {QUICK_ACTIONS.map(
        ({ icon, label, sub, href, accent, accentDim, accentBorder }) => (
          <a
            key={label}
            href={href}
            className="ghost-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              textDecoration: "none",
              transition: "background 0.12s",
              backgroundColor: "transparent",
            }}
          >
            {/* ← ONLY color here: icon badge */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "7px",
                flexShrink: 0,
                border: `1px solid ${accentBorder}`,
                backgroundColor: accentDim,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: accent,
              }}
            >
              {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  margin: "0 0 1px 0",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                  margin: 0,
                }}
              >
                {sub}
              </p>
            </div>
            <span style={{ color: "var(--muted-foreground)" }}>
              <ArrowRightIcon />
            </span>
          </a>
        ),
      )}
    </div>
  </div>
);

// ─── Pipeline Overview ─────────────────────────────────────────────────────────
const PIPELINE_STEPS = [
  {
    icon: <UploadIcon />,
    label: "Upload",
    sub: "CSV dataset",
    accent: C.blue,
    accentDim: C.blueDim,
    accentBorder: C.blueBorder,
  },
  {
    icon: <CpuIcon />,
    label: "Train",
    sub: "Multivariate Normal",
    accent: C.purple,
    accentDim: C.purpleDim,
    accentBorder: C.purpleBorder,
  },
  {
    icon: <SparkleIcon />,
    label: "Generate",
    sub: "Synthetic rows",
    accent: C.amber,
    accentDim: C.amberDim,
    accentBorder: C.amberBorder,
  },
  {
    icon: <CheckCircleIcon />,
    label: "Validate",
    sub: "KS · variance · corr",
    accent: C.green,
    accentDim: C.greenDim,
    accentBorder: C.greenBorder,
  },
  {
    icon: <CloudIcon />,
    label: "Store",
    sub: "Local Storage",
    accent: C.blue,
    accentDim: C.blueDim,
    accentBorder: C.blueBorder,
  },
];

const PipelineOverview = () => (
  <div
    className="dash-card"
    style={{
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      backgroundColor: "rgba(255,255,255,0.01)",
      animation: "fadeSlideIn 0.35s ease-out 0.1s both",
    }}
  >
    <p
      style={{
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--muted-foreground)",
        margin: 0,
      }}
    >
      Generation Pipeline
    </p>
    <div style={{ display: "flex", alignItems: "center" }}>
      {PIPELINE_STEPS.map((step, i) => (
        <div
          key={step.label}
          style={{
            display: "flex",
            alignItems: "center",
            flex: i < PIPELINE_STEPS.length - 1 ? 1 : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {/* ← ONLY color here: icon badge */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                flexShrink: 0,
                border: `1px solid ${step.accentBorder}`,
                backgroundColor: step.accentDim,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: step.accent,
              }}
            >
              {step.icon}
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  margin: "0 0 1px 0",
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </p>
              <p
                style={{
                  fontSize: "10px",
                  color: "var(--muted-foreground)",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {step.sub}
              </p>
            </div>
          </div>
          {i < PIPELINE_STEPS.length - 1 && (
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "var(--border)",
                margin: "0 8px",
                marginBottom: "26px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function Main() {
  const navigate = useNavigate();
  const [gens, setGens] = useState([]);

  useEffect(() => {
    fetchDashboardData()
      .then(setGens)
      .catch((err) => console.error("Dashboard fetch failed:", err));
  }, []);

  // Derived stats
  const totalDatasets = gens.length;
  const totalRows = gens.reduce((a, g) => a + (g.rows_generated || 0), 0);
  const scored = gens.filter((g) => g.quality_score != null);
  const avgScore = scored.length
    ? (scored.reduce((a, g) => a + g.quality_score, 0) / scored.length).toFixed(1)
    : "—";

  const recentJobs = gens.slice(0, 5).map((g) => ({
    id: g.id,
    file: g.original_file_name,
    rows: g.rows_generated || 0,
    score: g.quality_score != null ? parseFloat(g.quality_score.toFixed(1)) : null,
    status: "done",
    time: timeAgo(g.created_at),
  }));

  const rowsFormatted =
    totalRows >= 1000000
      ? `${(totalRows / 1000000).toFixed(1)}M`
      : totalRows >= 1000
        ? `${(totalRows / 1000).toFixed(1)}K`
        : String(totalRows);

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
            Dashboard
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Overview of your synthetic data generation platform.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "99px",
            border: "1px solid var(--border)",
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "var(--foreground)",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              color: "var(--foreground)",
              fontWeight: 500,
            }}
          >
            Live
          </span>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
        }}
      >
        <StatCard
          icon={<DatabaseIcon />}
          label="Total Datasets"
          value={String(totalDatasets)}
          sub="across all generations"
          animDelay={0}
          themeIdx={0}
        />
        <StatCard
          icon={<ZapIcon />}
          label="Rows Generated"
          value={rowsFormatted}
          sub="synthetic data points"
          animDelay={60}
          themeIdx={1}
        />
        <StatCard
          icon={<BarChartIcon />}
          label="Avg. Similarity"
          value={`${avgScore}%`}
          sub="quality score validated"
          animDelay={120}
          themeIdx={2}
        />
        <StatCard
          icon={<ShieldIcon />}
          label="Privacy Score"
          value="100%"
          sub="no real data exposed"
          animDelay={180}
          themeIdx={3}
        />
      </div>

      {/* ── Pipeline ── */}
      <PipelineOverview />

      {/* ── Middle row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "14px",
          alignItems: "start",
        }}
      >
        <RecentJobs jobs={recentJobs} onViewAll={() => navigate("/history")} />
        <ActivityCard />
      </div>

      {/* ── Bottom row ── */}
      <QuickActions />
    </div>
  );
}
