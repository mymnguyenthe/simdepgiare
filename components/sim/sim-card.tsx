import Link from "next/link";
import { formatPrice, formatPhoneNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SimCardProps {
  sim: {
    id: string;
    phone_number: string;
    price: number;
    carrier: string;
    category_name?: string;
    is_featured?: boolean;
  };
  className?: string;
  animationDelay?: number;
}

export function SimCard({ sim, className, animationDelay = 0 }: SimCardProps) {
  const carrierColors = {
    viettel: "neon-viettel",
    vinaphone: "neon-vinaphone",
    mobifone: "neon-mobifone",
  };

  const carrierVariant = sim.carrier as keyof typeof carrierColors;
  const colorClass = carrierColors[carrierVariant] || "neon-viettel";

  return (
    <Link href={`/sims/${sim.id}`}>
      <div
        className={cn(
          "gold-neon-card relative rounded-lg p-6 cursor-pointer",
          "opacity-0 animate-fade-up",
          className
        )}
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        {/* Carrier badge */}
        <div className="mb-4">
          <span className={cn("text-sm font-bold uppercase tracking-wider", colorClass)}>
            {sim.carrier}
          </span>
        </div>

        {/* Sim number — Orbitron font */}
        <h3 className="font-orbitron text-2xl font-bold text-text-primary mb-3 tracking-wider">
          {formatPhoneNumber(sim.phone_number)}
        </h3>

        {/* Price — gold neon */}
        <p className="text-2xl font-bold neon-text-gold mb-4">
          {formatPrice(sim.price)}
        </p>

        {/* Category tag */}
        {sim.category_name && (
          <span className="block text-xs text-text-secondary mb-4 uppercase tracking-wide">
            {sim.category_name}
          </span>
        )}

        {/* CTA */}
        <button className="gold-neon-btn w-full py-3 rounded-md text-sm">
          Mua ngay
        </button>

        {/* Featured glow effect */}
        {sim.is_featured && (
          <div className="absolute inset-0 rounded-lg neon-border-gold pointer-events-none opacity-60" />
        )}
      </div>
    </Link>
  );
}
