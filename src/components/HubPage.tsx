import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck, Lock, Star, Headphones, type LucideIcon } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export interface HubService {
  Icon: LucideIcon;
  name: string;
  tagline: string;
  to: string;
  img: string;
  features: string[];
  /** Short trailing meta, e.g. "from ₹49" or "4.9 rating". */
  meta?: string;
}

export interface HubTrust {
  Icon: LucideIcon;
  label: string;
  sub: string;
}

export interface HubPageProps {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  /** Accent colour (hex) used for the italic title word, links and icon chips. */
  accent: string;
  subtitle: string;
  heroImg: string;
  services: HubService[];
  trust: HubTrust[];
}

const SERIF = "'Playfair Display', serif";

/** Image that gracefully falls back to a soft gradient if it fails to load. */
function CardImage({ src, alt, accent }: { src: string; alt: string; accent: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div
      className="absolute inset-0"
      style={{ background: `linear-gradient(135deg, ${accent}22, ${accent}05)` }}
    >
      {ok && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setOk(false)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
    </div>
  );
}

export function HubPage({
  eyebrow,
  titleLead,
  titleAccent,
  accent,
  subtitle,
  heroImg,
  services,
  trust,
}: HubPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80" />
        </div>

        <div className="relative mx-auto max-w-[1320px] px-6 pt-44 pb-20">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md"
          >
            {eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 max-w-3xl text-5xl font-bold leading-[1.05] text-white md:text-7xl"
            style={{ fontFamily: SERIF }}
          >
            {titleLead}{" "}
            <span className="italic" style={{ color: accent }}>
              {titleAccent}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 max-w-xl text-lg text-white/80"
          >
            {subtitle}
          </motion.p>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-9 flex flex-wrap gap-x-7 gap-y-3"
          >
            {[
              { Icon: Star, text: "4.9 average rating" },
              { Icon: ShieldCheck, text: "Verified providers" },
              { Icon: Lock, text: "Secure payments" },
              { Icon: Headphones, text: "24/7 support" },
            ].map(({ Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-2 text-sm font-medium text-white/85">
                <Icon className="h-4 w-4" style={{ color: accent }} />
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-[1320px] px-6 py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-foreground/5 bg-white shadow-[0_10px_40px_rgba(60,60,90,0.08)]"
            >
              {/* Media */}
              <div className="relative h-44 overflow-hidden">
                <CardImage src={s.img} alt={s.name} accent={accent} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div
                  className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg backdrop-blur-md"
                  style={{ background: `${accent}E6` }}
                >
                  <s.Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                {s.meta && (
                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground/80 backdrop-blur-md">
                    {s.meta}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl font-bold text-foreground/90" style={{ fontFamily: SERIF }}>
                  {s.name}
                </h3>
                <p className="mt-1.5 text-sm text-foreground/60">{s.tagline}</p>

                <ul className="mt-5 space-y-2.5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/70">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={s.to}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ background: accent }}
                >
                  Book {s.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ASSURANCE */}
      <section className="border-t border-foreground/5 bg-secondary/30">
        <div className="mx-auto max-w-[1320px] px-6 py-16">
          <h2
            className="text-3xl font-bold text-foreground/90 md:text-4xl"
            style={{ fontFamily: SERIF }}
          >
            Built on trust
          </h2>
          <p className="mt-3 max-w-xl text-foreground/60">
            Every booking is backed by verified partners, encrypted payments and round-the-clock human support.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="rounded-2xl border border-foreground/5 bg-white p-6 shadow-[0_8px_30px_rgba(60,60,90,0.06)]"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: `${accent}1A`, color: accent }}
                >
                  <t.Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-semibold text-foreground/90">{t.label}</h3>
                <p className="mt-1.5 text-sm text-foreground/60">{t.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
