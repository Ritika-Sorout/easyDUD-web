import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

const NAV_LINKS = [
  { label: "Destinations", to: "/services" as any },
  { label: "Experiences", to: "/services" as any },
  { label: "Plan a Trip", to: "/contact" },
  { label: "About Us", to: "/about" },
  { label: "Pricing", to: "/#pricing" as any },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close overlay on escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOverlayOpen(false);
    };
    if (overlayOpen) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [overlayOpen]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          padding: "0 var(--space-2xl)",
          height: "70px",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          transition: "background 0.3s ease, backdrop-filter 0.3s ease",
        }}
      >
        {/* Left: Hamburger button */}
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOverlayOpen(true)}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "var(--radius-pill)",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              width: "18px",
              height: "2px",
              background: "var(--color-pure-white)",
              borderRadius: "1px",
            }}
          />
          <span
            style={{
              width: "18px",
              height: "2px",
              background: "var(--color-pure-white)",
              borderRadius: "1px",
            }}
          />
          <span
            style={{
              width: "18px",
              height: "2px",
              background: "var(--color-pure-white)",
              borderRadius: "1px",
            }}
          />
        </button>

        {/* Center: Brand wordmark */}
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-nav)",
            color: "var(--color-pure-white)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          EASYDUD
        </div>

        {/* Right: CTA button */}
        <Link
          to="/contact"
          style={{
            background: "var(--color-pure-white)",
            color: "var(--color-pure-black)",
            borderRadius: "var(--radius-pill)",
            padding: "13px 30px",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            border: "none",
            textDecoration: "none",
            cursor: "pointer",
            transition: "background var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.85)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-pure-white)";
          }}
        >
          Plan a Trip
        </Link>
      </nav>

      {/* Full-screen overlay */}
      {overlayOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "var(--color-pure-black)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            animation: "overlayEnter 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOverlayOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-pill)",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "var(--color-pure-white)",
              fontSize: "24px",
            }}
          >
            ✕
          </button>

          {/* Nav links */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-xl)",
              alignItems: "center",
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOverlayOpen(false)}
                style={{
                  fontFamily: "var(--font-semibold)",
                  fontSize: "32px",
                  color: "var(--color-pure-white)",
                  textDecoration: "none",
                  transition: "opacity var(--transition-fast), transform var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.6";
                  e.currentTarget.style.transform = "translateX(8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes overlayEnter {
          from {
            opacity: 0;
            clip-path: circle(0% at top left);
          }
          to {
            opacity: 1;
            clip-path: circle(150% at top left);
          }
        }
      `}</style>
    </>
  );
}
