import { useState, useMemo, useEffect, useCallback } from "react";

// ─── API ─────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:3000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

async function fetchHistory() {
  const res = await fetch(`${API_BASE}/api/generation/history`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch history");
  const data = await res.json();
  return data.generations || [];
}

async function deleteGenerationAPI(id) {
  const res = await fetch(`${API_BASE}/api/generation/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
}

async function downloadFile(downloadLink, fileName) {
  const res = await fetch(`${API_BASE}${downloadLink}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

// Helper: map a DB generation record to the shape the UI expects
function mapGenToJob(gen) {
  const d = new Date(gen.created_at);
  return {
    id: gen.id,
    file: gen.original_file_name,
    synth: gen.drive_link
      ? gen.drive_link.split("/").pop()
      : "—",
    rows: gen.rows_generated ?? 0,
    cols: "—",
    score: gen.quality_score != null ? parseFloat(gen.quality_score.toFixed(1)) : null,
    ks: null,
    meanDev: null,
    varRatio: null,
    corrPct: null,
    model: "Multivariate Normal",
    status: "complete",
    duration: "—",
    date: d.toISOString().slice(0, 10),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    size: gen.generated_file_size
      ? gen.generated_file_size >= 1048576
        ? `${(gen.generated_file_size / 1048576).toFixed(1)} MB`
        : `${(gen.generated_file_size / 1024).toFixed(1)} KB`
      : "—",
    driveLink: gen.drive_link || null,
  };
}

// ─── Confirm Delete Modal ──────────────────────────────────────────────────────
const DeleteModal = ({ job, onConfirm, onCancel }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(4px)",
    }}
  >
    <div
      style={{
        width: "360px",
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          border: "1px solid rgba(239,68,68,0.25)",
          backgroundColor: "rgba(239,68,68,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ef4444",
        }}
      >
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
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </div>
      <div>
        <p
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--foreground)",
            margin: "0 0 6px 0",
          }}
        >
          Delete record?
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "var(--muted-foreground)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
            {job.file}
          </span>{" "}
          and its generation record will be permanently removed. This cannot be
          undone.
        </p>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={onCancel}
          className="ghost-btn"
          style={{
            flex: 1,
            padding: "9px",
            backgroundColor: "transparent",
            color: "var(--muted-foreground)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.12s",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: "9px",
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }
  @keyframes drawerIn {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0);    }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1;   transform: scale(1);    }
    50%       { opacity: 0.4; transform: scale(0.75); }
  }
  .hist-row { transition: background-color 0.1s; cursor: pointer; }
  .hist-row:hover { background-color: rgba(255,255,255,0.03) !important; }
  .hist-row-active { background-color: rgba(255,255,255,0.04) !important; }
  .ghost-btn:hover { background: rgba(255,255,255,0.05) !important; }
  .gen-btn:hover { opacity: 0.88; }
  .filter-chip:hover { border-color: var(--foreground) !important; color: var(--foreground) !important; }
  .close-btn:hover { background: rgba(255,255,255,0.07) !important; }
