import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Service {
  title: string;
  tagline: string;
  tag: string;
  /** Real, existing route in the app — verified against src/routes/*. */
  route: string;
  img: string;
  /** Box-shadow applied only when this card is centred/active. */
  glow: string;
}

/**
 * easyDUD services, carousel order starting centred on CABS.
 *
 * Route mapping note: the spec's `/cabs` and `/drivers` routes do not exist.
 * Mapped to real routes — CABS → /cab, DRIVERS → /on-demand (mobility hub) —
 * to keep navigation working in this TanStack Router app.
 */
const SERVICES: Service[] = [
  {
    title: "CABS",
    tagline: "Your ride, on your terms",
    tag: "#Cabs",
    route: "/cab",
    img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    glow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(249,115,22,0.5), 0 0 40px rgba(249,115,22,0.15)",
  },
  {
    title: "DRIVERS",
    tagline: "Professional drivers, anytime",
    tag: "#Drivers",
    route: "/on-demand",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    glow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(99,102,241,0.5), 0 0 40px rgba(99,102,241,0.15)",
  },
  {
    title: "BIKE POOL",
    tagline: "Faster, greener, together",
    tag: "#BikePool",
    route: "/bike-pooling",
    img: "https://images.unsplash.com/photo-1558981285-6f0c379428e5?w=800&q=80",
    glow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(16,185,129,0.5), 0 0 40px rgba(16,185,129,0.15)",
  },
  {
    title: "AUTO",
    tagline: "Zip through the city",
    tag: "#Auto",
    route: "/auto",
    img: "https://images.unsplash.com/photo-1609766857584-e5df825be6cc?w=800&q=80",
    glow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(234,179,8,0.5), 0 0 40px rgba(234,179,8,0.15)",
  },
  {
    title: "HOTELS",
    tagline: "Rest well, wherever you are",
    tag: "#Hotels",
    route: "/hotels",
    img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    glow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(245,158,11,0.5), 0 0 40px rgba(245,158,11,0.15)",
  },
  {
    title: "FLIGHTS",
    tagline: "The world is closer than you think",
    tag: "#Flights",
    route: "/flights",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    glow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(56,189,248,0.5), 0 0 40px rgba(56,189,248,0.15)",
  },
];

const TOTAL = SERVICES.length;

/** Signed offset from the active card (-2..2), or null when off-screen. */
function getOffset(index: number, activeIndex: number): number | null {
  let diff = (index - activeIndex + TOTAL) % TOTAL;
  if (diff > TOTAL / 2) diff -= TOTAL;
  if (diff < -2 || diff > 2) return null;
  return diff;
}

/** Per-offset 3D transform values for the fan layout. */
const OFFSET_STYLE: Record<number, { x: number; z: number; rotateY: number; scale: number; opacity: number; brightness: number }> = {
  0: { x: 0, z: 60, rotateY: 0, scale: 1.04, opacity: 1, brightness: 1 },
  [-1]: { x: -280, z: -80, rotateY: 28, scale: 0.85, opacity: 0.78, brightness: 0.75 },
  1: { x: 280, z: -80, rotateY: -28, scale: 0.85, opacity: 0.78, brightness: 0.75 },
  [-2]: { x: -480, z: -220, rotateY: 42, scale: 0.66, opacity: 0.55, brightness: 0.6 },
  2: { x: 480, z: -220, rotateY: -42, scale: 0.66, opacity: 0.55, brightness: 0.6 },
};

export function ServicesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: -1 | 1) => setActiveIndex((i) => (i + dir + TOTAL) % TOTAL),
    [],
  );

  // Auto-rotate every 4s; paused on hover/touch interaction.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 4000);
    return () => clearInterval(id);
  }, [paused, go]);

  return (
    <section
      id="placards"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#1e2330] py-24"
    >
      {/* Misty residue at the bottom + radial vignette */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[35%]"
        style={{
          background:
            "linear-gradient(to top, rgba(40,50,70,0.8) 0%, rgba(30,40,58,0.4) 60%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(10,12,20,0.6) 100%)",
        }}
      />

      {/* Heading */}
      <div className="relative z-10 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="m-0 text-[11px] font-medium uppercase tracking-[0.2em] text-[#F97316]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          What We Offer
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mb-14 mt-2 text-5xl font-extrabold uppercase tracking-[0.04em] text-white"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Our Services
        </motion.h2>
      </div>

      {/* Desktop: 3D fan carousel */}
      <div
        className="relative z-10 hidden h-[520px] w-full items-center justify-center md:flex"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 45%" }}
      >
        {SERVICES.map((s, index) => {
          const offset = getOffset(index, activeIndex);
          const hidden = offset === null;
          const o = OFFSET_STYLE[offset ?? 0];
          const isActive = offset === 0;

          return (
            <motion.div
              key={s.title}
              className="absolute"
              style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
              animate={{
                x: o.x,
                z: o.z,
                rotateY: o.rotateY,
                scale: o.scale,
                opacity: hidden ? 0 : o.opacity,
                zIndex: hidden ? 0 : 10 - Math.abs(offset ?? 0),
              }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ServiceCard
                service={s}
                isActive={isActive}
                hidden={hidden}
                brightness={o.brightness}
                onSelect={() => offset !== null && setActiveIndex(index)}
              />
            </motion.div>
          );
        })}

        <ArrowButton dir="left" onClick={() => go(-1)} className="left-8" />
        <ArrowButton dir="right" onClick={() => go(1)} className="right-8" />
      </div>

      {/* Desktop dots */}
      <div className="relative z-10 mt-10 hidden items-center justify-center gap-2 md:flex">
        {SERVICES.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-label={`Show ${s.title}`}
            onClick={() => setActiveIndex(i)}
            className={
              "h-1.5 rounded-full transition-all " +
              (i === activeIndex ? "w-6 bg-[#F97316]" : "w-1.5 bg-white/30")
            }
          />
        ))}
      </div>

      {/* Mobile: single active card + tab pills */}
      <MobileCarousel
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        go={go}
        setPaused={setPaused}
      />
    </section>
  );
}

