import { useState, useRef, useCallback, useEffect } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const icon =
  (d, size = 14, extra = {}) =>
  () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={extra.sw ?? "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {typeof d === "string" ? <path d={d} /> : d}
    </svg>
  );

const PlusIcon = icon(
  [
    <line key="a" x1="12" y1="5" x2="12" y2="19" />,
    <line key="b" x1="5" y1="12" x2="19" y2="12" />,
  ],
  13,
  { sw: "2.5" },
);
const XIcon = icon(
  [
    <line key="a" x1="18" y1="6" x2="6" y2="18" />,
    <line key="b" x1="6" y1="6" x2="18" y2="18" />,
  ],
  13,
  { sw: "2.5" },
);
const CheckIcon = icon(<polyline points="20 6 9 17 4 12" />, 18);
const DownloadIcon = icon(
  [
    <path key="a" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />,
    <polyline key="b" points="7 10 12 15 17 10" />,
    <line key="c" x1="12" y1="15" x2="12" y2="3" />,
  ],
  14,
  { sw: "2.5" },
);
const ArrowRightIcon = icon(
  [
    <line key="a" x1="5" y1="12" x2="19" y2="12" />,
    <polyline key="b" points="12 5 19 12 12 19" />,
  ],
  14,
  { sw: "2.5" },
);
const ArrowLeftIcon = icon(
  [
    <line key="a" x1="19" y1="12" x2="5" y2="12" />,
    <polyline key="b" points="12 19 5 12 12 5" />,
  ],
  14,
  { sw: "2.5" },
);
const SparkleIcon = icon([
  <path key="a" d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />,
  <path
    key="b"
    d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z"
  />,
  <path key="c" d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5z" />,
]);
const GridIcon = icon(
  [
    <rect key="a" x="3" y="3" width="7" height="7" rx="1" />,
    <rect key="b" x="14" y="3" width="7" height="7" rx="1" />,
    <rect key="c" x="3" y="14" width="7" height="7" rx="1" />,
    <rect key="d" x="14" y="14" width="7" height="7" rx="1" />,
  ],
  13,
);
const ClockIcon = icon(
  [
    <circle key="a" cx="12" cy="12" r="10" />,
    <polyline key="b" points="12 6 12 12 16 14" />,
  ],
  13,
);
const EyeIcon = icon(
  [
    <path key="a" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />,
    <circle key="b" cx="12" cy="12" r="3" />,
  ],
  13,
);
const RefreshIcon = icon(
  [
    <polyline key="a" points="23 4 23 10 17 10" />,
    <path key="b" d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />,
  ],
  13,
);
const TrashIcon = icon(
  [
    <polyline key="a" points="3 6 5 6 21 6" />,
    <path key="b" d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />,
    <path key="c" d="M10 11v6" />,
    <path key="d" d="M14 11v6" />,
    <path key="e" d="M9 6V4h6v2" />,
  ],
  13,
);

const UploadCloudIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const FileCSVIcon = () => (
  <svg
    width="18"
    height="18"
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes fadeSlideIn { from{opacity:0;transform:translateY(10px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(255,255,255,0.25)} 70%{box-shadow:0 0 0 8px rgba(255,255,255,0)} 100%{box-shadow:0 0 0 0 rgba(255,255,255,0)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes countUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .gen-btn:hover{opacity:0.88} .ghost-btn:hover{background:rgba(255,255,255,0.05)!important}
  .chip:hover{border-color:var(--foreground)!important;color:var(--foreground)!important}
`;

// ─── Shared helpers ───────────────────────────────────────────────────────────
const Divider = () => (
  <div
    style={{ height: "1px", backgroundColor: "var(--border)", margin: "4px 0" }}
  />
);

const Btn = ({
  primary,
  onClick,
  disabled,
  style,
  children,
  className = "gen-btn",
}) => (
  <button
    className={className}
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: "11px 16px",
      borderRadius: "9px",
      fontSize: "14px",
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.15s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      backgroundColor: primary
        ? disabled
          ? "transparent"
          : "var(--foreground)"
        : "transparent",
      color: primary
        ? disabled
          ? "var(--muted-foreground)"
          : "var(--background)"
        : "var(--muted-foreground)",
      border: `1px solid ${primary ? (disabled ? "var(--border)" : "var(--foreground)") : "var(--border)"}`,
      ...style,
    }}
  >
    {children}
  </button>
);

const IconBox = ({ size = 32, radius = 7, children }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      flexShrink: 0,
      backgroundColor: "var(--foreground)",
      color: "var(--background)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ dataset, onConfirm, onCancel }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "360px",
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        animation: "fadeSlideIn 0.18s ease-out",
      }}
    >
      {/* icon badge — red, consistent with color rule */}
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
        <TrashIcon />
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
          Delete dataset?
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
            {dataset.fileName}
          </span>{" "}
          will be permanently removed. This cannot be undone.
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

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepIndicator = ({ current }) => (
  <div
    style={{ display: "flex", alignItems: "flex-start", marginBottom: "32px" }}
  >
    {["Upload", "Configure", "Processing", "Results"].map((step, i, arr) => {
      const done = i < current,
        active = i === current;
      return (
        <div
          key={step}
          style={{
            display: "flex",
            alignItems: "flex-start",
            flex: i < arr.length - 1 ? 1 : "none",
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
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                backgroundColor:
                  done || active ? "var(--foreground)" : "transparent",
                border: `1.5px solid ${done || active ? "var(--foreground)" : "var(--border)"}`,
                color:
                  done || active
                    ? "var(--background)"
                    : "var(--muted-foreground)",
                transition: "all 0.25s",
                animation: active
                  ? "pulse-ring 1.8s ease-out infinite"
                  : "none",
              }}
            >
              {done ? (
                <CheckIcon />
              ) : (
                <span style={{ fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
              )}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 700 : 400,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: active
                  ? "var(--foreground)"
                  : done
                    ? "var(--muted-foreground)"
                    : "var(--border)",
                whiteSpace: "nowrap",
                transition: "color 0.2s",
              }}
            >
              {step}
            </span>
          </div>
          {i < arr.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 1,
                margin: "15px 6px 0",
                transition: "background 0.3s",
                background: done
                  ? "var(--foreground)"
                  : `linear-gradient(to right,${active ? "var(--foreground)" : "var(--border)"},var(--border))`,
              }}
            />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Step 1 — Upload ──────────────────────────────────────────────────────────
const StepUpload = ({ file, setFile, onNext }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const accept = (f) => f?.name.endsWith(".csv") && setFile(f);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files[0]);
        }}
        onClick={() => !file && inputRef.current?.click()}
        style={{
          border: `1.5px dashed ${dragging || file ? "var(--foreground)" : "var(--border)"}`,
          borderRadius: 12,
          padding: file ? "24px" : "48px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          cursor: file ? "default" : "pointer",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          backgroundColor: dragging
            ? "rgba(255,255,255,0.025)"
            : file
              ? "rgba(255,255,255,0.02)"
              : "transparent",
          transition: "all 0.2s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={(e) => accept(e.target.files[0])}
        />
        {!file &&
          [
            ["8px", "auto", "8px", "auto"],
            ["8px", "auto", "auto", "8px"],
            ["auto", "8px", "8px", "auto"],
            ["auto", "8px", "auto", "8px"],
          ].map(([top, bottom, right, left], idx) => (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: top !== "auto" ? 8 : undefined,
                bottom: bottom !== "auto" ? 8 : undefined,
                right: right !== "auto" ? 8 : undefined,
                left: left !== "auto" ? 8 : undefined,
                width: 12,
                height: 12,
                opacity: 0.3,
                borderTop:
                  top !== "auto" ? "1px solid var(--foreground)" : undefined,
                borderBottom:
                  bottom !== "auto" ? "1px solid var(--foreground)" : undefined,
                borderRight:
                  right !== "auto" ? "1px solid var(--foreground)" : undefined,
                borderLeft:
                  left !== "auto" ? "1px solid var(--foreground)" : undefined,
              }}
            />
          ))}
        {file ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              width: "100%",
            }}
          >
            <IconBox size={44} radius={10}>
              <FileCSVIcon />
            </IconBox>
            <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--foreground)",
                  margin: "0 0 2px 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                  margin: 0,
                }}
              >
                CSV · {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: 5,
                cursor: "pointer",
                color: "var(--muted-foreground)",
                lineHeight: 0,
                flexShrink: 0,
              }}
            >
              <XIcon />
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 14,
                border: "1px solid var(--border)",
                backgroundColor: "rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted-foreground)",
              }}
            >
              <UploadCloudIcon />
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--foreground)",
                  margin: "0 0 5px 0",
                }}
              >
                Drop your CSV file here
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--muted-foreground)",
                  margin: "0 0 10px 0",
                  lineHeight: 1.6,
                }}
              >
                or click to browse your files
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 10px",
                  borderRadius: 99,
                  border: "1px solid var(--border)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Only{" "}
                  <strong style={{ color: "var(--foreground)" }}>csv</strong>{" "}
                  files accepted
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      <Btn primary disabled={!file} onClick={onNext} style={{ width: "100%" }}>
        Continue to Configure {file && <ArrowRightIcon />}
      </Btn>
    </div>
  );
};

// ─── Step 2 — Configure ───────────────────────────────────────────────────────
const PRESETS = [
  { label: "1K", sub: "1,000 rows", value: 1000 },
  { label: "5K", sub: "5,000 rows", value: 5000 },
  { label: "10K", sub: "10,000 rows", value: 10000 },
  { label: "50K", sub: "50,000 rows", value: 50000 },
];

const StepConfigure = ({
  file,
  rows,
  setRows,
  outputName,
  setOutputName,
  onBack,
  onGenerate,
}) => {
  const [custom, setCustom] = useState(false);
  const [inputVal, setInputVal] = useState(String(rows));
  const defaultNameSuggestion = file
    ? `synthetic_${file.name.replace(/\.csv$/i, "")}_${rows}`
    : "synthetic_dataset";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
      >
        <IconBox size={32}>
          <FileCSVIcon />
        </IconBox>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--foreground)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {file?.name ?? "dataset.csv"}
          </p>
          <p
            style={{
              fontSize: 11,
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Ready to process
          </p>
        </div>
        <div
          style={{
            padding: "2px 8px",
            borderRadius: 99,
            border: "1px solid var(--border)",
            fontSize: 11,
            color: "var(--muted-foreground)",
            flexShrink: 0,
          }}
        >
          {(file?.size / 1024).toFixed(1)} KB
        </div>
      </div>

      <Divider />

      <div>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--muted-foreground)",
            margin: "0 0 8px 0",
          }}
        >
          Output filename
        </p>
        <div
          style={{
            display: "flex",
            border: "1px solid var(--foreground)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <input
            type="text"
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
            placeholder={defaultNameSuggestion}
            style={{
              flex: 1,
              padding: "10px 14px",
              fontSize: 15,
              fontWeight: 500,
              color: "var(--foreground)",
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              caretColor: "var(--foreground)",
            }}
          />
          <span
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              fontSize: 13,
              color: "var(--muted-foreground)",
              borderLeft: "1px solid var(--border)",
              backgroundColor: "rgba(255,255,255,0.03)",
            }}
          >
            .csv
          </span>
        </div>
        <p
          style={{
            fontSize: 11,
            color: "var(--muted-foreground)",
            margin: "6px 0 0 0",
          }}
        >
          Will be saved as:{" "}
          <strong>{outputName || defaultNameSuggestion}.csv</strong>
        </p>
      </div>

      <Divider />

      <div>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--muted-foreground)",
            margin: "0 0 12px 0",
          }}
        >
          Synthetic rows to generate
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 8,
            marginBottom: 12,
          }}
        >
          {PRESETS.map((p) => {
            const active = rows === p.value && !custom;
            return (
              <button
                key={p.value}
                className="chip"
                onClick={() => {
                  setRows(p.value);
                  setCustom(false);
                  setInputVal(String(p.value));
                }}
                style={{
                  padding: "10px 6px",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  backgroundColor: active ? "var(--foreground)" : "transparent",
                  color: active
                    ? "var(--background)"
                    : "var(--muted-foreground)",
                  border: `1px solid ${active ? "var(--foreground)" : "var(--border)"}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span
                  style={{ fontWeight: 700, fontSize: 15, color: "inherit" }}
                >
                  {p.label}
                </span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>{p.sub}</span>
              </button>
            );
          })}
        </div>
        {!custom ? (
          <button
            className="ghost-btn"
            onClick={() => setCustom(true)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 8,
              border: "1px dashed var(--border)",
              background: "transparent",
              fontSize: 13,
              color: "var(--muted-foreground)",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            Enter custom row count…
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              border: "1px solid var(--foreground)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <input
              autoFocus
              type="number"
              min={100}
              max={100000}
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                const v = Math.max(
                  100,
                  Math.min(100000, Number(e.target.value) || 100),
                );
                if (!isNaN(v)) setRows(v);
              }}
              style={{
                flex: 1,
                padding: "10px 14px",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--foreground)",
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                caretColor: "var(--foreground)",
              }}
              placeholder="e.g. 25000"
            />
            <span
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                fontSize: 12,
                color: "var(--muted-foreground)",
                borderLeft: "1px solid var(--border)",
              }}
            >
              rows
            </span>
          </div>
        )}
        <p
          style={{
            fontSize: 11,
            color: "var(--muted-foreground)",
            margin: "8px 0 0 0",
          }}
        >
          Range: 100 – 100,000 rows
        </p>
      </div>

      <Divider />

      <div
        style={{
          padding: "14px 16px",
          borderRadius: 9,
          border: "1px solid var(--border)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
        }}
      >
        {[
          { icon: <GridIcon />, label: "Rows", value: rows.toLocaleString() },
          { icon: <SparkleIcon />, label: "Model", value: "Random Forest" },
          {
            icon: <ClockIcon />,
            label: "Est. time",
            value: rows > 20000 ? "~2 min" : "~30 sec",
          },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "var(--muted-foreground)",
              }}
            >
              {icon}
              <span
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {label}
              </span>
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Btn className="ghost-btn" onClick={onBack} style={{ flexShrink: 0 }}>
          <ArrowLeftIcon /> Back
        </Btn>
        <Btn primary onClick={onGenerate} style={{ flex: 1 }}>
          <SparkleIcon /> Generate {rows.toLocaleString()} Rows
        </Btn>
      </div>
    </div>
  );
};