`;

// ─── Color tokens — ONLY icon badges + status badges ──────────────────────────
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
  red: "#ef4444",
  redDim: "rgba(239,68,68,0.12)",
  redBorder: "rgba(239,68,68,0.25)",
};

// ─── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const FileCSVIcon = ({ size = 16 }) => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);
const DownloadIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const RefreshIcon = () => (
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
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
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
const XIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ChevronUpIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    width="12"
    height="12"
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
const DatabaseIcon = () => (
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
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);
const BarChartIcon = () => (
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
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const ZapIcon = () => (
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
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const ClockIcon = () => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const CloudIcon = () => (
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
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);
const CpuIcon = () => (
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
const ShieldIcon = () => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// (Mock data removed — fetched from API now)
const ALL_JOBS = [];

const FILTER_OPTIONS = ["All", "Complete", "Failed"];

// Summary card themes — color only on the icon badge
const CARD_THEMES = [
  { accent: C.blue, accentDim: C.blueDim, accentBorder: C.blueBorder },
  { accent: C.purple, accentDim: C.purpleDim, accentBorder: C.purpleBorder },
  { accent: C.amber, accentDim: C.amberDim, accentBorder: C.amberBorder },
  { accent: C.green, accentDim: C.greenDim, accentBorder: C.greenBorder },
];

// ─── Summary Cards ─────────────────────────────────────────────────────────────
const SummaryCards = ({ jobs }) => {
  const complete = jobs.filter((j) => j.status === "complete");
  const totalRows = complete.reduce((a, b) => a + b.rows, 0);
  const avgScore = complete.length
    ? (complete.reduce((a, b) => a + b.score, 0) / complete.length).toFixed(1)
    : "—";

  const cards = [
    {
      icon: <DatabaseIcon />,
      label: "Total Generations",
      value: String(jobs.length),
      sub: `${complete.length} successful`,
    },
    {
      icon: <ZapIcon />,
      label: "Rows Generated",
      value:
        totalRows >= 1000000
          ? `${(totalRows / 1000000).toFixed(1)}M`
          : `${(totalRows / 1000).toFixed(0)}K`,
      sub: "synthetic data points",
    },
    {
      icon: <BarChartIcon />,
      label: "Avg. Similarity",
      value: `${avgScore}%`,
      sub: "across all datasets",
    },
    {
      icon: <ClockIcon />,
      label: "This Month",
      value: String(jobs.filter((j) => j.date.startsWith(new Date().toISOString().slice(0, 7))).length),
      sub: `generations in ${new Date().toLocaleDateString("en-US", { month: "long" })}`,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px",
      }}
    >
      {cards.map((c, i) => {
        const { accent, accentDim, accentBorder } = CARD_THEMES[i];
        return (
          <div
            key={c.label}
            style={{
              padding: "18px 20px",
              borderRadius: "11px",
              border: "1px solid var(--border)",
              backgroundColor: "rgba(255,255,255,0.01)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              animation: `fadeSlideIn 0.3s ease-out ${i * 50}ms both`,
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
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--muted-foreground)",
                }}
              >
                {c.label}
              </span>
              {/* ← colored icon badge only */}
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: `1px solid ${accentBorder}`,
                  backgroundColor: accentDim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: accent,
                }}
              >
                {c.icon}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "var(--foreground)",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  animation: "countUp 0.4s ease-out",
                }}
              >
                {c.value}
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                  margin: "3px 0 0 0",
                }}
              >
                {c.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Score bar — monochrome ────────────────────────────────────────────────────
const ScoreBar = ({ score }) => {
  if (!score)
    return (
      <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
        —
      </span>
    );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "48px",
          height: "3px",
          borderRadius: "99px",
          backgroundColor: "var(--border)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            borderRadius: "99px",
            backgroundColor: "var(--foreground)",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "var(--foreground)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {score}%
      </span>
    </div>
  );
};

// ─── Status Badge — colored ────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const ok = status === "complete";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 9px",
        borderRadius: "99px",
        border: `1px solid ${ok ? C.greenBorder : C.redBorder}`,
        backgroundColor: ok ? C.greenDim : C.redDim,
        fontSize: "11px",
        fontWeight: 500,
        color: ok ? C.green : C.red,
      }}
    >
      <div
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: ok ? C.green : C.red,
        }}
      />
      {ok ? "Complete" : "Failed"}
    </div>
  );
};

// ─── Detail Drawer ─────────────────────────────────────────────────────────────
const DetailDrawer = ({ job, onClose, onRegenerate, onDelete }) => {
  const metrics = [
    { label: "KS Statistic", value: job.ks ? job.ks.toFixed(3) : "—" },
    { label: "Mean Deviation", value: job.meanDev ?? "—" },
    {
      label: "Variance Ratio",
      value: job.varRatio ? job.varRatio.toFixed(3) : "—",
    },
    { label: "Corr. Preserved", value: job.corrPct ? `${job.corrPct}%` : "—" },
  ];
  const details = [
    {
      icon: <FileCSVIcon size={13} />,
      label: "Original file",
      value: job.file,
    },
    { icon: <FileCSVIcon size={13} />, label: "Output file", value: job.synth },
    {
      icon: <ZapIcon />,
      label: "Rows generated",
      value: job.rows.toLocaleString(),
    },
    { icon: <DatabaseIcon />, label: "Columns", value: String(job.cols) },
    { icon: <CpuIcon />, label: "Model", value: job.model },
    { icon: <ClockIcon />, label: "Duration", value: job.duration },
    { icon: <CloudIcon />, label: "File size", value: job.size },
    {
      icon: <ShieldIcon />,
      label: "Privacy",
      value: "100% — no real data stored",
    },
  ];

  return (
    <div
      style={{
        width: "360px",
        flexShrink: 0,
        borderLeft: "1px solid var(--border)",
        backgroundColor: "var(--card)",
        display: "flex",
        flexDirection: "column",
        animation: "drawerIn 0.22s ease-out",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 20px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              {/* ← colored status badge */}
              <StatusBadge status={job.status} />
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--muted-foreground)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {job.id}
              </span>
            </div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: "0 0 2px 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {job.file}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              {job.date} · {job.time}
            </p>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "5px",
              cursor: "pointer",
              color: "var(--muted-foreground)",
              lineHeight: 0,
              flexShrink: 0,
              transition: "background 0.12s",
            }}
          >
            <XIcon />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
      >
        {/* Score hero */}
        {job.score && (
          <div
            style={{
              padding: "18px 20px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted-foreground)",
                margin: "0 0 12px 0",
              }}
            >
              Similarity Score
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  fontSize: "38px",
                  fontWeight: 900,
                  color: "var(--foreground)",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  animation: "countUp 0.35s ease-out",
                }}
              >
                {job.score}%
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: "6px",
                    borderRadius: "99px",
                    backgroundColor: "var(--border)",
                    overflow: "hidden",
                    marginBottom: "6px",
                  }}
                >
                  <div
                    style={{
                      width: `${job.score}%`,
                      height: "100%",
                      borderRadius: "99px",
                      backgroundColor: "var(--foreground)",
                      transition: "width 0.5s ease-out",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                    margin: 0,
                  }}
                >
                  {job.score >= 95
                    ? "Excellent"
                    : job.score >= 90
                      ? "Very good"
                      : "Good"}{" "}
                  statistical fidelity
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistical validation */}
        {job.score && (
          <div
            style={{
              padding: "18px 20px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted-foreground)",
                margin: "0 0 10px 0",
              }}
            >
              Statistical Validation
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {metrics.map((m) => (
                <div
                  key={m.label}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "rgba(255,255,255,0.01)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      color: "var(--muted-foreground)",
                      margin: "0 0 2px 0",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {m.label}
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "var(--foreground)",
                      margin: 0,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generation details */}
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted-foreground)",
              margin: "0 0 10px 0",
            }}
          >
            Generation Details
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            {details.map((d, i) => (
              <div
                key={d.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderBottom:
                    i < details.length - 1 ? "1px solid var(--border)" : "none",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--muted-foreground)",
                    flexShrink: 0,
                  }}
                >
                  {d.icon}
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {d.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    textAlign: "right",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "160px",
                  }}
                >
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div
        style={{
          padding: "14px 20px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        {job.status === "complete" && (
          <button
            className="gen-btn"
            onClick={() => {
              if (job.driveLink) downloadFile(job.driveLink, job.synth);
            }}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "var(--foreground)",
              color: "var(--background)",
              border: "1px solid var(--foreground)",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "opacity 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
            }}
          >
            <DownloadIcon /> Download CSV
          </button>
        )}
        <button
          className="ghost-btn"
          onClick={() => onRegenerate(job)}
          style={{
            width: "100%",
            padding: "9px",
            backgroundColor: "transparent",
            color: "var(--muted-foreground)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.12s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
          }}
        >
          <RefreshIcon /> Generate Again
        </button>
        <button
          className="ghost-btn"
          onClick={onDelete}
          style={{
            width: "100%",
            padding: "9px",
            backgroundColor: "transparent",
            color: "var(--muted-foreground)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.12s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
          }}
        >
          <TrashIcon /> Delete record
        </button>
      </div>
    </div>
  );
};

// ─── Table ─────────────────────────────────────────────────────────────────────
const COLUMNS = [
  { key: "date", label: "Date", sortable: true },
  { key: "file", label: "File", sortable: true },
  { key: "rows", label: "Rows", sortable: true },
  { key: "cols", label: "Columns", sortable: true },
  { key: "score", label: "Similarity", sortable: true },
  { key: "status", label: "Status", sortable: false },
  { key: "dur", label: "Duration", sortable: false },
];

const HistoryTable = ({
  jobs,
  selectedId,
  onSelect,
  sortKey,
  sortDir,
  onSort,
}) => (
  <div style={{ overflowX: "auto" }}>
    <table
      style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}
    >
      <thead>
        <tr style={{ borderBottom: "1px solid var(--border)" }}>
          <th
            style={{
              width: "36px",
              padding: "9px 16px",
              borderBottom: "1px solid var(--border)",
              backgroundColor: "rgba(255,255,255,0.005)",
            }}
          />
          {COLUMNS.map((col) => (
            <th
              key={col.key}
              onClick={col.sortable ? () => onSort(col.key) : undefined}
              style={{
                padding: "9px 16px",
                textAlign: "left",
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color:
                  sortKey === col.key
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                borderBottom: "1px solid var(--border)",
                backgroundColor: "rgba(255,255,255,0.005)",
                cursor: col.sortable ? "pointer" : "default",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {col.label}
                {col.sortable && (
                  <span
                    style={{
                      opacity: sortKey === col.key ? 1 : 0.3,
                      lineHeight: 0,
                    }}
                  >
                    {sortKey === col.key && sortDir === "asc" ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon />
                    )}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {jobs.map((job, i) => {
          const active = selectedId === job.id;
          return (
            <tr
              key={job.id}
              className={`hist-row${active ? " hist-row-active" : ""}`}
              onClick={() => onSelect(active ? null : job)}
              style={{
                borderBottom:
                  i < jobs.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <td style={{ padding: "12px 16px", width: "36px" }}>
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: active
                      ? "var(--foreground)"
                      : "transparent",
                    margin: "auto",
                    transition: "background-color 0.15s",
                  }}
                />
              </td>
              <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    margin: "0 0 1px 0",
                  }}
                >
                  {job.date}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                    margin: 0,
                  }}
                >
                  {job.time}
                </p>
              </td>
              <td style={{ padding: "12px 16px" }}>
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
                      backgroundColor: "rgba(255,255,255,0.025)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    <FileCSVIcon size={13} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--foreground)",
                        margin: "0 0 1px 0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "180px",
                      }}
                    >
                      {job.file}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "var(--muted-foreground)",
                        margin: 0,
                        fontFamily: "monospace",
                      }}
                    >
                      {job.id}
                    </p>
                  </div>
                </div>
              </td>
              <td style={{ padding: "12px 16px" }}>
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
              <td style={{ padding: "12px 16px" }}>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--foreground)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {job.cols}
                </span>
              </td>
              <td style={{ padding: "12px 16px" }}>
                <ScoreBar score={job.score} />
              </td>
              {/* ← colored status badge only */}
              <td style={{ padding: "12px 16px" }}>
                <StatusBadge status={job.status} />
              </td>
              <td style={{ padding: "12px 16px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {job.duration}
                </span>
              </td>
            </tr>
          );
        })}
        {jobs.length === 0 && (
          <tr>
            <td
              colSpan={8}
              style={{ padding: "48px 16px", textAlign: "center" }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--muted-foreground)",
                  margin: 0,
                }}
              >
                No generations match your filters.
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// ─── History Page ──────────────────────────────────────────────────────────────
export default function History() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch history from API on mount
  useEffect(() => {
    setLoading(true);
    fetchHistory()
      .then((gens) => setJobs(gens.map(mapGenToJob)))
      .catch((err) => console.error("Failed to load history:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteGenerationAPI(deleteTarget.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
    setDeleteTarget(null);
    setSelected(null);
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let list = jobs;
    if (filter === "Complete")
      list = list.filter((j) => j.status === "complete");
    if (filter === "Failed") list = list.filter((j) => j.status === "failed");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (j) =>
          j.file.toLowerCase().includes(q) || j.id.toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) => {
      let av = a[sortKey],
        bv = b[sortKey];
      if (sortKey === "date") {
        av = a.date + a.time;
        bv = b.date + b.time;
      }
      if (sortKey === "score") {
        av = av ?? -1;
        bv = bv ?? -1;
      }
      if (typeof av === "string")
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return list;
  }, [search, filter, sortKey, sortDir, jobs]);

  const selectedJob = selected
    ? (jobs.find((j) => j.id === selected.id) ?? null)
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <style>{STYLES}</style>

      {/* Page header */}
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
            History
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            All synthetic dataset generations — click any row for details.
          </p>
        </div>
        <button
          className="gen-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 16px",
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
            border: "1px solid var(--foreground)",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.15s",
            flexShrink: 0,
          }}
        >
          <DownloadIcon /> Export all
        </button>
      </div>

      {deleteTarget && (
        <DeleteModal
          job={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Summary cards */}
      <SummaryCards jobs={jobs} />

      {/* Table + Drawer */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          animation: "fadeSlideIn 0.3s ease-out 0.1s both",
          backgroundColor: "var(--card)",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 20px",
              borderBottom: "1px solid var(--border)",
              backgroundColor: "rgba(255,255,255,0.01)",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 12px",
                border: `1px solid ${searchFocused ? "var(--foreground)" : "var(--border)"}`,
                borderRadius: "7px",
                flex: "1",
                minWidth: "160px",
                maxWidth: "280px",
                transition: "border-color 0.15s",
              }}
            >
              <span
                style={{
                  color: "var(--muted-foreground)",
                  lineHeight: 0,
                  flexShrink: 0,
                }}
              >
                <SearchIcon />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search by file or ID…"
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "13px",
                  color: "var(--foreground)",
                  caretColor: "var(--foreground)",
                  width: "100%",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--muted-foreground)",
                    lineHeight: 0,
                    padding: 0,
                  }}
                >
                  <XIcon />
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {FILTER_OPTIONS.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    className="filter-chip"
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "6px 13px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.12s",
                      backgroundColor: active
                        ? "var(--foreground)"
                        : "transparent",
                      color: active
                        ? "var(--background)"
                        : "var(--muted-foreground)",
                      border: `1px solid ${active ? "var(--foreground)" : "var(--border)"}`,
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
                marginLeft: "auto",
                flexShrink: 0,
              }}
            >
              {filtered.length} of {jobs.length}
            </span>
          </div>

          <HistoryTable
            jobs={filtered}
            selectedId={selectedJob?.id ?? null}
            onSelect={setSelected}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />
        </div>

        {selectedJob && (
          <DetailDrawer
            job={selectedJob}
            onClose={() => setSelected(null)}
            onRegenerate={() => {}}
            onDelete={() => setDeleteTarget(selectedJob)}
          />
        )}
      </div>
    </div>
  );
}
