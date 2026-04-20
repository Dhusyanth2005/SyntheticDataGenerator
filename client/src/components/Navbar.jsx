import { useState, useEffect } from "react";
import synthLogo from "../assets/SynthAI_Logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Features", "How it works", "Pricing", "Docs"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        background: scrolled ? "rgba(8,8,14,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.07)" : "transparent"}`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <img
            src={synthLogo}
            alt="SynthAI logo"
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              objectFit: "contain",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#f0f0f6",
              letterSpacing: "-0.01em",
            }}
          >
            Synth<span style={{ color: "#3fbcf8" }}>AI</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul
          style={{
            display: "flex",
            gap: 32,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="nav-desktop-links"
        >
          {links.map((l) => (
            <li key={l}>
              <a
                href="#"
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.9)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.5)")
                }
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href="/login"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.55)",
              textDecoration: "none",
              padding: "6px 14px",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.color = "rgba(255,255,255,0.9)")
            }
            onMouseLeave={(e) =>
              (e.target.style.color = "rgba(255,255,255,0.55)")
            }
          >
            Sign in
          </a>

          <a
            href="#"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#08080e",
              background: "#3fbcf8",
              padding: "8px 20px",
              borderRadius: 8,
              textDecoration: "none",
              transition: "opacity 0.15s",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Get started
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .nav-desktop-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}