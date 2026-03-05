import { useState, useMemo } from "react";

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
const FilterIcon = () => (
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
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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
const ArrowUpIcon = () => (
  <svg
    width="10"
    height="10"
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

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const ALL_JOBS = [
  {
    id: "gen_001",
    file: "patient_records.csv",
    synth: "synth_patient_records_10000.csv",
    rows: 10000,
    cols: 12,
    score: 94.2,
    ks: 0.031,
    meanDev: "0.18%",
    varRatio: 0.981,
    corrPct: 97.4,
    model: "Random Forest",
    status: "complete",
    duration: "28s",
    date: "2025-06-10",
    time: "14:32",
    size: "2.4 MB",
    driveLink: "#",
  },
  {
    id: "gen_002",
    file: "financial_txns.csv",
    synth: "synth_financial_txns_50000.csv",
    rows: 50000,
    cols: 8,
    score: 91.8,
    ks: 0.044,
    meanDev: "0.31%",
    varRatio: 0.963,
    corrPct: 95.1,
    model: "Random Forest",
    status: "complete",
    duration: "1m 52s",
    date: "2025-06-10",
    time: "11:15",
    size: "9.1 MB",
    driveLink: "#",
  },
  {
    id: "gen_003",
    file: "loan_applications.csv",
    synth: "synth_loan_applications_5000.csv",
    rows: 5000,
    cols: 15,
    score: 96.1,
    ks: 0.022,
    meanDev: "0.09%",
    varRatio: 0.994,
    corrPct: 98.7,
    model: "Random Forest",
    status: "complete",
    duration: "14s",
    date: "2025-06-09",
    time: "17:04",
    size: "1.1 MB",
    driveLink: "#",
  },
  {
    id: "gen_004",
    file: "employee_data.csv",
    synth: "synth_employee_data_2000.csv",
    rows: 2000,
    cols: 10,
    score: 88.5,
    ks: 0.071,
    meanDev: "0.52%",
    varRatio: 0.941,
    corrPct: 92.3,
    model: "Random Forest",
    status: "complete",
    duration: "9s",
    date: "2025-06-09",
    time: "10:22",
    size: "0.4 MB",
    driveLink: "#",
  },
  {
    id: "gen_005",
    file: "sensor_readings.csv",
    synth: "synth_sensor_readings_25000.csv",
    rows: 25000,
    cols: 6,
    score: 97.3,
    ks: 0.018,
    meanDev: "0.06%",
    varRatio: 0.997,
    corrPct: 99.1,
    model: "Random Forest",
    status: "complete",
    duration: "44s",
    date: "2025-06-08",
    time: "09:55",
    size: "4.2 MB",
    driveLink: "#",
  },
  {
    id: "gen_006",
    file: "ecommerce_orders.csv",
    synth: "synth_ecommerce_orders_1000.csv",
    rows: 1000,
    cols: 9,
    score: 90.4,
    ks: 0.058,
    meanDev: "0.44%",
    varRatio: 0.957,
    corrPct: 93.8,
    model: "Random Forest",
    status: "complete",
    duration: "6s",
    date: "2025-06-07",
    time: "16:41",
    size: "0.2 MB",
    driveLink: "#",
  },
  {
    id: "gen_007",
    file: "clinical_trials.csv",
    synth: "synth_clinical_trials_8000.csv",
    rows: 8000,
    cols: 20,
    score: 93.7,
    ks: 0.037,
    meanDev: "0.22%",
    varRatio: 0.976,
    corrPct: 96.5,
    model: "Random Forest",
    status: "complete",
    duration: "35s",
    date: "2025-06-06",
    time: "13:10",
    size: "1.9 MB",
    driveLink: "#",
  },
  {
    id: "gen_008",
    file: "supply_chain.csv",
    synth: "—",
    rows: 15000,
    cols: 11,
    score: null,
    ks: null,
    meanDev: null,
    varRatio: null,
    corrPct: null,
    model: "Random Forest",
    status: "failed",
    duration: "—",
    date: "2025-06-05",
    time: "08:30",
    size: "—",
    driveLink: null,
  },
  {
    id: "gen_009",
    file: "insurance_claims.csv",
    synth: "synth_insurance_claims_30000.csv",
    rows: 30000,
    cols: 14,
    score: 89.2,
    ks: 0.064,
    meanDev: "0.48%",
    varRatio: 0.951,
    corrPct: 91.7,
    model: "Random Forest",
    status: "complete",
    duration: "58s",
    date: "2025-06-04",
    time: "15:22",
    size: "5.7 MB",
    driveLink: "#",
  },
  {
    id: "gen_010",
    file: "retail_transactions.csv",
    synth: "synth_retail_transactions_100000.csv",
    rows: 100000,
    cols: 7,
    score: 92.6,
    ks: 0.041,
    meanDev: "0.27%",
    varRatio: 0.969,
    corrPct: 94.9,
    model: "Random Forest",
    status: "complete",
    duration: "3m 41s",
    date: "2025-06-03",
    time: "11:05",
    size: "18.3 MB",
    driveLink: "#",
  },
  {
    id: "gen_011",
    file: "hr_performance.csv",
    synth: "synth_hr_performance_3000.csv",
    rows: 3000,
    cols: 13,
    score: 95.8,
    ks: 0.025,
    meanDev: "0.11%",
    varRatio: 0.989,
    corrPct: 97.9,
    model: "Random Forest",
    status: "complete",
    duration: "12s",
    date: "2025-06-02",
    time: "09:18",
    size: "0.6 MB",
    driveLink: "#",
  },
  {
    id: "gen_012",
    file: "fraud_detection.csv",
    synth: "synth_fraud_detection_20000.csv",
    rows: 20000,
    cols: 16,
    score: 91.1,
    ks: 0.051,
    meanDev: "0.39%",
    varRatio: 0.958,
    corrPct: 93.4,
    model: "Random Forest",
    status: "complete",
    duration: "38s",
    date: "2025-06-01",
    time: "14:44",
    size: "3.8 MB",
    driveLink: "#",
  },
];

const FILTER_OPTIONS = ["All", "Complete", "Failed"];

// ─── Summary stat cards ────────────────────────────────────────────────────────
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
      value: String(jobs.filter((j) => j.date.startsWith("2025-06")).length),
      sub: "generations in June",
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
      {cards.map((c, i) => (
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
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                backgroundColor: "rgba(255,255,255,0.025)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted-foreground)",
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
      ))}
    </div>
  );
};

