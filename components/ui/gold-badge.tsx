import { cn } from "@/lib/utils";

interface GoldBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "viettel" | "vinaphone" | "mobifone" | "featured";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "border-gold-border text-text-secondary",
  viettel: "border-green-600/40 text-green-400 bg-green-900/20",
  vinaphone: "border-blue-600/40 text-blue-400 bg-blue-900/20",
  mobifone: "border-red-600/40 text-red-400 bg-red-900/20",
  featured: "border-gold-primary/40 text-gold-primary bg-gold-primary/10",
};

export function GoldBadge({ children, variant = "default", className }: GoldBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium uppercase tracking-wider transition-colors",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
