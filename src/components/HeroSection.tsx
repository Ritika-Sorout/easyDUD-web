import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { CircularBadge } from "@/components/CircularBadge";
import { GlassmorphismSearch } from "@/components/GlassmorphismSearch";

/** Indian destinations powering the hero background + left thumbnail strip. */
const DESTINATIONS = [
  {
    name: "Himalayas",
    region: "Ladakh, India",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=2000&q=80",
  },
  {
    name: "Rajasthan",
    region: "Thar Desert, India",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=2000&q=80",
  },
  {
    name: "Kerala",
    region: "Backwaters, India",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=2000&q=80",
  },
  {
    name: "Varanasi",
    region: "Ganges Ghats, India",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=2000&q=80",
  },
];

const SOCIALS = ["FACEBOOK", "TWITTER", "INSTAGRAM"];

/**
 * Cinematic, scroll-driven hero.
 *
 * A tall (250vh) scroll container holds a `position: sticky` hero so the scene
 * "sticks" while the background image zooms from scale(1) → scale(1.3) and the
 * foreground UI fades out. A dark overlay then fades in to hand off to the
 * services section below. Honors `prefers-reduced-motion`.
 */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeBg, setActiveBg] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Image zoom + foreground fades. Disabled when reduced motion is requested.
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const scale = reduceMotion ? 1 : rawScale;
  const uiOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const uiY = useTransform(scrollYProgress, [0, 0.35], [0, -40]);
  const searchOpacity = useTransform(scrollYProgress, [0.08, 0.42], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0.4, 0.8], [0, 0.95]);

  const current = DESTINATIONS[activeBg];

  return (
    // id="hero" keeps the existing IntersectionObserver section nav working.
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[250vh] w-full bg-black"
    >
      <div className="sticky top-0 h-screen min-h-[640px] w-full overflow-hidden">
        {/* Zooming background image */}
        <motion.div
          style={{ scale, willChange: "transform" }}
          className="absolute inset-0"
        >
          <AnimatePresence mode="sync">
            <motion.img
              key={current.image}
              src={current.image}
              alt={current.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-[rgba(10,10,20,0.32)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          {/* Subtle radial vignette to make the display text pop */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </motion.div>

        {/* Dark transition overlay (fades in as services section approaches) */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="pointer-events-none absolute inset-0 z-30 bg-[#0d0d0d]"
        />

        {/* Foreground UI (fades out on scroll) */}
        <motion.div
          style={{ opacity: uiOpacity, y: uiY }}
          className="absolute inset-0 z-20"
        >
          {/* Left thumbnail strip */}
          <div className="absolute left-4 top-[26%] hidden flex-col gap-3 md:flex lg:left-8">
            {DESTINATIONS.map((d, i) => (
              <button
                key={d.name}
                type="button"
                onClick={() => setActiveBg(i)}
                aria-label={`Show ${d.name}`}
                aria-pressed={i === activeBg}
                className={
                  "group relative h-16 w-16 overflow-hidden rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 " +
                  (i === activeBg
                    ? "border-[#C9A96E] ring-2 ring-[#C9A96E]/50"
                    : "border-white/30 opacity-70 hover:opacity-100")
                }
              >
                <img
                  src={d.image}
                  alt={d.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </button>
            ))}
          </div>

          {/* Iceland-style display title: filled white with soft-light bleed */}
          <h1
            className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "clamp(90px, 17vw, 210px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.92)",
              WebkitTextStroke: "1.5px rgba(255,255,255,0.4)",
              textShadow:
                "0 0 80px rgba(255,255,255,0.15), 0 4px 20px rgba(0,0,0,0.5)",
              mixBlendMode: "soft-light",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            INDIA
          </h1>

          {/* Subtitle + decorative divider */}
          <div className="absolute left-1/2 top-[52%] w-full -translate-x-1/2 px-6 text-center">
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(18px, 2.2vw, 28px)",
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.08em",
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
            >
              {current.region}
            </p>
            <div
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "14px",
                letterSpacing: "16px",
                marginTop: "12px",
              }}
            >
              &#10022; &#10022; &#10022;
            </div>
          </div>

          {/* FIND YOUR JOURNEY badge — lower left */}
          <div className="absolute bottom-32 left-4 hidden items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-md md:flex lg:left-8">
            <CompassStar />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
              Find Your Journey
            </span>
          </div>

          {/* Circular rotating badge — lower right */}
          <div className="absolute bottom-28 right-6 hidden md:block lg:right-12">
            <CircularBadge size={124} />
          </div>

          {/* Vertical social links — right edge, upper area */}
          <div className="absolute right-3 top-32 hidden flex-col items-center gap-6 lg:flex">
            {SOCIALS.map((s) => (
              <span
                key={s}
                className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70"
                style={{ writingMode: "vertical-rl" }}
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Glassmorphism search — bottom centre */}
        <motion.div
          style={{ opacity: searchOpacity }}
          className="absolute bottom-8 left-1/2 z-20 w-full -translate-x-1/2 px-4"
        >
          <div className="mx-auto flex justify-center">
            <GlassmorphismSearch />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Small starburst/compass mark used by the "Find Your Journey" pill. */
function CompassStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
        fill="#C9A96E"
      />
    </svg>
  );
}
