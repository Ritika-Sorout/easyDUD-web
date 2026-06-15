import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export interface CloudService {
  title: string;
  description?: string;
  /** A real, existing route in the app (validated against src/routes/*). */
  route: string;
  icon?: LucideIcon;
}

export interface CloudScrollTransitionProps {
  /** Headline shown during the hero phase; fades out behind the clouds. */
  title: React.ReactNode;
  services: CloudService[];
  /** Background image for the hero phase. */
  heroImage: string;
  /** Optional section id (used for in-page nav / scroll spy). */
  id?: string;
  /** Optional eyebrow + heading for the emerging services panel. */
  servicesEyebrow?: string;
  servicesHeading?: string;
}

/** Soft volumetric cloud backgrounds — reliable, asset-free, GPU-cheap. */
const CLOUD_BG = {
  back: "radial-gradient(ellipse 38% 60% at 18% 78%, rgba(226,231,240,0.85), transparent 70%), radial-gradient(ellipse 44% 64% at 70% 82%, rgba(214,222,235,0.7), transparent 72%), radial-gradient(ellipse 50% 50% at 48% 92%, rgba(205,214,230,0.6), transparent 75%)",
  mid: "radial-gradient(ellipse 46% 70% at 30% 84%, rgba(240,243,250,0.92), transparent 70%), radial-gradient(ellipse 52% 72% at 78% 88%, rgba(228,234,244,0.8), transparent 72%), radial-gradient(ellipse 60% 60% at 52% 100%, rgba(220,227,240,0.75), transparent 74%)",
  front:
    "radial-gradient(ellipse 56% 80% at 22% 92%, rgba(255,255,255,0.96), transparent 68%), radial-gradient(ellipse 64% 82% at 80% 96%, rgba(248,250,254,0.9), transparent 70%), radial-gradient(ellipse 70% 66% at 50% 108%, rgba(240,244,251,0.88), transparent 72%)",
};

/**
 * CloudScrollTransition
 *
 * A scroll-pinned, cinematic transition: a hero headline fades as three
 * parallax cloud layers rise and fill the viewport, then glassmorphism service
 * placards emerge from the atmosphere before the clouds part. Built for
 * TanStack Router (navigation via <Link>), Framer Motion, and Tailwind.
 *
 * Honors `prefers-reduced-motion` and scales motion down on small screens.
 */
export function CloudScrollTransition({
  title,
  services,
  heroImage,
  id,
  servicesEyebrow = "What We Offer",
  servicesHeading = "Our Services",
}: CloudScrollTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Responsive motion budget.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Parallax drift distances (reduced on mobile / reduced-motion).
  const fgDist = reduce ? 120 : isMobile ? 320 : 900;
  const midDist = reduce ? 90 : isMobile ? 220 : 600;
  const bgDist = reduce ? 60 : isMobile ? 120 : 300;
  const maxBlur = reduce ? 0 : isMobile ? 4 : 12;

  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -fgDist]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, -midDist]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -bgDist]);

  // Clouds rise from below, fade in, then part at the end to reveal placards.
  const cloudRiseY = useTransform(scrollYProgress, [0.15, 0.55], ["45%", "0%"]);
  const cloudOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.85, 1],
    [0, 1, 1, 0.12],
  );
  const cloudScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const cloudBlur = useTransform(scrollYProgress, [0.3, 0.8], [0, maxBlur]);
  const cloudFilter = useMotionTemplate`blur(${cloudBlur}px)`;

  // Hero headline fades behind the clouds.
  const contentOpacity = useTransform(scrollYProgress, [0.4, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.7], [0, -60]);

  // Service placards emerge late, then settle as clouds part.
  const nextSectionOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1]);
  const serviceCardTranslate = useTransform(
    scrollYProgress,
    [0.6, 1],
    [reduce ? 20 : 70, 0],
  );

  return (
    <section
      id={id}
      ref={wrapperRef}
      className="relative w-full"
      style={{ height: "300vh" }}
    >
      {/* Pinned viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0d0f1a]">
        {/* Hero backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0f1a]/50 via-[#0d0f1a]/20 to-[#0d0f1a]/80" />
        </div>

        {/* Hero headline (fades behind clouds) */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="max-w-4xl text-white [text-wrap:balance]">{title}</div>
        </motion.div>

        {/* Background cloud layer */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-10%] bottom-[-20%] z-20 h-[120vh]"
          style={{
            y: backgroundY,
            translateY: cloudRiseY,
            opacity: cloudOpacity,
            scale: cloudScale,
            background: CLOUD_BG.back,
            filter: cloudFilter,
            willChange: "transform, opacity",
          }}
        />

        {/* Mid cloud layer */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-10%] bottom-[-25%] z-30 h-[120vh]"
          style={{
            y: midY,
            translateY: cloudRiseY,
            opacity: cloudOpacity,
            scale: cloudScale,
            background: CLOUD_BG.mid,
            filter: cloudFilter,
            willChange: "transform, opacity",
          }}
        />

        {/* Emerging service placards (between mid and foreground clouds) */}
        <motion.div
          style={{ opacity: nextSectionOpacity }}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6"
        >
          <motion.div style={{ y: serviceCardTranslate }} className="w-full">
            <div className="mb-8 text-center">
              <p className="m-0 text-[11px] font-medium uppercase tracking-[0.22em] text-[#F97316]">
                {servicesEyebrow}
              </p>
              <h2
                className="mt-2 text-4xl font-extrabold uppercase tracking-[0.04em] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] md:text-5xl"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {servicesHeading}
              </h2>
            </div>

            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <PlacardCard key={s.title} service={s} />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Foreground cloud layer — drifts fastest, parts last */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-15%] bottom-[-30%] z-50 h-[130vh]"
          style={{
            y: foregroundY,
            translateY: cloudRiseY,
            opacity: cloudOpacity,
            scale: cloudScale,
            background: CLOUD_BG.front,
            filter: cloudFilter,
            willChange: "transform, opacity",
          }}
        />
      </div>
    </section>
  );
}

function PlacardCard({ service }: { service: CloudService }) {
  const Icon = service.icon;
  return (
    <Link
      to={service.route}
      className="group relative block overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:border-white/35 hover:bg-white/15 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      aria-label={service.title}
    >
      <div className="flex items-start justify-between">
        {Icon ? (
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-white">
            <Icon className="h-5 w-5" />
          </span>
        ) : (
          <span />
        )}
        <ArrowUpRight className="h-5 w-5 text-white/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">{service.title}</h3>
      {service.description ? (
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          {service.description}
        </p>
      ) : null}
    </Link>
  );
}
