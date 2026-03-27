const features = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    color: "#3fbcf8",
    title: "Upload any CSV",
    desc: "Drop in any CSV file. Synth AI automatically infers column types, distributions, and inter-feature correlations.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />
      </svg>
    ),
    color: "#465bb5",
    title: "Random Forest model",
    desc: "A 100-estimator ensemble learns the joint distribution of your data. No deep learning, no cloud GPUs needed.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    color: "#eb567b",
    title: "Privacy guaranteed",
    desc: "Zero real data rows appear in the output. Differential privacy techniques ensure no individual is re-identifiable.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
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
    ),
    color: "#3fbcf8",
    title: "Statistical validation",
    desc: "Every generation is validated using KS-tests, mean deviation, variance ratios, and correlation preservation checks.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
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
    ),
    color: "#465bb5",
    title: "Up to 100K rows",
    desc: "Generate from 100 to 100,000 rows per job. Large datasets finish in under two minutes on average.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
    color: "#eb567b",
    title: "Cloud storage",
    desc: "Outputs are saved directly to Google Drive. Download anytime, share with your team, or chain into pipelines.",
  },
];

export default function Features() {
  return (
    <section
      style={{
        background: "#08080e",
        padding: "100px 24px",
        position: "relative",
      }}
    >
      {/* Subtle separator line at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: 60,
          background:
            "linear-gradient(to bottom, rgba(63,188,248,0.4), transparent)",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#3fbcf8",
              marginBottom: 12,
            }}
          >
            Features
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "#eeeef6",
              margin: "0 auto",
              maxWidth: 540,
              lineHeight: 1.1,
            }}
          >
            Everything you need to synthesize data
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.4)",
              marginTop: 16,
              maxWidth: 420,
              margin: "16px auto 0",
              lineHeight: 1.65,
            }}
          >
            From upload to validated CSV — the full pipeline in one tool.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 1,
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(255,255,255,0.07)",
          }}
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              style={{
                background: "#08080e",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                transition: "background 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#0d0d18")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#08080e")
              }
            >
              {/* Icon badge */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${f.color}14`,
                  border: `1px solid ${f.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: f.color,
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>

              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#eeeef6",
                    margin: "0 0 8px 0",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.42)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
