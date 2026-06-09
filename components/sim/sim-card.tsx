import Link from "next/link";
import { GoldBadge } from "@/components/ui/gold-badge";
import { GoldButton } from "@/components/ui/gold-button";
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
  const carrierVariant = sim.carrier as "viettel" | "vinaphone" | "mobifone";

  return (
    <Link href={`/sims/${sim.id}`}>
      <div
        className={cn(
          "group relative rounded-sm border border-gold-border bg-surface p-6",
          "transition-all duration-300",
          "hover:-translate-y-0.5 hover:gold-glow-hover",
          "opacity-0 animate-fade-up",
          className
        )}
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        {/* Carrier badge */}
        <div className="mb-4">
          <GoldBadge variant={carrierVariant}>
            {sim.carrier}
          </GoldBadge>
        </div>

        {/* Sim number — Playfair Display */}
        <h3 className="font-playfair text-2xl font-semibold text-text-primary mb-2 group-hover:text-gold-primary transition-colors">
          {formatPhoneNumber(sim.phone_number)}
        </h3>

        {/* Price — gold shimmer */}
        <p className="text-xl font-bold text-shimmer-gold mb-3">
          {formatPrice(sim.price)}
        </p>

        {/* Category tag */}
        {sim.category_name && (
          <span className="block text-xs text-text-secondary mb-4">
            {sim.category_name}
          </span>
        )}

        {/* CTA */}
        <GoldButton variant="secondary" size="sm" className="w-full">
          Mua ngay
        </GoldButton>

        {/* Featured shimmer border */}
        {sim.is_featured && (
          <div className="absolute inset-0 rounded-sm border border-gold-primary/30 animate-glow-pulse pointer-events-none" />
        )}
      </div>
    </Link>
  );
}
