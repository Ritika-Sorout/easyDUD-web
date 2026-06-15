import { useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, Youtube } from "lucide-react";

const QUICK_LINKS = [
  { label: "Destinations", to: "/services" },
  { label: "Experiences", to: "/services" },
  { label: "Trip Planning", to: "/services" },
  { label: "Group Travel", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.05 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="footer-section"
      style={{
        background: "var(--color-dark-navy)",
        padding: "var(--space-4xl) var(--space-2xl)",
        color: "var(--color-pure-white)",
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--space-2xl)",
        }}
      >
        {/* Column 1 — Brand */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono-medium)",
              fontWeight: 500,
              fontSize: "24px",
              color: "var(--color-pure-white)",
              letterSpacing: "0.2em",
            }}
          >
            EASYDUD
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body)",
              opacity: 0.5,
              marginTop: "var(--space-md)",
            }}
          >
            Crafting journeys across India.
          </p>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-semibold)",
              fontWeight: 600,
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "var(--ls-eyebrow)",
              opacity: 0.4,
              marginBottom: "var(--space-sm)",
            }}
          >
            EXPLORE
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
            }}
          >
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-body)",
                  color: "var(--color-pure-white)",
                  opacity: 0.7,
                  textDecoration: "none",
                  transition: "opacity var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.7";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3 — Contact + Social */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-semibold)",
              fontWeight: 600,
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "var(--ls-eyebrow)",
              opacity: 0.4,
              marginBottom: "var(--space-sm)",
            }}
          >
            CONNECT
          </p>
          <a
            href="mailto:hello@dudtravel.com"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body)",
              color: "var(--color-browser-link-blue)",
              textDecoration: "none",
              display: "block",
              marginBottom: "var(--space-md)",
            }}
          >
            hello@dudtravel.com
          </a>
          <div
            style={{
              display: "flex",
              gap: "var(--space-sm)",
            }}
          >
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{
                color: "var(--color-pure-white)",
                transition: "opacity var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              style={{
                color: "var(--color-pure-white)",
                transition: "opacity var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          marginTop: "var(--space-xl)",
          paddingTop: "var(--space-xl)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-coordinate)",
            letterSpacing: "var(--ls-coordinate)",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          © 2025 easyDUD. All rights reserved.
        </p>
      </div>

      <style>{`
        .footer-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .footer-section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .footer-section > div:first-of-type {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
