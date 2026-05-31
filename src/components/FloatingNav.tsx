import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Hotel,
  Plane,
  CarTaxiFront,
  Bike,
  Car,
  Bus,
  type LucideIcon,
} from "lucide-react";

type SectionId = "ondemand" | "hotels" | "travel";

type SubItem = { label: string; to: string; Icon: LucideIcon };

type Section = {
  id: SectionId;
  label: string;
  Icon: LucideIcon;
  /** Direct navigation target when the section is clicked. */
  to: string;
  /** Optional fly-out sub-items revealed on hover/focus. */
  items: SubItem[];
};

const SECTIONS: Section[] = [
  {
    id: "ondemand",
    label: "On Demand",
    Icon: Zap,
    to: "/on-demand",
    items: [
      { label: "Personal Driver", to: "/cab", Icon: CarTaxiFront },
      { label: "Bike Pooling", to: "/bike", Icon: Bike },
      { label: "Auto-Rickshaw", to: "/auto-ride", Icon: Car },
    ],
  },
  {
    id: "hotels",
    label: "Hotels",
    Icon: Hotel,
    to: "/hotels",
    items: [],
  },
  {
    id: "travel",
    label: "Travel",
    Icon: Plane,
    to: "/travel",
    items: [
      { label: "Flights", to: "/flights", Icon: Plane },
      { label: "Bus", to: "/bus", Icon: Bus },
      { label: "Outstation Taxi", to: "/cab", Icon: CarTaxiFront },
    ],
  },
];

function deriveActive(pathname: string): SectionId {
  if (pathname.startsWith("/hotels")) return "hotels";
  if (
    pathname.startsWith("/travel") ||
    pathname.startsWith("/flights") ||
    pathname.startsWith("/bus")
  )
    return "travel";
  if (
    pathname.startsWith("/on-demand") ||
    pathname.startsWith("/cab") ||
    pathname.startsWith("/bike") ||
    pathname.startsWith("/auto")
  )
    return "ondemand";
  return "hotels";
}

export function FloatingNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<SectionId | null>(null);

  const active = deriveActive(pathname);

  return (
    <motion.nav
      // Entrance: drop in from the top and fade up. Stays mounted in the
      // router root so it persists & glides smoothly across page loads.
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="fixed top-20 left-1/2 z-50 hidden -translate-x-1/2 md:block"
      aria-label="Primary categories"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/40 bg-white/55 p-1.5 shadow-[0_20px_60px_-20px_rgba(60,60,90,0.45),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl">
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          const hasMenu = section.items.length > 0;
          const isOpen = hovered === section.id && hasMenu;

          return (
            <div
              key={section.id}
              className="relative"
              onMouseEnter={() => setHovered(section.id)}
              onMouseLeave={() => setHovered((h) => (h === section.id ? null : h))}
            >
              <button
                type="button"
                onClick={() => navigate({ to: section.to })}
                aria-current={isActive ? "page" : undefined}
                aria-haspopup={hasMenu || undefined}
                aria-expanded={isOpen || undefined}
                className="relative z-10 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                {/* Animated active pill — glides between items via layoutId. */}
                {isActive && (
                  <motion.span
                    layoutId="floating-nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-[0_8px_24px_-6px_rgba(99,102,241,0.6)]"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}
                <section.Icon
                  className={
                    "h-4 w-4 transition-colors " +
                    (isActive ? "text-white" : "text-foreground/60")
                  }
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span
                  className={
                    "transition-colors " +
                    (isActive ? "text-white" : "text-foreground/70")
                  }
                >
                  {section.label}
                </span>
              </button>

              {/* Fly-out sub-menu */}
              {hasMenu && (
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                      className="absolute left-1/2 top-full -translate-x-1/2 pt-2"
                    >
                      <div className="flex min-w-[150px] flex-col gap-0.5 rounded-2xl border border-white/40 bg-white/80 p-1.5 shadow-[0_24px_60px_-20px_rgba(60,60,90,0.45)] backdrop-blur-2xl">
                        {section.items.map(({ label, to, Icon }) => {
                          const subActive = pathname.startsWith(to);
                          return (
                            <Link
                              key={label}
                              to={to}
                              className={
                                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 " +
                                (subActive
                                  ? "bg-indigo-500/10 text-indigo-600"
                                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground")
                              }
                            >
                              <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                              {label}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>
    </motion.nav>
  );
}
