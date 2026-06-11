import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const goldButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-gold-deep via-gold-primary to-gold-bright text-background hover:shadow-[0_0_24px_rgba(212,175,55,0.35)] hover:brightness-110",
        secondary:
          "border border-gold-primary text-gold-primary bg-transparent hover:bg-gold-primary/10",
        ghost:
          "text-gold-primary hover:underline underline-offset-4",
        destructive:
          "bg-error text-background hover:bg-error/90",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface GoldButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof goldButtonVariants> {}

const GoldButton = React.forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(goldButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GoldButton.displayName = "GoldButton";

export { GoldButton, goldButtonVariants };
