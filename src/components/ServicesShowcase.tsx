import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";

const SERVICES = [
  {
    tag: "ROAD / CHAUFFEUR",
    title: "Personal Driver",
    body: "Dedicated chauffeur for city transfers, airport runs, and multi-day executive journeys.",
    slug: "personal-driver",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
  },
  {
    tag: "ROAD / TAXI",
    title: "Cab Booking",
    body: "On-demand city cabs with fixed fares, no surge pricing, and professional drivers.",
    slug: "cab-booking",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
  },
  {
    tag: "ROAD / SHARED",
    title: "Auto Rickshaw",
    body: "Quick, affordable auto rides for short city hops — book in advance or on demand.",
    slug: "auto",
    image: "https://images.unsplash.com/photo-1570125903912-83c5b2d1d629?w=800&q=80",
  },
  {
    tag: "ROAD / ECO",
    title: "Bike Pooling",
    body: "Beat the traffic with two-wheeler pooling — fast, affordable, and environmentally conscious.",
    slug: "bike-pooling",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    tag: "STAYS / ACCOMMODATION",
    title: "Hotels",
    body: "Handpicked stays from heritage havelis to contemporary city hotels across India and Asia.",
    slug: "hotels",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
  {
    tag: "AIR / PRIVATE",
    title: "Flight Booking",
    body: "Business and first-class ticketing with full concierge support and lounge access.",
    slug: "flights",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  },
  {
    tag: "ROAD / OUTSTATION",
    title: "Outstation Taxi",
    body: "Comfortable one-way and round-trip intercity travel with experienced long-distance drivers.",
    slug: "outstation",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  },
] as const;

const CARD_WIDTH = 400;
const CARD_GAP = 32;
const CARD_HEIGHT = 520;
const SIDEBAR_WIDTH = 320;

/**
 * Horizontally-scrolling services showcase section.
 * Pins for 800vh of scroll with slow cinematic crawl.
 */
export function ServicesShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Scroll-intent guard
    let isScrolling = false;
    let scrollTimer: number;

    const handleScrollIntent = () => {
      isScrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => { isScrolling = false; }, 150);
    };

    // Easing functions
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const easeOutQuart = (t: number) => {
      return 1 - Math.pow(1 - t, 4);
    };

    const phaseP = (g: number, start: number, end: number) => {
      return Math.max(0, Math.min(1, (g - start) / (end - start)));
    };

    const updateServices = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      
      const g = Math.max(0, Math.min(1, -rect.top / scrollable));

      const track = document.getElementById('services-track');
      const cards = document.querySelectorAll('.service-card');
      const sidebar = document.getElementById('services-sidebar');
      const progressBar = document.getElementById('services-progress');
      const eyebrow = document.getElementById('services-eyebrow');
      const heading = document.getElementById('services-heading');

      if (!track || !sidebar || !progressBar || !eyebrow || !heading) return;

      // Phase 1: sidebar reveal
      const p1eye = easeOutQuart(phaseP(g, 0.112, 0.158));
      const p1head = easeOutQuart(phaseP(g, 0.155, 0.215));
      
      eyebrow.style.opacity = String(p1eye);
      eyebrow.style.transform = `translateY(${(1 - p1eye) * 16}px)`;
      heading.style.opacity = String(p1head);
      heading.style.transform = `translateY(${(1 - p1head) * 24}px)`;

      // Phase 2 & 3: track movement
      const availableWidth = window.innerWidth - SIDEBAR_WIDTH;
      const totalTrackWidth = (CARD_WIDTH * SERVICES.length) + (CARD_GAP * (SERVICES.length - 1));
      const maxTranslate = -(totalTrackWidth - availableWidth);
      
      let trackX;
      if (g < 0.40) {
        // Phase 2: slide first card in from right
        const slideIn = easeOutQuart(phaseP(g, 0.276, 0.374));
        trackX = availableWidth * (1 - slideIn);
      } else if (g < 0.80) {
        // Phase 3: slow crawl
        const p3raw = phaseP(g, 0.470, 0.730);
        const p3eased = easeInOutCubic(p3raw);
        trackX = maxTranslate * p3eased * 0.85;
      } else {
        // Phase 4: hold at final position
        trackX = maxTranslate * easeInOutCubic(1.0) * 0.85;
      }
      
      track.style.transform = `translateX(${trackX}px)`;

      // Progress bar (Phase 3 only)
      const progressWidth = phaseP(g, 0.470, 0.730) * 100;
      progressBar.style.width = `${progressWidth}%`;
      progressBar.style.opacity = String(
        easeOutQuart(phaseP(g, 0.112, 0.158)) * (1 - easeOutQuart(phaseP(g, 0.912, 0.988)))
      );

      // Active card highlight
      cards.forEach((card) => {
        const htmlCard = card as HTMLElement;
        const cardRect = htmlCard.getBoundingClientRect();
        const cardCentre = cardRect.left + cardRect.width / 2;
        const viewCentre = window.innerWidth / 2;
        const dist = Math.abs(cardCentre - viewCentre);
        const isActive = dist < 240;
        
        htmlCard.classList.toggle('is-active', isActive);
      });

      // Phase 5: exit fade
      const p5 = easeOutQuart(phaseP(g, 0.912, 0.988));
      const exitO = 1 - p5;
      track.style.opacity = String(exitO);
      sidebar.style.opacity = String(exitO);
      sidebar.style.transform = `translateY(${p5 * -24}px)`;

      // Performance: will-change management
      if (g < 0.95) {
        track.style.willChange = 'transform';
        cards.forEach((card) => {
          (card as HTMLElement).style.willChange = 'transform';
        });
      } else {
        track.style.willChange = 'auto';
        cards.forEach((card) => {
          (card as HTMLElement).style.willChange = 'auto';
        });
      }
    };

    // Add scroll-intent guard to cards
    const addClickGuards = () => {
      const allCards = document.querySelectorAll('.service-card');
      allCards.forEach((card) => {
        const htmlCard = card as HTMLElement;
        htmlCard.addEventListener('click', (e) => {
          if (isScrolling) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      });
    };

    window.addEventListener('scroll', updateServices, { passive: true });
    window.addEventListener('scroll', handleScrollIntent, { passive: true });
    window.addEventListener('resize', updateServices);
    updateServices();

    // Add click guards after cards are rendered
    setTimeout(addClickGuards, 100);

    return () => {
      window.removeEventListener('scroll', updateServices);
      window.removeEventListener('scroll', handleScrollIntent);
      window.removeEventListener('resize', updateServices);
      clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        position: "relative",
        height: "800vh",
        background: "#000000",
      }}
    >
      {/* Progress bar */}
      <div
        id="services-progress"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "0%",
          height: "1px",
          background: "#f9c518",
          zIndex: 100,
        }}
      />

      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Left sidebar */}
        <div
          id="services-sidebar"
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: `${SIDEBAR_WIDTH}px`,
            paddingLeft: "64px",
            zIndex: 10,
            opacity: 0,
          }}
        >
          {/* Eyebrow */}
          <p
            id="services-eyebrow"
            style={{
              fontFamily: '"Neue Montreal", system-ui, sans-serif',
              fontSize: "14px",
              fontWeight: 400,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#999999",
              margin: "0 0 24px",
              opacity: 0,
            }}
          >
            WHAT WE DO
          </p>

          {/* Heading */}
          <h2
            id="services-heading"
            style={{
              fontFamily: '"Neue Montreal", system-ui, sans-serif',
              fontSize: "48px",
              fontWeight: 600,
              lineHeight: "52.8px",
              letterSpacing: "-0.5px",
              color: "#f5f5f5",
              margin: 0,
              opacity: 0,
            }}
          >
            Our Services
          </h2>
        </div>

        {/* Card track */}
        <div
          id="services-track"
          style={{
            position: "absolute",
            left: `${SIDEBAR_WIDTH + 80}px`,
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            gap: `${CARD_GAP}px`,
            willChange: "transform",
          }}
        >
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              to={`/services/${service.slug}`}
              className="service-card"
              style={{
                display: "flex",
                flexDirection: "column",
                width: `${CARD_WIDTH}px`,
                minWidth: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#0a0a0a",
                flexShrink: 0,
                textDecoration: "none",
                cursor: "pointer",
                transition: "transform 500ms cubic-bezier(0.16,1,0.3,1), border-color 500ms ease",
                willChange: "transform",
              }}
            >
              {/* Photo block: fixed height */}
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  flexShrink: 0,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={service.image}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
                {/* Bottom fade from photo into card body */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "80px",
                    background: "linear-gradient(to bottom, transparent, #0a0a0a)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Text block: fills remaining height */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px 24px 28px 24px",
                  background: "#0a0a0a",
                  minHeight: 0,
                }}
              >
                {/* Category tag */}
                <p
                  style={{
                    fontFamily: '"Neue Montreal", system-ui, sans-serif',
                    fontSize: "11px",
                    fontWeight: 400,
                    letterSpacing: "0.2em",
                    color: "#999999",
                    textTransform: "uppercase",
                    margin: "0 0 8px 0",
                    flexShrink: 0,
                  }}
                >
                  {service.tag}
                </p>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: '"Neue Montreal", system-ui, sans-serif',
                    fontSize: "22px",
                    fontWeight: 500,
                    lineHeight: 1.2,
                    color: "#f5f5f5",
                    margin: "0 0 8px 0",
                    flexShrink: 0,
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: '"Neue Montreal", system-ui, sans-serif',
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "20px",
                    color: "#999999",
                    margin: 0,
                    flex: 1,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {service.body}
                </p>

                {/* Explore link */}
                <div
                  style={{
                    fontFamily: '"Neue Montreal", system-ui, sans-serif',
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#f9c518",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "16px",
                    flexShrink: 0,
                    transition: "gap 250ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.gap = "10px";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.gap = "6px";
                  }}
                >
                  Explore <span style={{ fontSize: "16px", lineHeight: 1 }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
