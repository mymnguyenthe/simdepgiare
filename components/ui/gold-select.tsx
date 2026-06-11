import * as React from "react";
import { cn } from "@/lib/utils";
import { FormLabel } from "./form-label";

export interface GoldSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

const GoldSelect = React.forwardRef<HTMLSelectElement, GoldSelectProps>(
  ({ className, label, id, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
        <select
          id={id}
          className={cn(
            "flex h-10 w-full rounded-sm border border-gold-border bg-surface-elevated px-3 py-2 text-sm text-text-primary",
            "focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary",
            "transition-all duration-300",
            "appearance-none cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
GoldSelect.displayName = "GoldSelect";

export { GoldSelect };
