import { cn } from "@/lib/utils";

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}

export function ShimmerText({
  children,
  className,
  as: Tag = "span",
}: ShimmerTextProps) {
  return (
    <Tag className={cn("text-shimmer-gold", className)}>
      {children}
    </Tag>
  );
}