// ─── Score bar ─────────────────────────────────────────────────────────────────
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

// ─── Status badge ──────────────────────────────────────────────────────────────
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
        border: "1px solid var(--border)",
        fontSize: "11px",
        fontWeight: 500,
        color: ok ? "var(--foreground)" : "var(--muted-foreground)",
      }}
    >
      <div
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: ok ? "var(--foreground)" : "var(--muted-foreground)",
          opacity: ok ? 1 : 0.5,
        }}
      />
      {ok ? "Complete" : "Failed"}
    </div>
  );
};

// ─── Detail Drawer ─────────────────────────────────────────────────────────────
const DetailDrawer = ({ job, onClose, onRegenerate }) => {
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
      {/* Drawer header */}
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
              {/* Big score */}
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
              {/* Progress arc approximated as stacked bar */}
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
              gap: "0",
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

      {/* Pinned footer actions */}
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
              {/* Active indicator */}
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
              {/* Date */}
              <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                <div>
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
                </div>
              </td>
              {/* File */}
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
              {/* Rows */}
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
              {/* Cols */}
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
              {/* Score */}
              <td style={{ padding: "12px 16px" }}>
                <ScoreBar score={job.score} />
              </td>
              {/* Status */}
              <td style={{ padding: "12px 16px" }}>
                <StatusBadge status={job.status} />
              </td>
              {/* Duration */}
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
  const [selected, setSelected] = useState(null); // full job object
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let list = ALL_JOBS;

    // Status filter
    if (filter === "Complete")
      list = list.filter((j) => j.status === "complete");
    if (filter === "Failed") list = list.filter((j) => j.status === "failed");

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (j) =>
          j.file.toLowerCase().includes(q) || j.id.toLowerCase().includes(q),
      );
    }

    // Sort
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
  }, [search, filter, sortKey, sortDir]);

  // Keep selected in sync when filters change
  const selectedJob = selected
    ? (ALL_JOBS.find((j) => j.id === selected.id) ?? null)
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <style>{STYLES}</style>

      {/* ── Page header ── */}
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

      {/* ── Summary cards ── */}
      <SummaryCards jobs={ALL_JOBS} />

      {/* ── Table + Drawer container ── */}
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
        {/* Left: table */}
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
            {/* Search */}
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

            {/* Filter chips */}
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

            {/* Count */}
            <span
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
                marginLeft: "auto",
                flexShrink: 0,
              }}
            >
              {filtered.length} of {ALL_JOBS.length}
            </span>
          </div>

          {/* The table */}
          <HistoryTable
            jobs={filtered}
            selectedId={selectedJob?.id ?? null}
            onSelect={setSelected}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />
        </div>

        {/* Right: detail drawer (conditional) */}
        {selectedJob && (
          <DetailDrawer
            job={selectedJob}
            onClose={() => setSelected(null)}
            onRegenerate={() => {}}
          />
        )}
      </div>
    </div>
  );
}
