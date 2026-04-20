const LINKS = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Developers: ["API Docs", "SDK", "GitHub", "Status"],
  Company: ["About", "Blog", "Careers", "Privacy"],
  Legal: ["Terms", "Privacy Policy", "Cookie Policy"],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#06060c",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "64px 24px 32px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr repeat(4, auto)",
            gap: 40,
            marginBottom: 56,
            alignItems: "start",
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: 240 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, #3fbcf8, #465bb5, #eb567b)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                S
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#eeeef6",
                  letterSpacing: "-0.01em",
                }}
              >
                Synth<span style={{ color: "#3fbcf8" }}>AI</span>
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.38)",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Privacy-safe synthetic data generation powered by statistical
              machine learning.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([col, items]) => (
            <div key={col}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: 16,
                  marginTop: 0,
                }}
              >
                {col}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.45)",
                        textDecoration: "none",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = "rgba(255,255,255,0.85)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = "rgba(255,255,255,0.45)")
                      }
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            marginBottom: 24,
          }}
        />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}
          >
            © {year} Synth AI. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#3fbcf8",
                animation: "footerDot 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.03em",
              }}
            >
              All systems operational
            </span>
          </div>
        </div>
      </div>
      <style>{`@keyframes footerDot{0%,100%{opacity:1}50%{opacity:.25}}`}</style>
    </footer>
  );
}
