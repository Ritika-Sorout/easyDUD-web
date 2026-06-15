import { useEffect, useRef, useState } from "react";
import { Mail, Phone, Instagram } from "lucide-react";

/**
 * Contact Us section with two-column grid layout and entrance animation.
 */
export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        position: "relative",
        padding: "120px 40px",
        background: "#18181a",
        clipPath: "inset(0 0 100% 0)",
        transition: "clip-path 480ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
        }}
      >
        {/* Left column */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(-60px)",
            transition: "opacity 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            transitionDelay: "0ms",
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#999999",
              margin: "0 0 24px",
            }}
          >
            GET IN TOUCH
          </p>

          {/* Heading */}
          <h2
            style={{
              fontFamily: '"Neue Montreal", system-ui, sans-serif',
              fontSize: "72px",
              fontWeight: 600,
              lineHeight: "79.2px",
              letterSpacing: "-1px",
              color: "#f5f5f5",
              margin: "0 0 48px",
            }}
          >
            Plan your next journey.
          </h2>

          {/* Contact info rows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* Email */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <Mail size={20} color="#f9c518" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <p
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#999999",
                    margin: "0 0 4px",
                  }}
                >
                  Email
                </p>
                <p
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "#f5f5f5",
                    margin: 0,
                  }}
                >
                  hello@dudtravel.com
                </p>
              </div>
            </div>

            {/* Phone */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <Phone size={20} color="#f9c518" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <p
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#999999",
                    margin: "0 0 4px",
                  }}
                >
                  Phone
                </p>
                <p
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "#f5f5f5",
                    margin: 0,
                  }}
                >
                  +91 98765 43210
                </p>
              </div>
            </div>

            {/* Instagram */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <Instagram size={20} color="#f9c518" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <p
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#999999",
                    margin: "0 0 4px",
                  }}
                >
                  Instagram
                </p>
                <p
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "#f5f5f5",
                    margin: 0,
                  }}
                >
                  @easydud
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - form */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(60px)",
            transition: "opacity 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            transitionDelay: "150ms",
          }}
        >
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Your Name */}
            <div>
              <label
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#999999",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Your Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  color: "#f5f5f5",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#f9c518";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              />
            </div>

            {/* Email Address */}
            <div>
              <label
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#999999",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  color: "#f5f5f5",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#f9c518";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              />
            </div>

            {/* Two-column row: Departure City | Destination */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#999999",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Departure City
                </label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    color: "#f5f5f5",
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "16px",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#f9c518";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#999999",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="Jaipur"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    color: "#f5f5f5",
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "16px",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#f9c518";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
              </div>
            </div>

            {/* Travel Dates */}
            <div>
              <label
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#999999",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Travel Dates
              </label>
              <input
                type="text"
                placeholder="Select date range"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  color: "#f5f5f5",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#f9c518";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              />
            </div>

            {/* Tell us about your journey */}
            <div>
              <label
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#999999",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Tell us about your journey
              </label>
              <textarea
                placeholder="Share your travel plans, preferences, and any special requests..."
                rows={4}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  color: "#f5f5f5",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "16px",
                  outline: "none",
                  resize: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#f9c518";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#f9c518",
                color: "#000000",
                fontFamily: "system-ui, sans-serif",
                fontSize: "15px",
                fontWeight: 500,
                borderRadius: "100px",
                padding: "16px 40px",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e0b010";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f9c518";
              }}
            >
              Send Enquiry →
            </button>

            {/* Below button text */}
            <p
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#999999",
                margin: "0",
                textAlign: "center",
              }}
            >
              We respond within 24 hours. No spam, ever.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
