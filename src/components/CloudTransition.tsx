import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Scroll-triggered cinematic cloud fill that bridges the dark hero and the
 * dark services carousel. Six independent layers rise/part as the section
 * scrolls through the viewport, like an aircraft breaking through cloud cover.
 *
 * All motion is driven by `useScroll` progress (transform/opacity only) so it
 * stays GPU-composited and reflow-free. Honors `prefers-reduced-motion`.
 */
export function CloudTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // 0 when the section's top hits the viewport bottom, 1 when it leaves the top.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Layer parallax + reveal (disabled to static "settled" state if reduced).
  const l1Y = useTransform(scrollYProgress, [0, 0.5], ["40%", "0%"]);
  const l1O = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const l2X = useTransform(scrollYProgress, [0, 0.55], ["-30%", "0%"]);
  const l2O = useTransform(scrollYProgress, [0, 0.5], [0, 0.85]);
  const l3X = useTransform(scrollYProgress, [0, 0.55], ["30%", "0%"]);
  const l4Y = useTransform(scrollYProgress, [0.1, 0.6], ["20%", "-5%"]);
  const l4O = useTransform(scrollYProgress, [0.1, 0.6], [0, 0.7]);
  const l4S = useTransform(scrollYProgress, [0.1, 0.7], [1, 1.04]);
  const puffO = useTransform(scrollYProgress, [0.2, 0.6], [0, 0.6]);

  const r = (motionVal: unknown, fallback: string | number) =>
    reduceMotion ? fallback : (motionVal as never);

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      className="relative h-screen w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #1a1f2e 0%, #2a3045 30%, #3a4060 60%, #c8d0e0 85%, #e8ecf4 100%)",
      }}
    >
      {/* Layer 5 — top atmospheric haze (static, blends hero dark into clouds) */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-[4] h-[40vh] w-full"
        style={{
          background:
            "linear-gradient(to bottom, rgba(30,35,48,1) 0%, rgba(30,35,48,0.4) 60%, transparent 100%)",
        }}
      />

      {/* Layer 1 — base cloud (bottom-center) */}
      <motion.div
        className="pointer-events-none absolute z-[1] h-[60vh] w-[140vw]"
        style={{
          left: "-20vw",
          bottom: "-30%",
          translateY: r(l1Y, "0%"),
          opacity: r(l1O, 1),
          filter: "blur(8px)",
          transform: "translateZ(0)",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(220,225,235,0.95) 0%, rgba(200,210,225,0.6) 50%, transparent 100%)",
        }}
      />

      {/* Layer 2 — left cloud bank */}
      <motion.div
        className="pointer-events-none absolute z-[2] h-[80vh] w-[70vw]"
        style={{
          left: "-20%",
          bottom: "10%",
          translateX: r(l2X, "0%"),
          opacity: r(l2O, 0.85),
          filter: "blur(12px)",
          transform: "translateZ(0)",
          background:
            "radial-gradient(ellipse 90% 70% at 20% 80%, rgba(235,238,245,0.9) 0%, rgba(210,218,230,0.5) 60%, transparent 100%)",
        }}
      />

      {/* Layer 3 — right cloud bank (mirror of layer 2) */}
      <motion.div
        className="pointer-events-none absolute z-[2] h-[80vh] w-[70vw]"
        style={{
          right: "-20%",
          bottom: "10%",
          translateX: r(l3X, "0%"),
          opacity: r(l2O, 0.85),
          filter: "blur(12px)",
          transform: "translateZ(0)",
          background:
            "radial-gradient(ellipse 90% 70% at 80% 80%, rgba(235,238,245,0.9) 0%, rgba(210,218,230,0.5) 60%, transparent 100%)",
        }}
      />

      {/* Layer 4 — mid wisp (center, floating) */}
      <motion.div
        className="pointer-events-none absolute z-[3] h-[45vh] w-[110vw]"
        style={{
          left: "-5%",
          bottom: "35%",
          translateY: r(l4Y, "-5%"),
          opacity: r(l4O, 0.7),
          scale: r(l4S, 1.02),
          filter: "blur(16px)",
          transform: "translateZ(0)",
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(245,247,252,0.75) 0%, rgba(220,228,240,0.35) 70%, transparent 100%)",
        }}
      />

      {/* Layer 6 — highlight cloud puffs along the top of the cloud mass */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-[42%] z-[3]"
        style={{ opacity: r(puffO, 0.6) }}
      >
        {PUFFS.map((p, i) => (
          <div
            key={i}
            className={reduceMotion ? "" : "cloud-float"}
            style={{
              position: "absolute",
              left: p.left,
              bottom: p.bottom,
              width: p.width,
              height: p.height,
              borderRadius: "50% 60% 50% 60% / 60% 50% 60% 50%",
              background: "rgba(255,255,255,0.6)",
              filter: "blur(20px)",
              animationDelay: `${p.delay}s`,
              willChange: "transform",
            }}
          />
        ))}
      </motion.div>
    </section>
  );
}

const PUFFS = [
  { left: "8%", bottom: "0%", width: "28vw", height: "22vh", delay: 0.6 },
  { left: "34%", bottom: "6%", width: "34vw", height: "26vh", delay: 0.9 },
  { left: "62%", bottom: "-2%", width: "30vw", height: "24vh", delay: 1.2 },
  { left: "80%", bottom: "4%", width: "22vw", height: "20vh", delay: 1.5 },
];
