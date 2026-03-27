const testimonials = [
  {
    quote:
      "We replaced three months of manual data anonymisation with Synth AI. Our ML pipeline went from blocked to shipping in a week.",
    name: "Priya Nair",
    role: "ML Engineer",
    company: "Finova Labs",
    avatar: "PN",
    color: "#3fbcf8",
  },
  {
    quote:
      "The statistical fidelity is genuinely impressive. KS scores above 95% on every dataset we've tried. This is the real deal.",
    name: "Marcus Webb",
    role: "Data Scientist",
    company: "ClearMetrics",
    avatar: "MW",
    color: "#465bb5",
  },
  {
    quote:
      "We had GDPR compliance blocking our testing environments for months. Synth AI solved it in an afternoon.",
    name: "Léa Fontaine",
    role: "Head of Engineering",
    company: "Medtrack EU",
    avatar: "LF",
    color: "#eb567b",
  },
  {
    quote:
      "I was skeptical that generated data could be usable for model training. After seeing 94% similarity scores I was completely won over.",
    name: "Daniel Osei",
    role: "Research Engineer",
    company: "Anthrope AI",
    avatar: "DO",
    color: "#3fbcf8",
  },
  {
    quote:
      "The custom filename and Google Drive integration means synthetic datasets slot into our existing workflows without any extra steps.",
    name: "Yuki Tanaka",
    role: "Analytics Lead",
    company: "Shopstream",
    avatar: "YT",
    color: "#465bb5",
  },
  {
    quote:
      "100K rows in under two minutes. Our data augmentation bottleneck is gone. Synth AI is now a core part of our CI pipeline.",
    name: "Abi Okonkwo",
    role: "Backend Engineer",
    company: "Stackbase",
    avatar: "AO",
    color: "#eb567b",
  },
];

function Stars() {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="#f5c842"
          stroke="none"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      style={{
        background: "#0a0a12",
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle bg dot pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#eb567b",
              marginBottom: 12,
            }}
          >
            Testimonials
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "#eeeef6",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Loved by data teams
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.4)",
              marginTop: 16,
              maxWidth: 380,
              margin: "16px auto 0",
              lineHeight: 1.65,
            }}
          >
            From research labs to production pipelines.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                padding: "28px 24px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.025)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${t.color}35`;
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "rgba(255,255,255,0.025)";
              }}
            >
              <Stars />

              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.7,
                  margin: 0,
                  flex: 1,
                }}
              >
                "{t.quote}"
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: `${t.color}20`,
                    border: `1px solid ${t.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: t.color,
                    letterSpacing: "0.02em",
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#eeeef6",
                      margin: 0,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.38)",
                      margin: 0,
                    }}
                  >
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