// ─── Step 3 — Processing ──────────────────────────────────────────────────────
const STAGES = [
  { label: "Parsing CSV structure", detail: "Reading columns and data types" },
  {
    label: "Analysing feature correlations",
    detail: "Computing Pearson & Spearman matrices",
  },
  {
    label: "Training Random Forest model",
    detail: "Fitting 100-estimator ensemble",
  },
  {
    label: "Generating synthetic rows",
    detail: "Sampling from learned distributions",
  },
  {
    label: "Running statistical validation",
    detail: "KS-test · mean · variance checks",
  },
  { label: "Preparing final file", detail: "Saving with chosen name" },
];

const StepProcessing = ({ rows, onDone }) => {
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let prog = 0,
      stage = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 3.5 + 1;
      const ns = Math.min(
        Math.floor(prog / (100 / STAGES.length)),
        STAGES.length - 1,
      );
      if (ns !== stage) {
        stage = ns;
        setStageIdx(ns);
      }
      if (prog >= 100) {
        clearInterval(iv);
        setProgress(100);
        setTimeout(
          () => onDone(parseFloat((88 + Math.random() * 9).toFixed(1))),
          700,
        );
        return;
      }
      setProgress(Math.min(prog, 100));
    }, 150);
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      clearInterval(iv);
      clearInterval(timer);
    };
  }, [onDone]);

  const pct = Math.round(progress);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
      >
        {[
          { label: "Progress", value: `${pct}%` },
          { label: "Rows", value: rows.toLocaleString() },
          { label: "Elapsed", value: `${elapsed}s` },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "var(--muted-foreground)",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "var(--foreground)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          height: 4,
          borderRadius: 99,
          backgroundColor: "var(--border)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 99,
            backgroundImage:
              "linear-gradient(90deg,transparent -20%,rgba(255,255,255,0.15) 50%,transparent 120%)",
            backgroundSize: "400px 100%",
            animation: progress < 100 ? "shimmer 1.4s linear infinite" : "none",
          }}
        />
        <div
          style={{
            height: "100%",
            borderRadius: 99,
            backgroundColor: "var(--foreground)",
            width: `${progress}%`,
            transition: "width 0.18s ease-out",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {STAGES.map((s, i) => {
          const done = i < stageIdx,
            active = i === stageIdx;
          return (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "9px 12px",
                borderRadius: 8,
                backgroundColor: active
                  ? "rgba(255,255,255,0.04)"
                  : "transparent",
                border: `1px solid ${active ? "var(--border)" : "transparent"}`,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: active
                      ? "var(--foreground)"
                      : done
                        ? "var(--muted-foreground)"
                        : undefined,
                    border:
                      !active && !done ? "1px solid var(--border)" : undefined,
                    opacity: done ? 0.4 : 1,
                    animation: active
                      ? "pulse-ring 1.5s ease-out infinite"
                      : "none",
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    margin: 0,
                    transition: "all 0.2s",
                    color: active
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                    textDecoration: done ? "line-through" : "none",
                  }}
                >
                  {s.label}
                </p>
                {active && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--muted-foreground)",
                      margin: "1px 0 0 0",
                      animation: "fadeSlideIn 0.2s ease-out",
                    }}
                  >
                    {s.detail}
                  </p>
                )}
              </div>
              {active && (
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--muted-foreground)",
                    flexShrink: 0,
                    animation: "blink 1.2s ease-in-out infinite",
                  }}
                >
                  running
                </span>
              )}
              {done && (
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--muted-foreground)",
                    flexShrink: 0,
                    opacity: 0.5,
                  }}
                >
                  done
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Step 4 — Results ─────────────────────────────────────────────────────────
const StepResults = ({ file, rows, outputName, score: scoreProp }) => {
  const [score] = useState(
    () => scoreProp ?? (88 + Math.random() * 9).toFixed(1),
  );
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const finalFileName =
    outputName ||
    `synthetic_${file?.name?.replace(/\.csv$/i, "") || "dataset"}_${rows}`;
  const metrics = [
    { label: "KS Statistic", value: (0.03 + Math.random() * 0.04).toFixed(3) },
    {
      label: "Mean Deviation",
      value: `${(0.1 + Math.random() * 0.4).toFixed(2)}%`,
    },
    {
      label: "Variance Ratio",
      value: (0.97 + Math.random() * 0.04).toFixed(3),
    },
    {
      label: "Corr. Preserved",
      value: `${(96 + Math.random() * 3).toFixed(1)}%`,
    },
  ];
  const details = [
    { label: "Original file", value: file?.name ?? "dataset.csv" },
    { label: "Output filename", value: `${finalFileName}.csv` },
    { label: "Rows generated", value: rows.toLocaleString() },
    { label: "Model", value: "Random Forest Regression" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        animation: visible ? "fadeSlideIn 0.3s ease-out" : "none",
      }}
    >
      <div
        style={{
          padding: "16px 18px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "rgba(255,255,255,0.01)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              "linear-gradient(var(--foreground) 1px,transparent 1px),linear-gradient(90deg,var(--foreground) 1px,transparent 1px)",
            backgroundSize: "24px 24px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            flexShrink: 0,
            border: "1.5px solid var(--foreground)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--foreground)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <CheckIcon />
        </div>
        <div style={{ flex: 1, position: "relative", zIndex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--foreground)",
              margin: "0 0 2px 0",
            }}
          >
            Generation complete
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            {rows.toLocaleString()} rows · saved as{" "}
            <strong>{finalFileName}.csv</strong>
          </p>
        </div>
        <div
          style={{
            padding: "8px 16px",
            flexShrink: 0,
            border: "1px solid var(--border)",
            borderRadius: 9,
            backgroundColor: "var(--background)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "var(--foreground)",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              animation: "countUp 0.4s ease-out",
            }}
          >
            {score}%
          </span>
          <span
            style={{
              fontSize: 9,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginTop: 2,
            }}
          >
            Similarity
          </span>
        </div>
      </div>

      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--muted-foreground)",
            margin: "0 0 8px 0",
          }}
        >
          Statistical Validation
        </p>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}
        >
          {metrics.map(({ label, value }) => (
            <div
              key={label}
              style={{
                padding: "9px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                backgroundColor: "rgba(255,255,255,0.01)",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  color: "var(--muted-foreground)",
                  margin: "0 0 2px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--foreground)",
                  margin: 0,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          borderRadius: 9,
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {details.map((d, i) => (
          <div
            key={d.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "9px 14px",
              borderBottom:
                i < details.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
              {d.label}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--foreground)",
                maxWidth: "60%",
                textAlign: "right",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const TITLES = [
  "Upload Dataset",
  "Configure Generation",
  "Processing",
  "Complete",
];

const Modal = ({ onClose, onComplete, seed }) => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState(seed?.rows ?? 5000);
  const [outputName, setOutputName] = useState(seed?.outputName || "");
  const [resultScore, setResultScore] = useState(null);

  const finalFileName =
    outputName.trim() ||
    (file
      ? `synthetic_${file.name.replace(/\.csv$/i, "")}_${rows}`
      : `synthetic_dataset_${rows}`);

  return (
    <div
      onClick={step !== 2 ? onClose : undefined}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 500,
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.04) inset",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          animation: "fadeSlideIn 0.22s ease-out",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 24px 0",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "var(--foreground)",
                margin: "0 0 2px 0",
              }}
            >
              {TITLES[step]}
            </h2>
            <p
              style={{
                fontSize: 12,
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              New Synthetic Dataset
            </p>
          </div>
          {step !== 2 && (
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 7,
                padding: 6,
                cursor: "pointer",
                color: "var(--muted-foreground)",
                lineHeight: 0,
              }}
            >
              <XIcon />
            </button>
          )}
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            scrollbarWidth: "none",
            padding: "20px 24px",
            maskImage:
              step === 3
                ? "linear-gradient(to bottom,black calc(100% - 24px),transparent 100%)"
                : "none",
            WebkitMaskImage:
              step === 3
                ? "linear-gradient(to bottom,black calc(100% - 24px),transparent 100%)"
                : "none",
          }}
        >
          <StepIndicator current={step} />
          {step === 0 && (
            <StepUpload
              file={file}
              setFile={setFile}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepConfigure
              file={file}
              rows={rows}
              setRows={setRows}
              outputName={outputName}
              setOutputName={setOutputName}
              onBack={() => setStep(0)}
              onGenerate={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepProcessing
              rows={rows}
              onDone={(score) => {
                setResultScore(score);
                setStep(3);
              }}
            />
          )}
          {step === 3 && (
            <StepResults
              file={file}
              rows={rows}
              outputName={outputName}
              score={resultScore}
            />
          )}
        </div>

        {step === 3 && (
          <div
            style={{
              display: "flex",
              gap: 10,
              padding: "14px 24px 20px",
              borderTop: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              borderRadius: "0 0 16px 16px",
              flexShrink: 0,
            }}
          >
            <Btn
              className="ghost-btn"
              onClick={() => {
                setStep(0);
                setFile(null);
                setRows(5000);
                setOutputName("");
              }}
            >
              New generation
            </Btn>
            <Btn
              primary
              onClick={() =>
                file &&
                onComplete?.({
                  fileName: finalFileName + ".csv",
                  originalFile: file.name,
                  rows,
                  score: resultScore,
                })
              }
              style={{ flex: 1 }}
            >
              <DownloadIcon /> Download &amp; Save
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CSV Viewer ───────────────────────────────────────────────────────────────
const CSVViewer = ({ dataset, onClose }) => {
  const lines = (dataset.csvPreview || "").trim().split("\n");
  const headers = lines[0] ? lines[0].split(",") : [];
  const rowsData = lines.slice(1).map((l) => l.split(","));

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        backgroundColor: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 860,
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.04) inset",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "fadeSlideIn 0.22s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconBox size={36} radius={8}>
              <FileCSVIcon />
            </IconBox>
            <div>
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: "0 0 2px 0",
                }}
              >
                {dataset.fileName}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                  margin: 0,
                }}
              >
                {dataset.rows.toLocaleString()} rows · {headers.length} columns
                · preview showing first 20 rows
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                padding: "4px 12px",
                borderRadius: 99,
                border: "1px solid var(--border)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              {dataset.score}% similarity
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 7,
                padding: 6,
                cursor: "pointer",
                color: "var(--muted-foreground)",
                lineHeight: 0,
              }}
            >
              <XIcon />
            </button>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border) transparent",
          }}
        >
          {headers.length > 0 ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 500,
              }}
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "var(--card)",
                  zIndex: 1,
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "var(--muted-foreground)",
                      borderBottom: "1px solid var(--border)",
                      width: 48,
                    }}
                  >
                    #
                  </th>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        color: "var(--muted-foreground)",
                        borderBottom: "1px solid var(--border)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowsData.map((row, ri) => (
                  <tr
                    key={ri}
                    style={{ borderBottom: "1px solid var(--border)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255,255,255,0.025)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "9px 16px",
                        fontSize: 12,
                        color: "var(--muted-foreground)",
                        fontVariantNumeric: "tabular-nums",
                        opacity: 0.5,
                      }}
                    >
                      {ri + 1}
                    </td>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        style={{
                          padding: "9px 16px",
                          fontSize: 13,
                          color: "var(--foreground)",
                          fontVariantNumeric: "tabular-nums",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
              }}
            >
              <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
                No preview available
              </p>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            borderTop: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Showing preview · full file available via download
          </p>
          <Btn
            primary
            style={{ padding: "8px 16px", fontSize: 13, borderRadius: 8 }}
          >
            <DownloadIcon /> Download CSV
          </Btn>
        </div>
      </div>
    </div>
  );
};

