import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Calendar, Search, ChevronDown, Compass } from "lucide-react";
import { toast } from "sonner";

type TabKey = "travel" | "on-demand" | "hotels";

interface TabConfig {
  key: TabKey;
  label: string;
  /** Real route in the app this tab searches into. */
  route: string;
  locations: string[];
  types: string[];
}

const TABS: TabConfig[] = [
  {
    key: "travel",
    label: "Travel",
    route: "/travel",
    locations: ["Delhi", "Mumbai", "Jaipur", "Goa", "Leh", "Kochi"],
    types: ["Flights", "Buses", "Outstation Taxi"],
  },
  {
    key: "on-demand",
    label: "On-Demand",
    route: "/on-demand",
    locations: ["Near me", "Bengaluru", "Hyderabad", "Pune", "Chennai"],
    types: ["Personal Driver", "Bike Pooling", "Auto-Rickshaw"],
  },
  {
    key: "hotels",
    label: "Hotels",
    route: "/hotels",
    locations: ["Udaipur", "Manali", "Munnar", "Varanasi", "Rishikesh"],
    types: ["Hotels", "Resorts", "Homestays"],
  },
];

/**
 * Glassmorphism search bar with a pill tab switcher and an input row.
 * Submitting routes the user to the active tab's real service page so the
 * existing booking flows continue to work.
 */
export function GlassmorphismSearch({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("travel");
  const [location, setLocation] = useState("");

  const active = TABS.find((t) => t.key === tab)!;

  const handleSearch = () => {
    toast.success(
      location
        ? `Searching ${active.label} in "${location}"…`
        : `Exploring ${active.label}…`,
    );
    navigate({ to: active.route });
  };

  return (
    <div
      className={`w-full max-w-3xl rounded-2xl border border-white/30 bg-white/15 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl ${className}`}
      style={{ WebkitBackdropFilter: "blur(20px)" }}
    >
      {/* Tab switcher */}
      <div
        className="mb-3 flex items-center gap-1.5"
        role="tablist"
        aria-label="Search category"
      >
        {TABS.map((t) => {
          const isActive = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(t.key)}
              className={
                "rounded-full px-5 py-1.5 text-sm tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 " +
                (isActive
                  ? "bg-[#E8E0D0] text-black font-medium shadow-sm"
                  : "text-white/75 hover:text-white")
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Input row */}
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        <GlassField icon={<MapPin className="h-4 w-4" />} label="Location">
          <input
            list="wayve-locations"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where to?"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
          />
          <datalist id="wayve-locations">
            {active.locations.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </GlassField>

        <GlassDivider />

        <GlassField icon={<Compass className="h-4 w-4" />} label="Type">
          <div className="relative flex items-center">
            <select className="w-full appearance-none bg-transparent pr-5 text-sm text-white focus:outline-none [&>option]:text-black">
              {active.types.map((ty) => (
                <option key={ty}>{ty}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-white/60" />
          </div>
        </GlassField>

        <GlassDivider />

        <GlassField icon={<Calendar className="h-4 w-4" />} label="When">
          <input
            type="date"
            className="w-full bg-transparent text-sm text-white focus:outline-none [color-scheme:dark]"
          />
        </GlassField>

        <button
          type="button"
          onClick={handleSearch}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#1A1A2E] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </div>
  );
}

function GlassField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/10">
      <span className="text-white/70">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-white/60">
          {label}
        </span>
        {children}
      </span>
    </label>
  );
}

function GlassDivider() {
  return <div className="hidden w-px self-stretch bg-white/20 md:block" />;
}