function ServiceCard({
  service,
  isActive,
  hidden,
  brightness,
  onSelect,
}: {
  service: Service;
  isActive: boolean;
  hidden: boolean;
  brightness: number;
  onSelect: () => void;
}) {
  return (
    <Link
      to={service.route}
      tabIndex={isActive ? 0 : -1}
      aria-hidden={hidden}
      onClick={(e) => {
        // Only the centred card navigates; others re-centre.
        if (!isActive) {
          e.preventDefault();
          onSelect();
        }
      }}
      className="group relative block h-[435px] w-[270px] overflow-hidden rounded-2xl bg-cover bg-center no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      style={{
        backgroundImage: `url(${service.img})`,
        filter: `brightness(${brightness})`,
        boxShadow: isActive ? service.glow : "0 20px 50px rgba(0,0,0,0.5)",
        border: isActive ? "1.5px solid rgba(255,255,255,0.25)" : "1px solid transparent",
        pointerEvents: hidden ? "none" : "auto",
      }}
      aria-label={`${service.title} — ${service.tagline}`}
    >
      {/* Legibility gradient */}
      <span
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.82) 100%)",
        }}
      />

      {/* Tag */}
      <span
        className="absolute right-4 top-4 z-10 rounded-full border border-white/70 bg-black/20 px-3.5 py-[5px] text-[11px] tracking-[0.08em] text-white/90 backdrop-blur-sm transition-opacity duration-300"
        style={{ fontFamily: "'Inter', sans-serif", opacity: isActive ? 1 : 0 }}
      >
        {service.tag}
      </span>

      {/* Content (active card only) */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 px-6 pb-7 transition-all duration-300"
        style={{ opacity: isActive ? 1 : 0, transform: isActive ? "translateY(0)" : "translateY(8px)" }}
      >
        <h3
          className="m-0 text-3xl font-extrabold uppercase leading-tight tracking-[0.06em] text-white"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
        >
          {service.title}
        </h3>
        <div className="my-3 h-0.5 w-10 bg-white/75" />
        <p
          className="m-0 text-[13.5px] italic tracking-[0.04em] text-white/80"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {service.tagline}
        </p>
      </div>
    </Link>
  );
}

function MobileCarousel({
  activeIndex,
  setActiveIndex,
  go,
  setPaused,
}: {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  go: (dir: -1 | 1) => void;
  setPaused: (v: boolean) => void;
}) {
  const touchX = useRef<number | null>(null);
  const active = SERVICES[activeIndex];

  const onTouchStart = (e: React.TouchEvent) => {
    setPaused(true);
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <div className="relative z-10 w-full md:hidden">
      <div
        className="mx-auto h-[70vh] w-[85vw] max-w-sm"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Link
          to={active.route}
          className="group relative block h-full w-full overflow-hidden rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${active.img})`, boxShadow: active.glow }}
          aria-label={`${active.title} — ${active.tagline}`}
        >
          <span
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.82) 100%)",
            }}
          />
          <span
            className="absolute right-4 top-4 rounded-full border border-white/70 bg-black/20 px-3.5 py-[5px] text-[11px] tracking-[0.08em] text-white/90 backdrop-blur-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {active.tag}
          </span>
          <div className="absolute inset-x-0 bottom-0 px-6 pb-7">
            <h3
              className="m-0 text-[28px] font-extrabold uppercase leading-tight tracking-[0.06em] text-white"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
            >
              {active.title}
            </h3>
            <div className="my-3 h-0.5 w-10 bg-white/75" />
            <p className="m-0 text-[13.5px] italic text-white/80" style={{ fontFamily: "'Inter', sans-serif" }}>
              {active.tagline}
            </p>
          </div>
        </Link>
      </div>

      {/* Arrows side by side below the card */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <ArrowButton dir="left" onClick={() => go(-1)} />
        <ArrowButton dir="right" onClick={() => go(1)} />
      </div>

      {/* Scrollable service tab pills */}
      <nav className="no-scrollbar mt-6 flex gap-2 overflow-x-auto px-4">
        {SERVICES.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={
              "flex-shrink-0 rounded-full border px-4 py-2 text-xs whitespace-nowrap transition-colors " +
              (i === activeIndex
                ? "border-[#F97316] bg-[#F97316] text-white"
                : "border-white/15 bg-transparent text-white/70")
            }
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {s.title}
          </button>
        ))}
      </nav>
    </div>
  );
}

function ArrowButton({
  dir,
  onClick,
  className = "",
}: {
  dir: "left" | "right";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Previous service" : "Next service"}
      className={
        "z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:absolute md:top-1/2 md:-translate-y-1/2 " +
        className
      }
    >
      {dir === "left" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
