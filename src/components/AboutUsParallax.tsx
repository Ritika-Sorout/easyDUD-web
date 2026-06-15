import { useEffect, useRef } from "react";

const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80";

/**
 * About Us parallax scroll section with sticky pin + scrub animation.
 * 
 * Pins for 600vh scroll distance with corrected scroll progress calculation.
 */
export function AboutUsParallax() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Easing function
    const easeOutQuart = (t: number) => {
      return 1 - Math.pow(1 - t, 4);
    };

    // Phase progress calculation
    const phaseP = (global: number, start: number, end: number) => {
      return easeOutQuart(Math.max(0, Math.min(1, (global - start) / (end - start))));
    };

    // Linear interpolation
    const lerp = (a: number, b: number, t: number) => {
      return a + (b - a) * t;
    };

    const updateAbout = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      
      const g = Math.max(0, Math.min(1, -rect.top / scrollable));

      const eyebrow = document.getElementById('about-eyebrow');
      const heading = document.getElementById('about-heading');
      const body = document.getElementById('about-body');
      const cards = document.querySelectorAll('.about-card');
      const bgImg = document.getElementById('about-bg-image');
      const bgOver = document.getElementById('about-bg-overlay');
      const closing = document.getElementById('about-closing');

      if (!eyebrow || !heading || !body || !bgImg || !bgOver || !closing) return;

      // PHASE 1 — eyebrow + heading (0.10 → 0.30)
      const p1eye = phaseP(g, 0.121, 0.209);
      eyebrow.style.opacity = String(p1eye);
      eyebrow.style.transform = `translateY(${lerp(20, 0, p1eye)}px)`;

      const p1head = phaseP(g, 0.183, 0.277);
      heading.style.opacity = String(p1head);
      heading.style.transform = `translateY(${lerp(32, 0, p1head)}px)`;

      // PHASE 2 — body paragraph (0.30 → 0.45)
      const p2 = phaseP(g, 0.321, 0.399);
      body.style.opacity = String(p2);
      body.style.transform = `translateY(${lerp(24, 0, p2)}px)`;

      // PHASE 3 — cards staggered in (0.45 → 0.65)
      const cardOffsets = [0.00, 0.15, 0.30];
      cards.forEach((card, i) => {
        const htmlCard = card as HTMLElement;
        const start = 0.45 + cardOffsets[i] * (0.20);
        const end = start + 0.15;
        const p = phaseP(g, start, end);

        // Exit: cards fan out (0.75 → 0.90)
        const exitStarts = [0.75, 0.78, 0.80];
        const exitEnds = [0.88, 0.90, 0.92];
        const exitP = phaseP(g, exitStarts[i], exitEnds[i]);
        const exitX = [lerp(0, -60, exitP), lerp(0, 0, exitP), lerp(0, 60, exitP)][i];
        const exitY = [0, lerp(0, 32, exitP), 0][i];
        const exitO = lerp(1, 0, exitP);

        if (g < 0.75) {
          htmlCard.style.opacity = String(p);
          htmlCard.style.transform = `translateY(${lerp(48, 0, p)}px)`;
        } else {
          htmlCard.style.opacity = String(Math.min(p, exitO));
          htmlCard.style.transform = `translateX(${exitX}px) translateY(${exitY}px)`;
        }
      });

      // PHASE 5 — text block fades out (0.75 → 0.85)
      const p5text = phaseP(g, 0.768, 0.833);
      const textO = lerp(1, 0, p5text);
      const textY = lerp(0, -24, p5text);
      
      // Only fade heading/body out if they were visible
      if (g > 0.75) {
        eyebrow.style.opacity = String(textO);
        heading.style.opacity = String(textO);
        heading.style.transform = `translateY(${textY}px)`;
        body.style.opacity = String(textO);
        body.style.transform = `translateY(${textY}px)`;
      }

      // PHASE 5 — background image fades in (0.78 → 0.92)
      const p5bg = phaseP(g, 0.801, 0.899);
      bgImg.style.opacity = String(p5bg);
      bgOver.style.opacity = String(p5bg);

      // PHASE 5 — closing text appears (0.86 → 0.96)
      const p5close = phaseP(g, 0.878, 0.943);
      closing.style.opacity = String(p5close);
      closing.style.transform = `translateX(-50%) translateY(${lerp(20, 0, p5close)}px)`;
    };

    // Attach + run immediately
    window.addEventListener('scroll', updateAbout, { passive: true });
    window.addEventListener('resize', updateAbout);
    
    // Run immediately on mount
    updateAbout();

    return () => {
      window.removeEventListener('scroll', updateAbout);
      window.removeEventListener('resize', updateAbout);
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: "relative",
        height: "600vh",
        background: "#18181a",
      }}
    >
      <div
        id="about-sticky"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background image layer (hidden until Phase 5) */}
        <img
          id="about-bg-image"
          src={BACKGROUND_IMAGE}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0,
            zIndex: 0,
          }}
        />
        <div
          id="about-bg-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.65))",
            opacity: 0,
            zIndex: 1,
          }}
        />

        {/* Content layer */}
        <div
          id="about-content"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "760px",
            width: "100%",
            padding: "0 40px",
            textAlign: "left",
          }}
        >
          {/* Eyebrow */}
          <p
            id="about-eyebrow"
            style={{
              fontFamily: '"Neue Montreal", system-ui, sans-serif',
              fontSize: "14px",
              fontWeight: 400,
              letterSpacing: "0.25em",
              color: "#999999",
              margin: "0 0 24px 0",
              opacity: 0,
              transform: "translateY(20px)",
            }}
          >
            WHO WE ARE
          </p>

          {/* Heading */}
          <h2
            id="about-heading"
            style={{
              fontFamily: '"Neue Montreal", system-ui, sans-serif',
              fontSize: "72px",
              fontWeight: 600,
              lineHeight: "79.2px",
              letterSpacing: "-1px",
              color: "#f5f5f5",
              margin: "0 0 32px 0",
              opacity: 0,
              transform: "translateY(32px)",
            }}
          >
            We move people.<br />Not just luggage.
          </h2>

          {/* Body paragraph */}
          <p
            id="about-body"
            style={{
              fontFamily: '"Neue Montreal", system-ui, sans-serif',
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: "23.4px",
              color: "#999999",
              maxWidth: "520px",
              margin: 0,
              opacity: 0,
              transform: "translateY(24px)",
            }}
          >
            easyDUD is a premium travel concierge built for discerning travellers across India and Asia. We handle the complexity so every journey feels effortless.
          </p>

          {/* Stat cards row */}
          <div
            id="about-cards"
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "64px",
            }}
          >
            <div className="about-card" data-index="0" style={{
              flex: 1,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "40px 32px",
              opacity: 0,
              transform: "translateY(48px)",
            }}>
              <div style={{ fontFamily: '"Neue Montreal", system-ui, sans-serif', fontSize: "72px", fontWeight: 600, color: "#f9c518", lineHeight: 1 }}>12+</div>
              <div style={{ fontFamily: '"Neue Montreal", system-ui, sans-serif', fontSize: "14px", fontWeight: 400, color: "#999999", letterSpacing: "0.05em", marginTop: "12px" }}>Countries Covered</div>
            </div>

            <div className="about-card" data-index="1" style={{
              flex: 1,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "40px 32px",
              opacity: 0,
              transform: "translateY(48px)",
            }}>
              <div style={{ fontFamily: '"Neue Montreal", system-ui, sans-serif', fontSize: "72px", fontWeight: 600, color: "#f9c518", lineHeight: 1 }}>4800+</div>
              <div style={{ fontFamily: '"Neue Montreal", system-ui, sans-serif', fontSize: "14px", fontWeight: 400, color: "#999999", letterSpacing: "0.05em", marginTop: "12px" }}>Journeys Completed</div>
            </div>

            <div className="about-card" data-index="2" style={{
              flex: 1,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "40px 32px",
              opacity: 0,
              transform: "translateY(48px)",
            }}>
              <div style={{ fontFamily: '"Neue Montreal", system-ui, sans-serif', fontSize: "72px", fontWeight: 600, color: "#f9c518", lineHeight: 1 }}>98%</div>
              <div style={{ fontFamily: '"Neue Montreal", system-ui, sans-serif', fontSize: "14px", fontWeight: 400, color: "#999999", letterSpacing: "0.05em", marginTop: "12px" }}>Client Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Closing text (Phase 5 reveal, over background image) */}
        <div
          id="about-closing"
          style={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%) translateY(20px)",
            textAlign: "center",
            zIndex: 3,
            opacity: 0,
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ fontFamily: '"Neue Montreal", system-ui, sans-serif', fontSize: "36px", fontWeight: 500, color: "#f9c518", marginBottom: "12px" }}>Since 2019</div>
          <div style={{ fontFamily: '"Neue Montreal", system-ui, sans-serif', fontSize: "24px", fontWeight: 500, color: "#f5f5f5" }}>Built by travellers, for travellers.</div>
        </div>
      </div>
    </section>
  );
}
