import { useEffect, useState } from "react";
import Aurora from "../components/ui/Aurora";

function useCountUp(target, duration = 1400, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(target * ease));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return val;
}

const ArrowRight = () => (
  <svg
    width="14"
    height="14"
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

const STATS = [
  { value: 1200000, suffix: "rows", label: "Generated" },
  { value: 93, suffix: "%", label: "Avg similarity" },
  { value: 48, suffix: "+", label: "Datasets" },
];

export default function Hero() {
  const counts = [
    useCountUp(1200000, 1600, 600),
    useCountUp(93, 1200, 750),
    useCountUp(48, 1000, 900),
  ];

  const fmt = (v, i) => {
    if (i === 0)
      return v >= 1000000
        ? `${(v / 1000000).toFixed(1)}M`
        : v >= 1000
          ? `${(v / 1000).toFixed(0)}K`
          : v;
    return v;
  };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#08080e",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Aurora layer — top portion */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Aurora
          colorStops={["#3fbcf8", "#465bb5", "#eb567b"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.9}
        />
      </div>

      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.028) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.028) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial fade — aurora visible at top, content readable below */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 85% 52% at 50% 0%, transparent 10%, #08080e 72%)",
        }}
      />

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 160,
          zIndex: 3,
          pointerEvents: "none",
          background: "linear-gradient(to bottom, transparent, #08080e)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "140px 24px 80px",
          gap: 0,
        }}
      >
        {/* Pill badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px 5px 10px",
            borderRadius: 99,
            border: "1px solid rgba(63,188,248,0.22)",
            background: "rgba(63,188,248,0.07)",
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(63,188,248,0.9)",
            letterSpacing: "0.04em",
            marginBottom: 32,
            animation: "heroFadeDown .5s ease-out .1s both",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#3fbcf8",
              flexShrink: 0,
              display: "inline-block",
              animation: "heroDot 2s ease-in-out infinite",
            }}
          />
          Privacy-safe · KS-validated · Random Forest
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(36px, 6.5vw, 80px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#eeeef6",
            maxWidth: 820,
            margin: 0,
            animation: "heroFadeUp .6s ease-out .2s both",
          }}
        >
          Generate synthetic data
          <br />
          <span
            style={{
              background:
                "linear-gradient(100deg, #3fbcf8 0%, #465bb5 50%, #eb567b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            that looks statistically real.
          </span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: "clamp(15px, 1.8vw, 18px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.42)",
            maxWidth: 480,
            lineHeight: 1.7,
            margin: "22px 0 40px",
            animation: "heroFadeUp .6s ease-out .35s both",
          }}
        >
          Upload a CSV. Our AI learns its patterns and generates thousands of
          privacy-safe synthetic rows in seconds.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "heroFadeUp .6s ease-out .48s both",
          }}
        >
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: 9,
              background: "#3fbcf8",
              color: "#08080e",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "0.01em",
              transition: "opacity .15s, transform .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = ".85";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Start for free <ArrowRight />
          </a>
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "12px 22px",
              borderRadius: 9,
              background: "transparent",
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              transition: "background .15s, color .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              e.currentTarget.style.color = "rgba(255,255,255,.85)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255,255,255,.5)";
            }}
          >
            See how it works <ArrowRight />
          </a>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 0,
            marginTop: 72,
            width: "100%",
            maxWidth: 560,
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            overflow: "hidden",
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(16px)",
            animation: "heroFadeUp .6s ease-out .62s both",
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                padding: "20px 0",
                borderRight:
                  i < STATS.length - 1
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#eeeef6",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {fmt(counts[i], i)}
                <span style={{ color: "#3fbcf8" }}>
                  {s.suffix !== "rows" ? s.suffix : ""}
                </span>
                {s.suffix === "rows" && (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.35)",
                      marginLeft: 4,
                    }}
                  >
                    rows
                  </span>
                )}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes heroFadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroFadeDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroDot      { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }
      `}</style>
    </section>
  );
}
