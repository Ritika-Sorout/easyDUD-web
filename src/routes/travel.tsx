import { createFileRoute } from "@tanstack/react-router";
import { Plane, Bus, CarTaxiFront, ShieldCheck, Lock, BadgeCheck, Headphones } from "lucide-react";
import { HubPage, type HubService, type HubTrust } from "@/components/HubPage";

export const Route = createFileRoute("/travel")({
  head: () => ({
    meta: [
      { title: "Travel — Flights, Buses & Outstation Taxis | easyDUD" },
      {
        name: "description",
        content:
          "Book domestic & international flights, intercity buses and outstation taxis — multi-modal travel, one seamless platform.",
      },
    ],
  }),
  component: TravelPage,
});

const SERVICES: HubService[] = [
  {
    Icon: Plane,
    name: "Flights",
    tagline: "Compare 500+ airlines for domestic & international fares.",
    to: "/flights",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80",
    features: ["Real-time fare comparison", "Domestic & international routes", "Instant e-tickets"],
    meta: "500+ airlines",
  },
  {
    Icon: Bus,
    name: "Buses",
    tagline: "Intercity and regional coaches with live seat selection.",
    to: "/bus",
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&q=80",
    features: ["AC, sleeper & seater options", "Pick your exact seat", "Verified operators"],
    meta: "intercity",
  },
  {
    Icon: CarTaxiFront,
    name: "Outstation Taxi",
    tagline: "Point-to-point long-distance travel with pro drivers.",
    to: "/taxi",
    img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=80",
    features: ["One-way & round trips", "Transparent per-km pricing", "Experienced highway drivers"],
    meta: "long distance",
  },
];

const TRUST: HubTrust[] = [
  { Icon: BadgeCheck, label: "Best-price promise", sub: "Live fares across trusted providers." },
  { Icon: ShieldCheck, label: "Verified operators", sub: "Rated airlines, fleets and drivers." },
  { Icon: Lock, label: "Secure checkout", sub: "Bank-grade encrypted payments." },
  { Icon: Headphones, label: "24/7 assistance", sub: "Support before, during and after travel." },
];

function TravelPage() {
  return (
    <HubPage
      eyebrow="Travel"
      titleLead="Go further,"
      titleAccent="seamlessly"
      accent="#7C3AED"
      subtitle="Flights, intercity buses and outstation taxis — every leg of your journey, booked from one place."
      heroImg="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80"
      services={SERVICES}
      trust={TRUST}
    />
  );
}