// ─── Dataset Row ──────────────────────────────────────────────────────────────
const DatasetRow = ({ dataset, index, onView, onRegenerate, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid var(--border)",
        backgroundColor: hovered ? "rgba(255,255,255,0.025)" : "transparent",
        transition: "background-color 0.12s",
      }}
    >
      <td style={{ padding: "13px 16px", width: 44 }}>
        <span
          style={{
            fontSize: 12,
            color: "var(--muted-foreground)",
            fontVariantNumeric: "tabular-nums",
            opacity: 0.5,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <IconBox>
            <FileCSVIcon />
          </IconBox>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--foreground)",
                margin: "0 0 1px 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 240,
              }}
            >
              {dataset.fileName}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              from {dataset.originalFile}
            </p>
          </div>
        </div>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <span
          style={{
            fontSize: 13,
            color: "var(--foreground)",
            fontVariantNumeric: "tabular-nums",
            fontWeight: 500,
          }}
        >
          {dataset.rows.toLocaleString()}
        </span>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 48,
              height: 4,
              borderRadius: 99,
              backgroundColor: "var(--border)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: `${dataset.score}%`,
                height: "100%",
                borderRadius: 99,
                backgroundColor: "var(--foreground)",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--foreground)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {dataset.score}%
          </span>
        </div>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
          {dataset.createdAt}
        </span>
      </td>
      {/* ── Actions (visible on hover) ── */}
      <td style={{ padding: "13px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        >
          <button
            onClick={() => onView(dataset)}
            className="ghost-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 6,
              background: "transparent",
              border: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--foreground)",
              cursor: "pointer",
              transition: "background 0.12s",
              whiteSpace: "nowrap",
            }}
          >
            <EyeIcon /> View CSV
          </button>
          <button
            onClick={() => onRegenerate(dataset)}
            className="ghost-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 6,
              background: "transparent",
              border: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--muted-foreground)",
              cursor: "pointer",
              transition: "background 0.12s",
              whiteSpace: "nowrap",
            }}
          >
            <RefreshIcon /> Generate Again
          </button>
          {/* ← Delete button */}
          <button
            onClick={() => onDelete(dataset)}
            className="ghost-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 6,
              background: "transparent",
              border: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--muted-foreground)",
              cursor: "pointer",
              transition: "background 0.12s",
              whiteSpace: "nowrap",
            }}
          >
            <TrashIcon /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── Fake CSV preview generator ───────────────────────────────────────────────
