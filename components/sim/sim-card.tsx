import Link from "next/link";
import { formatPrice, formatPhoneNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { GoldButton } from "@/components/ui/gold-button";

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
  const carrierNames: Record<string, string> = {
    viettel: "Viettel",
    vinaphone: "VinaPhone",
    mobifone: "MobiFone",
    vietnamobile: "Vietnamobile",
  };

  const carrierColors: Record<string, string> = {
    viettel: "neon-viettel",
    vinaphone: "neon-vinaphone",
    mobifone: "neon-mobifone",
    vietnamobile: "neon-vietnamobile",
  };

  const carrierKey = sim.carrier.toLowerCase();
  const colorClass = carrierColors[carrierKey] || "neon-vietnamobile";
  const carrierName = carrierNames[carrierKey] || "Vietnamobile";

  return (
    <Link href={`/sims/${sim.id}`} className="block">
      <div
        className={cn(
          "gold-neon-card relative rounded-lg p-6 cursor-pointer h-full flex flex-col",
          "animate-fade-up",
          className
        )}
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        {/* Carrier badge */}
        <div className="mb-4">
          <span className={cn("text-sm font-bold uppercase tracking-wider", colorClass)}>
            {carrierName}
          </span>
        </div>

        {/* Sim number — Orbitron font */}
        <h3 className="font-montserrat text-2xl font-bold text-text-primary mb-3 tracking-wider">
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

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* CTA - Fixed at bottom */}
        <GoldButton className="w-full mt-auto">
          Mua ngay
        </GoldButton>

        {/* Featured glow effect */}
        {sim.is_featured && (
          <div className="absolute inset-0 rounded-lg neon-border-gold pointer-events-none opacity-60" />
        )}
      </div>
    </Link>
  );
}
