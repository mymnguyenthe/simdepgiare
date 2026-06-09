import * as React from "react";
import { cn } from "@/lib/utils";

export interface GoldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const GoldInput = React.forwardRef<HTMLInputElement, GoldInputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-medium uppercase tracking-widest text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          className={cn(
            "flex h-10 w-full rounded-sm border border-gold-border bg-surface-elevated px-3 py-2 text-sm text-text-primary",
            "placeholder:text-text-muted",
            "focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary",
            "transition-all duration-300",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
GoldInput.displayName = "GoldInput";

export { GoldInput };
