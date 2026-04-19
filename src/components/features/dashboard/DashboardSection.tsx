import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DashboardSectionProps {
  eyebrow: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  id?: string;
  /** When true, only render children (no heading block) — useful for tight stacks */
  bare?: boolean;
}

/**
 * Shared section chrome for the dashboard: eyebrow label + optional title/description.
 * Matches patterns from analytics / learning apps (clear scan order, restrained typography).
 */
export function DashboardSection({
  eyebrow,
  title,
  description,
  children,
  className,
  id,
  bare,
}: DashboardSectionProps) {
  if (bare) {
    return (
      <section id={id} className={cn("min-w-0", className)}>
        {children}
      </section>
    );
  }

  return (
    <section id={id} className={cn("min-w-0 scroll-mt-8", className)}>
      <div className="mb-4 md:mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
        {title ? (
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground md:text-xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
