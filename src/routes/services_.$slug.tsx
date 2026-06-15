import { createFileRoute, Link } from "@tanstack/react-router";

const SERVICE_META: Record<
  string,
  { tag: string; name: string; description: string; icon: string; details: string[] }
> = {
  "personal-driver": {
    tag: "TRAVEL / ROAD",
    name: "Personal Driver",
    icon: "\uD83D\uDE97",
    description:
      "Dedicated chauffeurs for city transfers, outstation trips, and multi-day journeys across India.",
    details: [
      "Available 24/7 for airport pickups and drops",
      "Outstation and multi-day hire options",
      "AC vehicles with experienced, verified drivers",
      "Fixed fares — no surge pricing",
    ],
  },
  "bike-pooling": {
    tag: "TRAVEL / SHARED",
    name: "Bike Pooling",
    icon: "\uD83C\uDFCD\uFE0F",
    description:
      "Affordable two-wheeler sharing for short city commutes and last-mile connectivity.",
    details: [
      "Quick bookings for short city distances",
      "Helmet provided, safety-first rides",
      "Ideal for beating peak-hour traffic",
      "Available across major Indian cities",
    ],
  },
  "auto-rickshaw": {
    tag: "TRAVEL / LOCAL",
    name: "Auto Rickshaw",
    icon: "\uD83D\uDEFA",
    description:
      "On-demand auto rickshaw bookings — the classic way to navigate India's streets.",
    details: [
      "Metered and fixed-fare options",
      "Local neighbourhood expertise",
      "Perfect for short hops and market visits",
      "Pre-booked or on-demand availability",
    ],
  },
  hotels: {
    tag: "TRAVEL / STAYS",
    name: "Hotels",
    icon: "\uD83C\uDFE8",
    description:
      "Curated hotel bookings from budget guesthouses to heritage luxury properties.",
    details: [
      "Budget, boutique, and luxury tiers",
      "Heritage and palace hotel specialists",
      "Breakfast and meal plans included where available",
      "Instant confirmation and free cancellation options",
    ],
  },
  buses: {
    tag: "TRAVEL / GROUPS",
    name: "Bus Travel",
    icon: "\uD83D\uDE8C",
    description:
      "Intercity and state bus bookings — sleeper, AC, and private coach options.",
    details: [
      "State buses, Volvo AC, and sleeper coaches",
      "Private charter buses for groups",
      "Real-time seat availability",
      "Pickup and drop points across cities",
    ],
  },
};

export const Route = createFileRoute("/services_/$slug")({
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useParams();
  const service = SERVICE_META[slug ?? ""];

  if (!service)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-pure-black)",
          color: "var(--color-pure-white)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-md)",
          fontFamily: "var(--font-body)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-coordinate)",
            letterSpacing: "var(--ls-coordinate)",
            opacity: 0.4,
          }}
        >
          404 / NOT FOUND
        </span>
        <Link
          to="/"
          style={{
            color: "var(--color-pure-white)",
            opacity: 0.6,
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "var(--radius-pill)",
            padding: "13px 30px",
          }}
        >
          ← Back home
        </Link>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-pure-black)",
        color: "var(--color-pure-white)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Hero band */}
      <div
        style={{
          padding: "var(--space-5xl) var(--space-2xl) var(--space-4xl)",
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: "var(--space-md)" }}>{service.icon}</div>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-coordinate)",
            letterSpacing: "var(--ls-coordinate)",
            opacity: 0.4,
            textTransform: "uppercase",
            marginBottom: "var(--space-sm)",
          }}
        >
          {service.tag}
        </p>
        <h1
          style={{
            fontFamily: "var(--font-semibold)",
            fontWeight: 600,
            fontSize: "var(--text-display)",
            lineHeight: "var(--lh-display)",
            marginBottom: "var(--space-md)",
          }}
        >
          {service.name}
        </h1>
        <p
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--lh-body)",
            color: "rgba(255,255,255,0.6)",
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          {service.description}
        </p>
      </div>

      {/* Detail bullets */}
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "0 var(--space-2xl) var(--space-4xl)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-semibold)",
            fontWeight: 600,
            fontSize: "var(--text-eyebrow)",
            letterSpacing: "var(--ls-eyebrow)",
            textTransform: "uppercase",
            opacity: 0.4,
            marginBottom: "var(--space-xl)",
          }}
        >
          WHAT'S INCLUDED
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {service.details.map((detail, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-md)",
                padding: "var(--space-xl)",
                borderRadius: "var(--radius-pill)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "var(--text-body)",
                lineHeight: "var(--lh-body)",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              <span style={{ opacity: 0.3, fontFamily: "var(--font-mono)" }}>0{i + 1}</span>
              {detail}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          textAlign: "center",
          padding: "var(--space-4xl) var(--space-2xl)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link
          to="/contact"
          style={{
            display: "inline-block",
            background: "var(--color-pure-white)",
            color: "var(--color-pure-black)",
            borderRadius: "var(--radius-pill)",
            padding: "13px var(--space-xl)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            textDecoration: "none",
            marginRight: "var(--space-md)",
          }}
        >
          Book Now
        </Link>
        <Link
          to="/"
          style={{
            display: "inline-block",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
          }}
        >
          ← All Services
        </Link>
      </div>
    </div>
  );
}
