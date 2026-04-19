"use client";

import { BookOpen, LineChart, Library } from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardTabId = "study" | "insights" | "library";

const tabs: {
  id: DashboardTabId;
  label: string;
  icon: typeof BookOpen;
}[] = [
  { id: "study", label: "Study", icon: BookOpen },
  { id: "insights", label: "Insights", icon: LineChart },
  { id: "library", label: "Library", icon: Library },
];

interface DashboardTabNavProps {
  active: DashboardTabId;
  onChange: (id: DashboardTabId) => void;
}

export function DashboardTabNav({ active, onChange }: DashboardTabNavProps) {
  return (
    <nav
      role="tablist"
      aria-label="Dashboard sections"
      className="flex w-full gap-1 rounded-2xl border border-border/80 bg-muted/25 p-1 shadow-sm sm:w-fit"
    >
      {tabs.map((t) => {
        const Icon = t.icon;
        const selected = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={selected}
            id={`tab-${t.id}`}
            aria-controls={`panel-${t.id}`}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all sm:flex-initial sm:min-w-[7.5rem]",
              selected
                ? "bg-card text-foreground shadow-sm ring-1 ring-border/60"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            <span className="truncate">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
