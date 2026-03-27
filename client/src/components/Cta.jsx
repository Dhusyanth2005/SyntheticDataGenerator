import Aurora from "../components/ui/Aurora";

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

export default function CTA() {
  return (
    <section style={{ background: "#08080e", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#0d0d1a",
            padding: "80px 40px",
            textAlign: "center",
          }}
        >
          {/* Aurora background inside the CTA card */}
          <div
            style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.55 }}
          >
            <Aurora
              colorStops={["#3fbcf8", "#465bb5", "#eb567b"]}
              blend={0.6}
              amplitude={0.75}
              speed={0.6}
            />
          </div>

          {/* Radial mask to darken center so text is readable */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 80% 60% at 50% 110%, transparent 0%, #0d0d1a 65%)",
            }}
          />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#3fbcf8",
                marginBottom: 16,
              }}
            >
              Get started today
            </p>

            <h2
              style={{
                fontSize: "clamp(28px, 4.5vw, 52px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#eeeef6",
                margin: "0 auto 20px",
                maxWidth: 620,
                lineHeight: 1.1,
              }}
            >
              Your data stays private.
              <br />
              Your models stay smart.
            </h2>

            <p
              style={{
                fontSize: "clamp(14px, 1.6vw, 17px)",
                color: "rgba(255,255,255,0.45)",
                maxWidth: 440,
                margin: "0 auto 40px",
                lineHeight: 1.7,
              }}
            >
              Start generating synthetic datasets for free. No credit card
              required. 100% privacy-safe from your first upload.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <a
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 30px",
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
                Generate for free <ArrowRight />
              </a>

              <a
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "13px 24px",
                  borderRadius: 9,
                  background: "transparent",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.14)",
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
                Read the docs <ArrowRight />
              </a>
            </div>

            {/* Trust line */}
            <p
              style={{
                marginTop: 28,
                fontSize: 12,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.04em",
              }}
            >
              No credit card · GDPR compliant · Open API
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
