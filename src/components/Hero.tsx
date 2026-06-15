import { useEffect, useRef, useState } from "react";
import { Instagram, Youtube } from "lucide-react";

const INDIA_IMAGES = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80", // Taj Mahal
  "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1920&q=80", // Jaipur
  "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1920&q=80", // Kerala backwaters
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&q=80", // Goa beach
  "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=1920&q=80", // Varanasi ghats
];

/**
 * Full-viewport India hero with a scroll-driven zoom/fade transition.
 *
 * As the user scrolls through the first 100vh, `window.scrollY` is mapped to a
 * 0→1 progress value. "INDIA" scales up and fades out while the background
 * image zooms slightly and fades toward black, handing off to the next section.
 *
 * All colors, type sizes, spacing and easing come from tokens.css. Easing for
 * the eased "follow" is var(--transition-smooth) = cubic-bezier(0.16,1,0.3,1).
 */
export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(currentIndex);
      setTransitioning(true);
      setCurrentIndex((i) => (i + 1) % INDIA_IMAGES.length);
      setTimeout(() => {
        setPrevIndex(null);
        setTransitioning(false);
      }, 1200);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    INDIA_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const progress = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);

      const titleEl = titleRef.current;
      const bgEl = bgRef.current;
      if (titleEl) {
        titleEl.style.transform = `scale(${1 + progress * 1.5})`;
        titleEl.style.opacity = `${1 - progress}`;
      }
      if (bgEl) {
        bgEl.style.transform = `scale(${1 + progress * 0.08})`;
        bgEl.style.opacity = `${1 - progress * 0.6}`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "var(--color-pure-black)",
      }}
    >
      {/* Rotating slideshow background */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {/* Previous image — fades out */}
        {prevIndex !== null && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${INDIA_IMAGES[prevIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: transitioning ? 0 : 1,
              transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "opacity",
            }}
          />
        )}

        {/* Current image — fades in (keeps bgRef for the scroll-scale effect) */}
        <div
          ref={bgRef}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${INDIA_IMAGES[currentIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,
            transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform, opacity",
          }}
        />

        {/* Dark overlay — always present for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.7) 85%, #18181a 100%)",
          }}
        />
      </div>

      {/* Center stack: INDIA + eyebrow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-md)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <h1
          ref={titleRef}
          style={{
            margin: 0,
            fontFamily: "var(--font-mono-medium)",
            fontWeight: 500,
            fontSize: "18vw",
            lineHeight: 1,
            letterSpacing: "0.15em",
            color: "var(--color-pure-white)",
            willChange: "transform, opacity",
            transition: "var(--transition-smooth)",
            userSelect: "none",
          }}
        >
          INDIA
        </h1>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-semibold)",
            fontWeight: 600,
            fontSize: "var(--text-eyebrow)",
            letterSpacing: "var(--ls-eyebrow)",
            textTransform: "uppercase",
            color: "var(--color-pure-white)",
            opacity: 0.7,
          }}
        >
          Discover the Subcontinent
        </p>
      </div>

      {/* Slideshow dot indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "var(--space-3xl)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "var(--space-xs)",
          zIndex: 10,
        }}
      >
        {INDIA_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setPrevIndex(currentIndex);
              setTransitioning(true);
              setCurrentIndex(i);
              setTimeout(() => {
                setPrevIndex(null);
                setTransitioning(false);
              }, 1200);
            }}
            style={{
              width: i === currentIndex ? 24 : 6,
              height: 6,
              borderRadius: "var(--radius-pill)",
              background:
                i === currentIndex
                  ? "var(--color-pure-white)"
                  : "rgba(255,255,255,0.35)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        ))}
      </div>

      {/* Bottom-left: GPS coordinate */}
      <span
        style={{
          position: "absolute",
          left: "var(--space-xl)",
          bottom: "var(--space-xl)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-coordinate)",
          letterSpacing: "var(--ls-coordinate)",
          color: "var(--color-pure-white)",
        }}
      >
        28.6139° N, 77.2090° E
      </span>

      {/* Bottom-right: region label */}
      <span
        style={{
          position: "absolute",
          right: "var(--space-xl)",
          bottom: "var(--space-xl)",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-mono-md)",
          color: "var(--color-pure-white)",
        }}
      >
        Exploring India / Asia
      </span>

      {/* Right edge: vertical social rail */}
      <div
        style={{
          position: "absolute",
          right: "var(--space-xl)",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-md)",
          color: "var(--color-pure-white)",
        }}
      >
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          style={{ color: "var(--color-pure-white)" }}
        >
          <Instagram size={20} strokeWidth={1.5} />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
          aria-label="YouTube"
          style={{ color: "var(--color-pure-white)" }}
        >
          <Youtube size={20} strokeWidth={1.5} />
        </a>
      </div>
    </section>
  );
}
