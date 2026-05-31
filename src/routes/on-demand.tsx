import { createFileRoute } from "@tanstack/react-router";
import { CarTaxiFront, Bike, Car, ShieldCheck, Lock, MapPin, Headphones } from "lucide-react";
import { HubPage, type HubService, type HubTrust } from "@/components/HubPage";

export const Route = createFileRoute("/on-demand")({
  head: () => ({
    meta: [
      { title: "On Demand — Drivers, Bikes & Autos | easyDUD" },
      {
        name: "description",
        content:
          "Book a personal driver, pool a bike or hail an auto-rickshaw — fast, verified, on-demand mobility with easyDUD.",
      },
    ],
  }),
  component: OnDemandPage,
});

const SERVICES: HubService[] = [
  {
    Icon: CarTaxiFront,
    name: "Personal Driver",
    tagline: "Comfortable city rides with verified, top-rated drivers.",
    to: "/cab",
    img: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=900&q=80",
    features: ["Live GPS tracking", "Transparent, surge-free pricing", "Economy to luxury fleet"],
    meta: "from ₹149",
  },
  {
    Icon: Bike,
    name: "Bike Pooling",
    tagline: "Beat the traffic on quick, affordable two-wheeler rides.",
    to: "/bike-pooling",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    features: ["Up to 60% cheaper than cabs", "Helmet always included", "Electric fleet available"],
    meta: "from ₹39",
  },
  {
    Icon: Car,
    name: "Auto-Rickshaw",
    tagline: "Metered three-wheelers for short, nimble city hops.",
    to: "/auto",
    img: "https://images.unsplash.com/photo-1599831947599-7e1c5c6b9e2e?w=900&q=80",
    features: ["No-haggle fixed fares", "Quick metro & last-mile pickups", "Cash, UPI & wallet"],
    meta: "metered",
  },
];

const TRUST: HubTrust[] = [
  { Icon: ShieldCheck, label: "Verified partners", sub: "Background-checked drivers on every trip." },
  { Icon: MapPin, label: "Real-time tracking", sub: "Share your live route with loved ones." },
  { Icon: Lock, label: "Secure payments", sub: "Encrypted cards, UPI and wallets." },
  { Icon: Headphones, label: "24/7 support", sub: "A human team whenever you need help." },
];

function OnDemandPage() {
  return (
    <HubPage
      eyebrow="On Demand"
      titleLead="Mobility,"
      titleAccent="on your terms"
      accent="#2563EB"
      subtitle="Personal drivers, bike pooling and auto-rickshaws — booked in seconds, available across your city."
      heroImg="https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1920&q=80"
      services={SERVICES}
      trust={TRUST}
    />
  );
}
