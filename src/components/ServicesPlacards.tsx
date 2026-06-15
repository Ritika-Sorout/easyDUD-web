import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";

/**
 * Internal route paths (file-based TanStack routes). There is no dedicated
 * "/driver" page, so Personal Driver maps to the closest existing route
 * (/taxi — a hired car with driver).
 */
type RoutePath = "/taxi" | "/cab" | "/auto-ride" | "/bike" | "/bus" | "/flights" | "/hotels";

interface Service {
  name: string;
  tag: string;
  description: string;
  href: RoutePath;
  image: string;
}

const SERVICES: Service[] = [
  {
    name: "Personal Driver",
    tag: "ROAD / CHAUFFEUR",
    description: "Dedicated driver for city transfers and multi-day journeys.",
    href: "/taxi",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
  },
  {
    name: "Cab",
    tag: "ROAD / CAB",
    description: "Instant cab bookings across Indian cities, any time of day.",
    href: "/cab",
    image: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=800&q=80",
  },
  {
    name: "Auto Rickshaw",
    tag: "LOCAL / AUTO",
    description: "The iconic way to navigate India's streets, on demand.",
    href: "/auto-ride",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
  },
  {
    name: "Bike",
    tag: "SHARED / TWO-WHEELER",
    description: "Two-wheeler rides for fast, affordable last-mile travel.",
    href: "/bike",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    name: "Bus Travel",
    tag: "INTERCITY / BUS",
    description: "Sleeper, AC, and private coach bookings between cities.",
    href: "/bus",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
  },
  {
    name: "Flights",
    tag: "AIR / DOMESTIC",
    description: "Search and book domestic and international flights instantly.",
    href: "/flights",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  },
  {
    name: "Hotels",
    tag: "STAYS / ACCOMMODATION",
    description: "From budget stays to heritage palaces — curated for India.",
    href: "/hotels",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
];

/**
 * CAROUSEL GEOMETRY
 * The center card is index 0 relative to currentIndex.
 * Cards to the left/right get progressively smaller, darker, rotated.
 * We show 5 cards at once: -2, -1, 0, +1, +2
 */
function getCardStyle(offset: number): React.CSSProperties {
  const absOffset = Math.abs(offset);

  if (absOffset > 2) return { display: "none" };

  const config = {
    0: { translateX: 0, translateZ: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 10, brightness: 1 },
    1: { translateX: 52, translateZ: -120, scale: 0.82, rotateY: -18, opacity: 0.85, zIndex: 8, brightness: 0.7 },
    2: { translateX: 88, translateZ: -220, scale: 0.65, rotateY: -28, opacity: 0.55, zIndex: 6, brightness: 0.45 },
  };

  const c = config[absOffset as 0 | 1 | 2];
  const sign = offset < 0 ? -1 : 1;

  return {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    width: 320,
    height: 420,
    transform: `
      translate(-50%, -50%)
      translateX(${sign * c.translateX}%)
      translateZ(${c.translateZ}px)
      scale(${c.scale})
      rotateY(${sign * c.rotateY}deg)
    `,
    opacity: c.opacity,
    zIndex: c.zIndex,
    filter: `brightness(${c.brightness})`,
    transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
    cursor: "pointer",
    borderRadius: "var(--radius-pill)",
    overflow: "hidden",
    willChange: "transform, opacity",
    flexShrink: 0,
  };
}

export default function ServicesPlacards() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = SERVICES.length;

  const next = useCallback(() => setCurrent((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + count) % count), [count]);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(next, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, next]);

  // Preload images
  useEffect(() => {
    SERVICES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  // Click a flanking card → jump to it
  function handleCardClick(offset: number) {
    if (offset !== 0) {
      setCurrent((i) => (i + offset + count) % count);
    }
  }

  const activeService = SERVICES[current];

  return (
    <section
      id="placards"
      style={{
        background: "var(--color-pure-black)",
        padding: "var(--space-4xl) 0 var(--space-5xl)",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Section header */}
      <div
        style={{
          textAlign: "center",
          padding: "0 var(--space-2xl)",
          marginBottom: "var(--space-4xl)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-coordinate)",
            letterSpacing: "var(--ls-coordinate)",
            color: "var(--color-pure-white)",
            opacity: 0.4,
            textTransform: "uppercase",
            marginBottom: "var(--space-sm)",
          }}
        >
          WHAT WE DO
        </p>
        <h2
          style={{
            fontFamily: "var(--font-semibold)",
            fontWeight: 600,
            fontSize: "var(--text-display)",
            lineHeight: "var(--lh-display)",
            color: "var(--color-pure-white)",
          }}
        >
          Our Services
        </h2>
      </div>

      {/* 3D Carousel stage */}
      <div
        style={{
          position: "relative",
          height: 480,
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Render 5 visible cards: offsets -2, -1, 0, +1, +2 */}
        {[-2, -1, 0, 1, 2].map((offset) => {
          const index = (current + offset + count) % count;
          const service = SERVICES[index];
          const isCenter = offset === 0;

          const card = (
            <div
              key={`${index}-${offset}`}
              style={getCardStyle(offset)}
              onClick={() => handleCardClick(offset)}
            >
              {/* Photo background */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${service.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Gradient overlay — stronger at bottom */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0.92) 100%)",
                }}
              />

              {/* Card text content */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "var(--space-xl)",
                  color: "var(--color-pure-white)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-coordinate)",
                    letterSpacing: "var(--ls-coordinate)",
                    opacity: 0.5,
                    textTransform: "uppercase",
                    marginBottom: "var(--space-xs)",
                  }}
                >
                  {service.tag}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-semibold)",
                    fontWeight: 600,
                    fontSize: isCenter ? 24 : 18,
                    lineHeight: 1.3,
                    marginBottom: isCenter ? "var(--space-sm)" : 0,
                  }}
                >
                  {service.name}
                </h3>
                {isCenter && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-body)",
                      lineHeight: "var(--lh-body)",
                      opacity: 0.7,
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    {service.description}
                  </p>
                )}
                {isCenter && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-body)",
                      opacity: 0.5,
                    }}
                  >
                    Explore →
                  </span>
                )}
              </div>

              {/* Center card active indicator bar */}
              {isCenter && (
                <div
                  style={{
                    position: "absolute",
                    top: "var(--space-md)",
                    left: "var(--space-md)",
                    width: 32,
                    height: 3,
                    borderRadius: "var(--radius-pill)",
                    background: "var(--color-pure-white)",
                    opacity: 0.9,
                  }}
                />
              )}
            </div>
          );

          // Center card is a Link, flanking cards are plain divs (clicking jumps)
          if (isCenter) {
            return (
              <Link to={service.href} key={`link-${index}`} style={{ textDecoration: "none" }}>
                {card}
              </Link>
            );
          }
          return card;
        })}
      </div>

      {/* Prev / Next arrow buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "var(--space-md)",
          marginTop: "var(--space-2xl)",
        }}
      >
        <button
          onClick={prev}
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-pill)",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "var(--color-pure-white)",
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
          }}
        >
          ←
        </button>
        <button
          onClick={next}
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-pill)",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "var(--color-pure-white)",
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
          }}
        >
          →
        </button>
      </div>

      {/* Dot indicators */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "var(--space-xs)",
          marginTop: "var(--space-md)",
        }}
      >
        {SERVICES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 24 : 6,
              height: 6,
              borderRadius: "var(--radius-pill)",
              background: i === current ? "var(--color-pure-white)" : "rgba(255,255,255,0.25)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        ))}
      </div>

      {/* Service name label below carousel */}
      <div
        style={{
          textAlign: "center",
          marginTop: "var(--space-xl)",
          height: 32,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-semibold)",
            fontWeight: 600,
            fontSize: "var(--text-eyebrow)",
            letterSpacing: "var(--ls-eyebrow)",
            color: "var(--color-pure-white)",
            opacity: 0.4,
            textTransform: "uppercase",
            transition: "var(--transition-fast)",
          }}
        >
          {activeService.name}
        </p>
      </div>
    </section>
  );
}