const makeFakeCSV = (rows) => {
  const headers = [
    "age",
    "income",
    "credit_score",
    "num_accounts",
    "loan_amount",
  ];
  const lines = [headers.join(",")];
  for (let i = 0; i < Math.min(rows, 20); i++)
    lines.push(
      [
        Math.floor(22 + Math.random() * 50),
        Math.floor(30000 + Math.random() * 120000),
        Math.floor(580 + Math.random() * 270),
        Math.floor(1 + Math.random() * 8),
        Math.floor(5000 + Math.random() * 95000),
      ].join(","),
    );
  return lines.join("\n");
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Generate() {
  const [modalOpen, setModalOpen] = useState(false);
  const [viewerDataset, setViewerDataset] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [regenSeed, setRegenSeed] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // dataset to delete

  const handleComplete = useCallback(
    ({ fileName, originalFile, rows, score }) => {
      setDatasets((prev) => [
        {
          id: Date.now(),
          fileName,
          originalFile,
          rows,
          score,
          createdAt: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          csvPreview: makeFakeCSV(rows),
        },
        ...prev,
      ]);
      setModalOpen(false);
    },
    [],
  );

  const handleRegenerate = useCallback((dataset) => {
    setRegenSeed({
      rows: dataset.rows,
      outputName: dataset.fileName.replace(/\.csv$/, ""),
    });
    setModalOpen(true);
  }, []);

  const handleDelete = () => {
    setDatasets((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const openNew = () => {
    setRegenSeed(null);
    setModalOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{STYLES}</style>

      {/* Header */}
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
              fontSize: 22,
              fontWeight: 700,
              color: "var(--foreground)",
              margin: "0 0 4px 0",
            }}
          >
            Generate
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Create privacy-safe synthetic datasets from your real data.
          </p>
        </div>
        <Btn
          primary
          onClick={openNew}
          style={{
            padding: "9px 16px",
            fontSize: 14,
            borderRadius: 8,
            flexShrink: 0,
          }}
        >
          <PlusIcon /> New Synth
        </Btn>
      </div>

      {/* Empty state */}
      {datasets.length === 0 && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            textAlign: "center",
            padding: "72px 24px",
            border: "1px dashed var(--border)",
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.01)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.025,
              backgroundImage:
                "linear-gradient(var(--foreground) 1px,transparent 1px),linear-gradient(90deg,var(--foreground) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                border: "1px solid var(--border)",
                backgroundColor: "rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted-foreground)",
              }}
            >
              <UploadCloudIcon />
            </div>
            <div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: "0 0 6px 0",
                }}
              >
                No datasets generated yet
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--muted-foreground)",
                  margin: "0 0 18px 0",
                  maxWidth: 320,
                  lineHeight: 1.6,
                }}
              >
                Upload a CSV and generate a statistically similar synthetic
                dataset — with custom filename.
              </p>
              <Btn
                primary
                onClick={openNew}
                style={{
                  display: "inline-flex",
                  padding: "9px 18px",
                  fontSize: 14,
                  borderRadius: 8,
                }}
              >
                <PlusIcon /> New Synth
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* Dataset table */}
      {datasets.length > 0 && (
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
            animation: "fadeSlideIn 0.25s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderBottom: "1px solid var(--border)",
              backgroundColor: "rgba(255,255,255,0.01)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--foreground)",
                }}
              >
                Generated Datasets
              </span>
              <span
                style={{
                  padding: "1px 8px",
                  borderRadius: 99,
                  border: "1px solid var(--border)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--muted-foreground)",
                }}
              >
                {datasets.length}
              </span>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              Hover a row to see actions
            </p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["", "File", "Rows", "Similarity", "Created", ""].map(
                    (h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "9px 16px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "var(--muted-foreground)",
                          backgroundColor: "rgba(255,255,255,0.01)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {datasets.map((ds, i) => (
                  <DatasetRow
                    key={ds.id}
                    dataset={ds}
                    index={i}
                    onView={setViewerDataset}
                    onRegenerate={handleRegenerate}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {modalOpen && (
        <Modal
          onClose={() => {
            setModalOpen(false);
            setRegenSeed(null);
          }}
          onComplete={handleComplete}
          seed={regenSeed}
        />
      )}
      {viewerDataset && (
        <CSVViewer
          dataset={viewerDataset}
          onClose={() => setViewerDataset(null)}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          dataset={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
