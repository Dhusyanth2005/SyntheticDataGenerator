import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import Hero from "../../components/Hero";
import Features from "../../components/Features";
import Testimonials from "../../components/Testimonials";
import CTA from "../../components/Cta";

/* ─── Global base styles injected once ───────────────────────────────────────
   Uses only shadcn/ui CSS variable font stack — no external font imports.
   shadcn sets --font-sans and --font-mono via its own base layer.
   We also apply a clean scroll-smooth and box-sizing reset.
─────────────────────────────────────────────────────────────────────────────── */
const BASE_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body, #root {
    font-family: var(--font-sans, ui-sans-serif, system-ui, sans-serif);
    background: #08080e;
    color: #eeeef6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }

  /* Thin scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #08080e; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
`;

export default function Home() {
  return (
    <>
      <style>{BASE_STYLES}</style>

      <Navbar />

      <main>
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
